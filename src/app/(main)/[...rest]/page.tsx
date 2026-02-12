import NotFound404 from "@/components/features/errors/NotFound404";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function CatchAllPage() {
  return <NotFound404 />;
}
