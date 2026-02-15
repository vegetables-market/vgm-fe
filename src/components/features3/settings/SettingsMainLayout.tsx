import { ReactNode } from "react";
export default function SettingsMainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex-1 overflow-y-auto">
      <main className="flex w-full cursor-default justify-center text-center">
        <div className="w-160 pt-6 pb-6">{children}</div>
      </main>
    </div>
  );
}
