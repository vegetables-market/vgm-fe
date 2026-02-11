export default function BtnWrappers({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col gap-1 rounded-2xl">{children}</div>;
}
