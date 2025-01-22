import type { Metadata } from "next";

const publicURL = process.env.NEXT_PUBLIC_SERVER_URL!;

const defaultOpenGraph: Metadata["openGraph"] = {
	type: "website",
	description: "Sample website for learning Payload CMS version 3.0",
	images: [
		{
			url: publicURL ? `${publicURL}/webdevpro-og.webp` : "/webdevpro-og.webp",
		},
	],
	siteName: "WebDevPro",
	title: "WebDevPro",
};

export const mergeOpenGraph = (og?: Metadata["openGraph"]): Metadata["openGraph"] => {
	return {
		...defaultOpenGraph,
		...og,
		images: og?.images ? og.images : defaultOpenGraph.images,
	};
};
