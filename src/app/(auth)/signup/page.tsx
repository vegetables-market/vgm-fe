import SignupClient from "./signup-client";

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function getFirst(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default function SignupPage({ searchParams }: PageProps) {
  const email = getFirst(searchParams?.email);
  const flowId = getFirst(searchParams?.flow_id);

  return <SignupClient initialEmail={email || ""} initialFlowId={flowId || ""} />;
}
