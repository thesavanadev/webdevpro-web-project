import type { Metadata } from "next";

import { Page, Post, Product } from "@/payload-types";

import { mergeOpenGraph } from "@/lib/merge-open-graph";

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL!;

export const generateMeta = async (args: { doc: Page | Post | Product }): Promise<Metadata> => {
	const { doc } = args || {};

	const ogImage =
		typeof doc?.meta?.image === "object" && doc.meta.image !== null && "url" in doc.meta.image && `${serverURL}${doc.meta.image.url}`;

	const title = doc?.meta?.title ? doc?.meta?.title + " | WebDevPro" : "WebDevPro";

	return {
		description: doc?.meta?.description,
		openGraph: mergeOpenGraph({
			description: doc?.meta?.description ?? "",
			images: ogImage
				? [
						{
							url: ogImage,
						},
					]
				: undefined,
			title,
			url: Array.isArray(doc?.slug) ? doc?.slug.join("/") : "/",
		}),
		title,
	};
};
