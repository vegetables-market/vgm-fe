import { redirect } from "next/navigation";

type LegacyStockDetailRedirectPageProps = {
  params: {
    id: string;
  };
};

export default function LegacyStockDetailRedirectPage({ params }: LegacyStockDetailRedirectPageProps) {
  redirect(`/stocks/${params.id}`);
}
