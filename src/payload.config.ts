import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { resendAdapter } from "@payloadcms/email-resend";
import {
	BoldFeature,
	FixedToolbarFeature,
	HeadingFeature,
	HorizontalRuleFeature,
	ItalicFeature,
	LinkFeature,
	lexicalEditor,
	OrderedListFeature,
	UnderlineFeature,
	UnorderedListFeature,
} from "@payloadcms/richtext-lexical";
import { formBuilderPlugin } from "@payloadcms/plugin-form-builder";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { uploadthingStorage } from "@payloadcms/storage-uploadthing";
import { buildConfig } from "payload";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

import Categories from "@/payload/collections/categories/schema";
import Faqs from "@/payload/collections/faqs/schema";
import Logos from "@/payload/collections/logos/schema";
import Media from "@/payload/collections/media/schema";
import Pages from "@/payload/collections/pages/schema";
import Plans from "@/payload/collections/plans/schema";
import Posts from "@/payload/collections/posts/schema";
import Products from "@/payload/collections/products/schema";
import Testimonials from "@/payload/collections/testimonials/schema";
import Users from "@/payload/collections/users/schema";

import Footer from "@/payload/blocks/globals/footer/schema";
import Header from "@/payload/blocks/globals/header/schema";

import { GenerateTitle, GenerateURL } from "@payloadcms/plugin-seo/types";
import { Page, Post } from "@/payload-types";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const generateTitle: GenerateTitle<Page | Post> = ({ doc }) => {
	return doc?.title ? `${doc.title} | WebDevPro` : "WebDevPro";
};

const generateURL: GenerateURL<Page | Post> = ({ doc }) => {
	return doc?.slug ? `${process.env.NEXT_PUBLIC_SERVER_URL!}/${doc.slug}` : process.env.NEXT_PUBLIC_SERVER_URL!;
};

export default buildConfig({
	admin: {
		importMap: {
			baseDir: path.resolve(dirname),
		},
		livePreview: {
			breakpoints: [
				{
					label: "Mobile",
					name: "mobile",
					width: 375,
					height: 667,
				},
				{
					label: "Tablet",
					name: "tablet",
					width: 768,
					height: 1024,
				},
				{
					label: "Desktop",
					name: "desktop",
					width: 1440,
					height: 900,
				},
			],
		},
		meta: {
			titleSuffix: " | Payload",
		},
		user: Users.slug,
	},
	collections: [Pages, Posts, Products, Plans, Categories, Faqs, Logos, Testimonials, Media, Users],
	db: mongooseAdapter({ url: process.env.DATABASE_URI! }),
	editor: lexicalEditor({
		features: () => {
			return [
				BoldFeature(),
				ItalicFeature(),
				LinkFeature({
					enabledCollections: ["pages", "posts"],
					fields: ({ defaultFields }) => {
						const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
							if ("name" in field && field.name === "url") return false;
							return true;
						});
						return [
							...defaultFieldsWithoutUrl,
							{
								name: "url",
								type: "text",
								admin: {
									condition: ({ linkType }) => linkType !== "internal",
								},
								label: ({ t }) => t("fields:enterURL"),
								required: true,
							},
						];
					},
				}),
				HeadingFeature({ enabledHeadingSizes: ["h2", "h3", "h4"] }),
				HorizontalRuleFeature(),
				OrderedListFeature(),
				UnderlineFeature(),
				UnorderedListFeature(),
			];
		},
	}),
	email: resendAdapter({
		defaultFromAddress: process.env.RESEND_FROM_EMAIL!,
		defaultFromName: process.env.RESEND_FROM_NAME!,
		apiKey: process.env.RESEND_API_KEY!,
	}),
	globals: [Header, Footer],
	plugins: [
		formBuilderPlugin({
			fields: {
				payment: false,
			},
			formOverrides: {
				fields: ({ defaultFields }) => {
					return defaultFields.map((field) => {
						if ("name" in field && field.name === "confirmationMessage") {
							return {
								...field,
								editor: lexicalEditor({
									features: ({ rootFeatures }) => {
										return [
											...rootFeatures,
											BoldFeature(),
											ItalicFeature(),
											FixedToolbarFeature(),
											HeadingFeature({ enabledHeadingSizes: ["h2", "h3", "h4"] }),
											HorizontalRuleFeature(),
											OrderedListFeature(),
											UnderlineFeature(),
											UnorderedListFeature(),
										];
									},
								}),
							};
						}
						return field;
					});
				},
			},
		}),
		seoPlugin({
			generateTitle,
			generateURL,
		}),
		uploadthingStorage({
			collections: {
				[Media.slug]: true,
			},
			options: {
				token: process.env.UPLOADTHING_TOKEN!,
				acl: "public-read",
			},
		}),
	],
	secret: process.env.PAYLOAD_SECRET!,
	sharp,
	typescript: {
		outputFile: path.resolve(dirname, "payload-types.ts"),
	},
});
