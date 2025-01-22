import { unstable_cache } from "next/cache";
import Link from "next/link";

import { getPayload } from "payload";
import config from "@payload-config";

import { Separator } from "@/components/ui/separator";
import { CMSLink } from "@/components/cms-link";
import { Container } from "@/components/container";
import { RenderImage } from "@/components/render-image";

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL!;

const data = await getPayload({ config: config });

const getFooter = unstable_cache(
	async () => {
		return await data.findGlobal({
			slug: "footer",
		});
	},
	["footer"],
	{ revalidate: 60, tags: ["footer"] },
);

export const FooterBlock = async () => {
	const footer = await getFooter();

	const logoURL = footer.common.logo && typeof footer.common.logo === "object" ? footer.common.logo.url : null;
	const logoALT = footer.common.logo && typeof footer.common.logo === "object" ? footer.common.logo.alt : null;

	return (
		<div className="bg-white dark:bg-gray-900">
			<Container className="py-6">
				<div className="lg:flex">
					<div className="w-full lg:w-2/5">
						<div>
							<Link href="/" className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
								<div className="relative h-8 w-8">
									<RenderImage imageSrc={`${serverURL}${logoURL}`} imageAlt={`${serverURL}${logoALT}`} />
								</div>

								<p className="text-xl font-bold">{footer.common.name}</p>
							</Link>

							<p className="mt-2 text-left text-gray-500 dark:text-gray-400">{footer.common.description}</p>
						</div>
					</div>

					<div className="mt-6 lg:mt-0 lg:flex-1">
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
							<div className="text-justify">
								<h3 className="uppercase text-gray-700 dark:text-white">Discover</h3>
								<div>
									{footer.discover?.map(({ link }, i) => {
										return <CMSLink className="mt-2 block text-sm text-gray-600 hover:underline dark:text-gray-400" key={i} {...link} />;
									})}
								</div>
							</div>

							<div className="text-justify">
								<h3 className="uppercase text-gray-700 dark:text-white">Legal</h3>
								<div>
									{footer.legal?.map(({ link }, i) => {
										return <CMSLink className="mt-2 block text-sm text-gray-600 hover:underline dark:text-gray-400" key={i} {...link} />;
									})}
								</div>
							</div>

							<div className="text-justify">
								<h3 className="uppercase text-gray-700 dark:text-white">Miscellaneous</h3>
								<div>
									{footer.miscellaneous?.map(({ link }, i) => {
										return <CMSLink className="mt-2 block text-sm text-gray-600 hover:underline dark:text-gray-400" key={i} {...link} />;
									})}
								</div>
							</div>
						</div>
					</div>
				</div>

				<Separator className="my-6 bg-gray-200 dark:bg-gray-700" />

				<div>
					<p className="text-center text-gray-500 dark:text-gray-400">{footer.common.copyright}</p>
				</div>
			</Container>
		</div>
	);
};
