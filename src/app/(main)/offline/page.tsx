import Offline from "@/components/features/errors/Offline";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline - Grand Market",
  description: "You are currently offline.",
};

export default function OfflinePage() {
  return <Offline />;
}
