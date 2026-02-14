import { ReactNode } from "react";
export default function AuthSubTitle({ children }: { children: ReactNode }) {
  return <h3 className="mb-6 text-base font-bold">{children}</h3>;
}
