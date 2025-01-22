import { MetaDescriptionField, MetaImageField, MetaTitleField, OverviewField, PreviewField } from "@payloadcms/plugin-seo/fields";

import { generatePreviewPath } from "@/lib/generate-preview-path";

import { slugField } from "@/payload/fields/slug";

import { authenticated } from "@/payload/access/authenticated";
import { authenticatedOrPublished } from "@/payload/access/authenticated-or-published";

import { revalidateProduct } from "@/payload/collections/products/hooks/revalidate-product";

import type { CollectionConfig } from "payload";

const publicURL = process.env.NEXT_PUBLIC_SERVER_URL!;

const Products: CollectionConfig = {
	slug: "products",
	labels: {
		singular: "Product",
		plural: "Products",
	},
	admin: {
		defaultColumns: ["title", "description", "price", "createdAt", "updatedAt"],
		livePreview: {
			url: ({ data }) => {
				const path = generatePreviewPath({
					slug: typeof data?.slug === "string" ? data.slug : "",
					collection: "products",
				});

				return `${publicURL}${path}`;
			},
		},
		preview: (data) => {
			const path = generatePreviewPath({
				slug: typeof data?.slug === "string" ? data.slug : "",
				collection: "products",
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
							name: "images",
							label: "Product Image",
							type: "upload",
							relationTo: "media",
							required: true,
						},
						{
							name: "description",
							label: "Description",
							type: "textarea",
							required: true,
						},
						{
							name: "perks",
							label: "Perks",
							type: "array",
							minRows: 1,
							maxRows: 5,
							fields: [
								{
									name: "description",
									label: "Description",
									type: "text",
								},
							],
						},
					],
				},
				{
					label: "Meta",
					fields: [
						{
							name: "products",
							label: "Related Products",
							type: "relationship",
							relationTo: "products",
							hasMany: true,
							filterOptions: ({ id }) => {
								return {
									id: {
										not_in: [id],
									},
								};
							},
						},
						{
							name: "categories",
							label: "Categories",
							type: "relationship",
							relationTo: "categories",
							hasMany: true,
						},
						{
							name: "plans",
							label: "Related Plans",
							type: "relationship",
							relationTo: "plans",
							hasMany: true,
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
			name: "price",
			label: "Price",
			type: "number",
			required: true,
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "featured",
			label: "Featured Product",
			type: "checkbox",
			admin: {
				position: "sidebar",
			},
		},
	],
	hooks: {
		afterChange: [revalidateProduct],
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

export default Products;
