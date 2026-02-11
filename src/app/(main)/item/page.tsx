import { redirect } from "next/navigation";

type ItemPageProps = {
  searchParams: {
    id?: string;
  };
};

export default function ItemPage({ searchParams }: ItemPageProps) {
  if (searchParams.id) {
    redirect(`/stocks/${searchParams.id}`);
  }

  redirect("/stocks");
}
