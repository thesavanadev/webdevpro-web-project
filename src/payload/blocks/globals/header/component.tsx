import { unstable_cache } from "next/cache";
import Link from "next/link";

import { getPayload } from "payload";
import config from "@payload-config";

import { Container } from "@/components/container";
import { CMSLink } from "@/components/cms-link";
import { ModeToggle } from "@/components/mode-toggle";
import { RenderImage } from "@/components/render-image";

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL!;

export type PricingPlansBlockProps = {
	caption: object;
};

const data = await getPayload({ config: config });

const getHeader = unstable_cache(
	async () => {
		return await data.findGlobal({
			slug: "header",
		});
	},
	["header"],
	{ revalidate: 60, tags: ["header"] },
);

export const HeaderBlock = async () => {
	const header = await getHeader();

	const logoURL = header.common.logo && typeof header.common.logo === "object" ? header.common.logo.url : null;
	const logoALT = header.common.logo && typeof header.common.logo === "object" ? header.common.logo.alt : null;

	return (
		<nav className="bg-white shadow dark:bg-gray-800">
			<Container className="flex items-center justify-between py-5 capitalize text-gray-500 dark:text-gray-300">
				<div>
					<Link href="/" className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
						<div className="relative h-8 w-8">
							<RenderImage imageSrc={`${serverURL}${logoURL}`} imageAlt={`${serverURL}${logoALT}`} />
						</div>

						<p className="text-xl font-bold">{header.common.name}</p>
					</Link>
				</div>

				<div className="flex items-center">
					<div>
						{header.heading.map(({ link }, i) => {
							return (
								<CMSLink
									className="mx-1 transform border-b-2 border-transparent text-sm font-medium transition-colors duration-300 hover:border-blue-500 hover:text-gray-800 dark:hover:text-gray-200 sm:mx-5"
									key={i}
									{...link}
								/>
							);
						})}
					</div>

					<ModeToggle />
				</div>
			</Container>
		</nav>
	);
};
