import "server-only";

import StockEditClient from "./StockEditClient";

export const dynamic = "force-dynamic";

export default async function StockEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StockEditClient id={id} />;
}
