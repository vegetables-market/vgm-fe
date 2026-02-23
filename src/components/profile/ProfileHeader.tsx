import Image from "next/image";

interface ProfileHeaderProps {
  user: {
    displayName: string;
    avatarUrl: string | null;
    ratingAverage: number | null;
    location?: string;
    bio?: string;
  };
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <>
      <div className="flex flex-col items-center p-6 text-center">
        {/* アバター部分 */}
        <div className="relative h-24 w-24 mb-4">
          <Image
            src={user.avatarUrl || "/images/default-avatar.png"}
            alt={user.displayName}
            fill
            className="rounded-full border-2 border-white object-cover shadow-md"
            unoptimized
          />
        </div>

        {/* ユーザー名と評価 */}
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {user.displayName}
        </h1>
        <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
          <span className="text-orange-400">★</span>
          <span>{user.ratingAverage?.toFixed(1) || "0.0"}</span>
          <span className="mx-1">・</span>
          <span>{user.location || "未設定"}</span>
        </div>

        {/* 自己紹介文 */}
        {user.bio && (
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 max-w-md">
            {user.bio}
          </p>
        )}
      </div>
    </>
  );
}