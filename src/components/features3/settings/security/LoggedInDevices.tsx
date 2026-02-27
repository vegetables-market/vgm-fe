"use client";

import { useEffect, useState } from "react";
import Btn from "@/components/ui/settings/Btn";
import BtnWrappers from "@/components/features3/settings/ui/BtnWrappers";
import { getSessions } from "@/service/user/sessions/get-sessions";
import { SessionResponse } from "@/types/session";
import { parseUserAgent } from "@/lib/utils/user-agent";
import {
  FaWindows,
  FaApple,
  FaAndroid,
  FaLinux,
  FaDesktop,
} from "react-icons/fa6";

export default function LoggedInDevices() {
  const [sessions, setSessions] = useState<SessionResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // OSごとのセッション数を集計
  const sessionGroups = sessions.reduce(
    (acc, session) => {
      const { os } = parseUserAgent(session.deviceInfo);
      acc[os] = (acc[os] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const osList = Object.entries(sessionGroups);
  const totalSessions = sessions.length;

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

  const getOsIcon = (os: string) => {
    switch (os) {
      case "Windows":
        return <FaWindows className="text-xl" />;
      case "macOS":
        return <FaApple className="text-xl" />;
      case "iOS":
        return <FaApple className="text-xl" />; // iOSはAppleアイコン
      case "Android":
        return <FaAndroid className="text-xl" />;
      case "Linux":
        return <FaLinux className="text-xl" />;
      default:
        return <FaDesktop className="text-xl" />;
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">ロード中...</div>
    );
  }

  if (totalSessions === 0) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        デバイス情報はありません
      </div>
    );
  }

  return (
    <BtnWrappers>
      {/* OSごとのグループリンク */}
      {osList.map(([os, count]) => (
        <Btn key={os} href={`/settings/security/devices#os-${os}`}>
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-gray-500">{getOsIcon(os)}</span>
              <span className="font-medium">
                {count} セッション - {os}
              </span>
            </div>
          </div>
        </Btn>
      ))}

      {/* すべてのデバイスを表示 */}
      <Btn href="/settings/security/devices">
        <span className="font-medium text-blue-600">
          すべてのデバイスを表示
        </span>
      </Btn>
    </BtnWrappers>
  );
}
