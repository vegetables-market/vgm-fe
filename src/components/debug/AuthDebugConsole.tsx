"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/services/authService";

export default function AuthDebugConsole() {
  const [logs, setLogs] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const addLog = useCallback((msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${msg}`, ...prev.slice(0, 99)]);
  }, []);

  const checkAuth = useCallback(() => {
    const storedUser = localStorage.getItem("vgm_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    addLog(`Navigated to: ${pathname}`);

    (window as any).addAuthLog = addLog;
    (window as any).refreshAuth = checkAuth;

    return () => {
      delete (window as any).addAuthLog;
      delete (window as any).refreshAuth;
    };
  }, [pathname, addLog, checkAuth]);

  const handleLogout = async () => {
    try {
      addLog("Attempting logout...");
      await logout();
      localStorage.removeItem("vgm_user");
      addLog("Logged out successfully (Cookie cleared)");
      checkAuth();
      router.push("/login");
    } catch (err: any) {
      addLog(`Logout error: ${err.message}`);
      // エラーでもローカルの状態はクリアする
      localStorage.removeItem("vgm_user");
      checkAuth();
      router.push("/login");
    }
  };

  return (
    <div className="fixed bottom-50 right-0 m-4 z-[9999] flex flex-col items-end gap-2">
      {/* ログパネル */}
      {isOpen && (
        <div className="w-80 h-64 bg-black/90 border border-zinc-700 rounded-lg shadow-2xl flex flex-col overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 bg-zinc-900/50">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Auth Debug Logs
            </span>
            <button
              onClick={() => setLogs([])}
              className="text-[10px] text-zinc-500 hover:text-white transition-colors"
            >
              CLEAR
            </button>
          </div>
          <div className="flex-1 p-2 overflow-y-auto font-mono text-[10px] text-zinc-300 space-y-1">
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
      <div className="p-3 bg-black/80 text-white text-xs rounded-lg shadow-lg backdrop-blur-sm border border-white/10 min-w-[200px]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-4">
            <span className="font-bold text-gray-400">Auth Status:</span>
            <span
              className={
                user ? "text-green-400 font-bold" : "text-red-400 font-bold"
              }
            >
              {user ? "Logged In" : "Guest"}
            </span>
          </div>

          {user && (
            <div className="flex items-center justify-between gap-4">
              <span className="font-bold text-gray-400">User:</span>
              <span className="text-blue-300 truncate max-w-[100px]">
                {user.display_name}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-700">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] py-1 rounded transition-colors font-bold"
            >
              {isOpen ? "HIDE LOGS" : "SHOW LOGS"}
            </button>
            {user && (
              <button
                onClick={handleLogout}
                className="bg-red-900/50 hover:bg-red-800 text-red-200 text-[10px] px-2 py-1 rounded transition-colors font-bold border border-red-700/50"
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
