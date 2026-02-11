import { redirect } from "next/navigation";

export default function LegacyStocksRedirectPage() {
  redirect("/stocks");
}
