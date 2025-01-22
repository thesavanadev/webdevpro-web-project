import { MetaDescriptionField, MetaImageField, MetaTitleField, OverviewField, PreviewField } from "@payloadcms/plugin-seo/fields";

import { generatePreviewPath } from "@/lib/generate-preview-path";

import { slugField } from "@/payload/fields/slug";

import { authenticated } from "@/payload/access/authenticated";
import { authenticatedOrPublished } from "@/payload/access/authenticated-or-published";

import { populatePublishedAt } from "@/payload/hooks/populate-published-at";
import { revalidatePage } from "@/payload/collections/pages/hooks/revalidate-page";

import { CallToAction } from "@/payload/blocks/call-to-action/schema";
import { ContentGrid } from "@/payload/blocks/content-grid/schema";
import { ContentPad } from "@/payload/blocks/content-pad/schema";
import { Faqs } from "@/payload/blocks/faqs/schema";
import { Forms } from "@/payload/blocks/forms/schema";
import { Hero } from "@/payload/blocks/heros/schema";
import { Logos } from "@/payload/blocks/logos/schema";
import { Multimedia } from "@/payload/blocks/multimedia/schema";
import { PostsArchive } from "@/payload/blocks/posts-archive/schema";
import { PricingPlans } from "@/payload/blocks/pricing-plans/schema";
import { ProductsArchive } from "@/payload/blocks/products-archive/schema";
import { Testimonials } from "@/payload/blocks/testimonials/schema";

import type { CollectionConfig } from "payload";

const publicURL = process.env.NEXT_PUBLIC_SERVER_URL!;

const Pages: CollectionConfig = {
	slug: "pages",
	labels: {
		singular: "Page",
		plural: "Pages",
	},
	admin: {
		defaultColumns: ["title", "slug", "updatedAt"],
		livePreview: {
			url: ({ data }) => {
				const path = generatePreviewPath({
					slug: typeof data?.slug === "string" ? data.slug : "",
					collection: "pages",
				});

				return `${publicURL}${path}`;
			},
		},
		preview: (data) => {
			const path = generatePreviewPath({
				slug: typeof data?.slug === "string" ? data.slug : "",
				collection: "pages",
			});

			return `${publicURL}${path}`;
		},
		useAsTitle: "title",
	},
	access: {
		create: authenticated,
		delete: authenticated,
		read: authenticatedOrPublished,
		update: authenticated,
	},
	fields: [
		{
			name: "title",
			label: "Title",
			type: "text",
			required: true,
		},
		{
			type: "tabs",
			tabs: [
				{
					label: "Content",
					fields: [
						{
							name: "layout",
							label: "Layout",
							type: "blocks",
							blocks: [
								Hero,
								ContentPad,
								ContentGrid,
								Multimedia,
								PostsArchive,
								ProductsArchive,
								CallToAction,
								Forms,
								PricingPlans,
								Faqs,
								Logos,
								Testimonials,
							],
							required: true,
						},
					],
				},
				{
					name: "meta",
					label: "SEO",
					fields: [
						OverviewField({
							titlePath: "meta.title",
							descriptionPath: "meta.description",
							imagePath: "meta.image",
						}),
						MetaTitleField({
							hasGenerateFn: true,
						}),
						MetaImageField({
							relationTo: "media",
						}),
						MetaDescriptionField({}),
						PreviewField({
							// if the `generateUrl` function is configured
							hasGenerateFn: true,

							// field paths to match the target field for data
							titlePath: "meta.title",
							descriptionPath: "meta.description",
						}),
					],
				},
			],
		},
		...slugField(),
		{
			name: "publishedAt",
			type: "date",
			admin: {
				position: "sidebar",
			},
		},
	],
	hooks: {
		afterChange: [revalidatePage],
		beforeChange: [populatePublishedAt],
	},
	versions: {
		drafts: {
			autosave: {
				interval: 100, // set this interval for optimal live preview
			},
		},
		maxPerDoc: 50,
	},
};

export default Pages;
