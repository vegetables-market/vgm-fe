type AuthLogWindow = Window & {
  addAuthLog?: (message: string) => void;
};

export function addAuthLog(message: string): void {
  if (typeof window === "undefined") return;
  (window as AuthLogWindow).addAuthLog?.(message);
}
