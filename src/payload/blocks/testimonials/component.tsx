import { unstable_cache } from "next/cache";
import Image from "next/image";

import { getPayload } from "payload";
import config from "@payload-config";

import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Container } from "@/components/container";
import { RichText } from "@/components/rich-text";

type TestimonialsBlockProps = { caption: object };

const publicURL = process.env.NEXT_PUBLIC_SERVER_URL!;

const data = await getPayload({ config: config });

const getTestimonials = unstable_cache(
	async () => {
		return await data.find({
			collection: "testimonials",
			sort: "order:asc",
		});
	},
	["testimonials"],
	{ revalidate: 60, tags: ["testimonials"] },
);

export const TestimonialsBlock = async ({ caption }: TestimonialsBlockProps) => {
	const allTestimonials = await getTestimonials();

	return (
		<Container className="my-16 space-y-8">
			<div>{caption && <RichText className="mb-0" content={caption} enableGutter={false} />}</div>

			<div className="mx-auto w-full max-w-5xl px-3 py-8">
				<Carousel className="w-full">
					<CarouselContent>
						{allTestimonials.docs.map((testimonial) => (
							<CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
								<div className="p-1">
									<Card className="bg-background">
										<CardContent className="flex flex-col items-center p-5">
											<Image
												src={testimonial.image && typeof testimonial.image === "object" ? `${publicURL}${testimonial.image.url}` : ""}
												alt={`${testimonial.firstName} ${testimonial.lastName}`}
												width={100}
												height={100}
												className="mb-4 rounded-full"
												sizes="(max-width: 640px) 100vw, (max-width: 768px) 640px, (max-width: 1024px) 768px, (max-width: 1280px) 1024px, 1280px"
											/>
											<h3 className="mb-1 text-lg font-semibold text-primary">
												{testimonial.firstName} {testimonial.lastName}
											</h3>
											<p className="mb-4 text-sm text-muted-foreground">{testimonial.job}</p>
											<p className="line-clamp-2 text-center text-foreground">{testimonial.content}</p>
										</CardContent>
									</Card>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</div>
		</Container>
	);
};
