import "server-only";

import DeviceDetailClient from "./DeviceDetailClient";

export const dynamicParams = false;

export async function generateStaticParams() {
  return [{ sessionId: "0" }];
}

type PageProps = {
  params: { sessionId: string };
};

export default function Page({ params }: PageProps) {
  return <DeviceDetailClient sessionId={params.sessionId} />;
}
