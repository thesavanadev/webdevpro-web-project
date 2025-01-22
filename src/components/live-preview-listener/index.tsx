"use client";

import { useRouter } from "next/navigation";
import { RefreshRouteOnSave as PayloadLivePreview } from "@payloadcms/live-preview-react";

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL!;

export const LivePreviewListener = () => {
	const router = useRouter();

	return <PayloadLivePreview refresh={router.refresh} serverURL={serverURL} />;
};
