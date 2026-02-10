import { ChallengeContainer } from "@/components/features/auth/containers/ChallengeContainer";

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function ChallengePage({ searchParams }: PageProps) {
  return <ChallengeContainer searchParams={searchParams} />;
}
