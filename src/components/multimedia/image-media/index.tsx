"use client";

import { useState } from "react";
import NextImage from "next/image";

import { cn } from "@/lib/utils";

import type { StaticImageData } from "next/image";
import type { Props as MediaProps } from "@/components/multimedia/types";

import cssVariables from "@/cssVariables";

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL!;

const { breakpoints } = cssVariables;

export const ImageMedia = (props: MediaProps) => {
	const {
		alt: altFromProps,
		fill,
		imgClassName,
		onClick,
		onLoad: onLoadFromProps,
		priority,
		resource,
		size: sizeFromProps,
		src: srcFromProps,
	} = props;

	const [isLoading, setIsLoading] = useState(true);

	let width: number | undefined;
	let height: number | undefined;
	let alt = altFromProps;
	let src: StaticImageData | string = srcFromProps || "";

	if (!src && resource && typeof resource === "object") {
		const { alt: altFromResource, filename: fullFilename, height: fullHeight, url, width: fullWidth } = resource;

		width = fullWidth!;
		height = fullHeight!;
		alt = altFromResource;
		src = `${serverURL}${url}`;
	}

	// NOTE: this is used by the browser to determine which image to download at different screen sizes
	const sizes = sizeFromProps
		? sizeFromProps
		: Object.entries(breakpoints)
				.map(([, value]) => `(max-width: ${value}px) ${value}px`)
				.join(", ");

	return (
		<NextImage
			alt={alt || ""}
			className={cn(imgClassName)}
			fill={fill}
			height={!fill ? height : undefined}
			onClick={onClick}
			onLoad={() => {
				setIsLoading(false);
				if (typeof onLoadFromProps === "function") {
					onLoadFromProps();
				}
			}}
			priority={priority}
			quality={90}
			sizes={sizes}
			src={src}
			width={!fill ? width : undefined}
		/>
	);
};
