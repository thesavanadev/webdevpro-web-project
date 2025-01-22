import { unstable_cache } from "next/cache";
import Image from "next/image";

import { getPayload } from "payload";
import config from "@payload-config";

import { Container } from "@/components/container";
import { RichText } from "@/components/rich-text";

type LogosBlockProps = { caption: object };

const publicURL = process.env.NEXT_PUBLIC_SERVER_URL!;

const data = await getPayload({ config: config });

const getLogos = unstable_cache(
	async () => {
		return await data.find({
			collection: "logos",
			sort: "order:asc",
		});
	},
	["logos"],
	{ revalidate: 60, tags: ["logos"] },
);

export const LogosBlock = async ({ caption }: LogosBlockProps) => {
	const allLogos = await getLogos();

	return (
		<Container className="my-16 space-y-8">
			<div>{caption && <RichText className="mb-0" content={caption} enableGutter={false} />}</div>

			<div className="flex flex-wrap justify-center gap-8">
				{allLogos.docs.map((logo) => (
					<div
						key={logo.id}
						className="flex aspect-[3/2] w-[calc(50%-1rem)] items-center justify-center rounded-lg border bg-white p-4 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-500 dark:bg-gray-800 sm:w-[calc(33.33%-1rem)] md:w-[calc(25%-1rem)] lg:w-[calc(20%-1rem)]"
					>
						<Image
							src={logo.logoImage && typeof logo.logoImage === "object" ? `${publicURL}${logo.logoImage.url}` : ""}
							alt="Company logo"
							width={200}
							height={100}
							className="max-h-full max-w-full object-contain"
							sizes="(max-width: 640px) 100vw, (max-width: 768px) 640px, (max-width: 1024px) 768px, (max-width: 1280px) 1024px, 1280px"
						/>
					</div>
				))}
			</div>
		</Container>
	);
};
