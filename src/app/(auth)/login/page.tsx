import { LoginContainer } from "@/components/features/auth/containers/LoginContainer";

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function LoginPage({ searchParams }: PageProps) {
  return <LoginContainer searchParams={searchParams} />;
}
