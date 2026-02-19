import Link from "next/link";
import { withRedirectTo } from "@/lib/next/withRedirectTo";

type Props = {
  linkText: string;
  href: string;
  redirectTo?: string | null;
};

export default function AuthRecoveryText({
  linkText,
  href,
  redirectTo,
}: Props) {
  return (
    <div className="mt-1 text-xs">
      <Link
        href={withRedirectTo(href, redirectTo)}
        className="text-disabled-foreground hover:text-muted-foreground cursor-pointer hover:underline"
      >
        {linkText}
      </Link>
    </div>
  );
}
