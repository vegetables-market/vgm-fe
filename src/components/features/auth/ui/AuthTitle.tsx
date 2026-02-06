export default function AuthTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 w-fit cursor-default text-center text-3xl font-bold">
      {children}
    </h2>
  );
}
