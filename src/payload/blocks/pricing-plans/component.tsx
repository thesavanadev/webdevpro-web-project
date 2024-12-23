import { unstable_cache } from "next/cache";

import { getPayload } from "payload";
import config from "@payload-config";

import { Container } from "@/components/container";
import { PricingCard } from "@/components/pricing-card";
import { RichText } from "@/components/rich-text";

export type PricingPlansBlockProps = {
	caption: object;
};

const data = await getPayload({ config: config });

const getPricingPlans = unstable_cache(
	async () => {
		return await data.find({
			collection: "plans",
			sort: "order:asc",
		});
	},
	["plans"],
	{ revalidate: 60, tags: ["plans"] },
);

export const PricingPlansBlock = async ({ caption }: PricingPlansBlockProps) => {
	const allPlans = await getPricingPlans();

	return (
		<Container className="my-16 space-y-8">
			<div className="mb-16">{caption && <RichText className="mb-0" content={caption} enableGutter={false} />}</div>

			<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				{allPlans.docs.map((plan) => (
					<PricingCard
						key={plan.id}
						title={plan.title}
						price={plan.price ?? 0}
						perks={plan.perks}
						additionalPerks={plan.additionalPerks ?? []}
						featured={plan.featured ?? false}
					/>
				))}
			</div>
		</Container>
	);
};
