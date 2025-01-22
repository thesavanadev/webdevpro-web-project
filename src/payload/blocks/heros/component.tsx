import { cn } from "@/lib/utils";

import { Container } from "@/components/container";
import { RenderImage } from "@/components/render-image";

type HeroBlockProps = {
	coverImage: { url: string };
	message: string;
	title: string;
	type: string;
};

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL!;

export const HeroBlock = ({ coverImage, message, title, type }: HeroBlockProps) => {
	return (
		<Container className={cn("w-full", { "h-[50rem]": type === "homepage", "h-[30rem]": type === "subpage" })}>
			<div className="relative h-full w-full">
				<RenderImage imageAlt="Hero image" imageSrc={`${serverURL}${coverImage.url}`} />

				<div className="absolute left-0 top-0 h-full w-full rounded-lg bg-gray-900/40"></div>

				<div className="absolute flex h-full w-full items-center justify-center">
					<div className="text-center">
						<h1 className="text-3xl font-semibold text-white lg:text-5xl">{title}</h1>
						<h2 className="mt-6 text-lg text-white">{message}</h2>
					</div>
				</div>
			</div>
		</Container>
	);
};
