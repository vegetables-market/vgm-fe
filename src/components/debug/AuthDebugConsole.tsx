"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthDebugConsole() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const addLog = useCallback((msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${msg}`, ...prev.slice(0, 99)]);
  }, []);

  useEffect(() => {
    addLog(`Navigated to: ${pathname}`);

    (window as any).addAuthLog = addLog;

    return () => {
      delete (window as any).addAuthLog;
    };
  }, [pathname, addLog]);

  const handleLogout = async () => {
    try {
      addLog("Attempting logout...");
      await logout();
      addLog("Logged out successfully (Cookie cleared)");
      router.push("/login");
    } catch (err: any) {
      addLog(`Logout error: ${err.message}`);
      router.push("/login");
    }
  };

  return (
    <div className="fixed right-0 bottom-50 z-[9999] m-4 flex flex-col items-end gap-2">
      {/* ログパネル */}
      {isOpen && (
        <div className="flex h-64 w-80 flex-col overflow-hidden rounded-lg border border-zinc-700 bg-black/90 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-3 py-2">
            <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
              Auth Debug Logs
            </span>
            <button
              onClick={() => setLogs([])}
              className="text-[10px] text-zinc-500 transition-colors hover:text-white"
            >
              CLEAR
            </button>
          </div>
          <div className="flex-1 space-y-1 overflow-y-auto p-2 font-mono text-[10px] text-zinc-300">
            {logs.length === 0 ? (
              <div className="text-zinc-600 italic">No logs yet...</div>
            ) : (
              logs.map((log, i) => (
                <div
                  key={i}
                  className="border-b border-zinc-900 pb-1 break-all last:border-0"
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ステータスバー */}
      <div className="min-w-[200px] rounded-lg border border-white/10 bg-black/80 p-3 text-xs text-white shadow-lg backdrop-blur-sm">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-4">
            <span className="font-bold text-gray-400">Auth Status:</span>
            <span
              className={
                user ? "font-bold text-green-400" : "font-bold text-red-400"
              }
            >
              {user ? "Logged In" : "Guest"}
            </span>
          </div>

          {user && (
            <div className="flex items-center justify-between gap-4">
              <span className="font-bold text-gray-400">User:</span>
              <span className="max-w-[100px] truncate text-blue-300">
                {user.displayName}
              </span>
            </div>
          )}

          <div className="mt-2 flex items-center gap-2 border-t border-gray-700 pt-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex-1 rounded bg-zinc-800 py-1 text-[10px] font-bold text-white transition-colors hover:bg-zinc-700"
            >
              {isOpen ? "HIDE LOGS" : "SHOW LOGS"}
            </button>
            {user && (
              <button
                onClick={handleLogout}
                className="rounded border border-red-700/50 bg-red-900/50 px-2 py-1 text-[10px] font-bold text-red-200 transition-colors hover:bg-red-800"
              >
                LOGOUT
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
