export default function SettingsTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="mb-6 w-fit cursor-default text-center text-3xl">{children}</p>
  );
}
