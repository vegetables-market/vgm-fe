import { SignupContainer } from "@/components/features/auth/containers/SignupContainer";

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function SignupPage({ searchParams }: PageProps) {
  return <SignupContainer searchParams={searchParams} />;
}
