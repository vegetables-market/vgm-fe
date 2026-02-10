"use client";

import { useEffect, useState } from "react";
import Btn from "@/components/features/settings/ui/Btn";
import BtnWrappers from "@/components/features/settings/ui/BtnWrappers";
import { getSessions } from "@/lib/api/client";
import { SessionResponse } from "@/types/session";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

export default function LoggedInDevices() {
  const [sessions, setSessions] = useState<SessionResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await getSessions();
        setSessions(data.sessions);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) {
    return <div className="p-4 text-center text-sm text-gray-500">ロード中...</div>;
  }

  if (sessions.length === 0) {
    return <div className="p-4 text-center text-sm text-gray-500">デバイス情報はありません</div>;
  }

  return (
    <BtnWrappers>
      {sessions.map((session) => (
        <Btn key={session.sessionId} href="/settings/security/devices">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col items-start">
              <span className="font-medium">
                {session.deviceInfo || "不明なデバイス"}
              </span>
              <span className={`text-sm ${session.isCurrent ? "text-green-600" : "text-gray-500"}`}>
                {session.isCurrent ? (
                  "現在使用中"
                ) : (
                    <>
                    最終アクセス: {session.lastActiveAt ? formatDistanceToNow(new Date(session.lastActiveAt), { addSuffix: true, locale: ja }) : '不明'}
                    </>
                )}
              </span>
            </div>
            <span className="text-xs text-gray-400">詳細</span>
          </div>
        </Btn>
      ))}
    </BtnWrappers>
  );
}
