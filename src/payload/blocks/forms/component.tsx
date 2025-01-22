"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { RichText } from "@/components/rich-text";

import { buildInitialFormState } from "@/payload/blocks/forms/build-Initial-form-state";
import { fields } from "@/payload/blocks/forms/fields";

import type { Form as FormType } from "@payloadcms/plugin-form-builder/types";
export type Value = unknown;

export type Data = {
	[key: string]: Property | Property[];
};

export type Property = {
	[key: string]: Value;
};

export type FormBlockType = {
	blockName?: string;
	blockType?: "forms";
	enableContent: boolean;
	form: FormType;
	content?: {
		[k: string]: unknown;
	}[];
};

const publicURL = process.env.NEXT_PUBLIC_SERVER_URL!;

export const FormBlock = (props: { id?: string } & FormBlockType) => {
	const {
		enableContent,
		form: formFromProps,
		form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
		content,
	} = props;

	const formMethods = useForm({ defaultValues: buildInitialFormState(formFromProps.fields) });
	const {
		control,
		formState: { errors },
		handleSubmit,
		register,
	} = formMethods;

	const [isLoading, setIsLoading] = useState(false);
	const [hasSubmitted, setHasSubmitted] = useState<boolean>();
	const [error, setError] = useState<{ message: string; status?: string } | undefined>();
	const router = useRouter();

	const onSubmit = useCallback(
		(data: Data) => {
			let loadingTimerID: ReturnType<typeof setTimeout>;

			const submitForm = async () => {
				setError(undefined);

				const dataToSend = Object.entries(data).map(([name, value]) => ({
					field: name,
					value,
				}));

				// delay loading indicator by 1s
				loadingTimerID = setTimeout(() => {
					setIsLoading(true);
				}, 1000);

				try {
					const req = await fetch(`${publicURL}/api/form-submissions`, {
						body: JSON.stringify({
							form: formID,
							submissionData: dataToSend,
						}),
						headers: {
							"Content-Type": "application/json",
						},
						method: "POST",
					});

					const res = await req.json();

					clearTimeout(loadingTimerID);

					if (req.status >= 400) {
						setIsLoading(false);

						setError({
							message: res.errors?.[0]?.message || "Internal Server Error",
							status: res.status,
						});

						return;
					}

					setIsLoading(false);
					setHasSubmitted(true);

					if (confirmationType === "redirect" && redirect) {
						const { url } = redirect;

						const redirectUrl = url;

						if (redirectUrl) router.push(redirectUrl);
					}
				} catch (err) {
					console.warn(err);
					setIsLoading(false);
					setError({
						message: "An unknown error has occurred.",
					});
				}
			};

			void submitForm();
		},
		[router, formID, redirect, confirmationType],
	);

	return (
		<Container className="py-16 lg:max-w-[48rem]">
			<FormProvider {...formMethods}>
				{enableContent && content && !hasSubmitted && <RichText className="mb-8" content={content} enableGutter={false} />}

				{!isLoading && hasSubmitted && confirmationType === "message" && <RichText content={confirmationMessage} />}

				{isLoading && !hasSubmitted && <p>Loading, please wait...</p>}

				{error && <div>{`${error.status || "500"}: ${error.message || ""}`}</div>}

				{!hasSubmitted && (
					<form id={formID} onSubmit={handleSubmit(onSubmit)}>
						<div className="mb-4 last:mb-0">
							{formFromProps &&
								formFromProps.fields &&
								formFromProps.fields?.map((field, index) => {
									const Field = fields?.[field.blockType as keyof typeof fields] as any;

									if (Field) {
										return (
											<div className="mb-6 last:mb-0" key={index}>
												<Field form={formFromProps} {...field} {...formMethods} control={control} errors={errors} register={register} />
											</div>
										);
									}

									return null;
								})}
						</div>

						<Button form={formID} type="submit" variant="default">
							{submitButtonLabel}
						</Button>
					</form>
				)}
			</FormProvider>
		</Container>
	);
};
