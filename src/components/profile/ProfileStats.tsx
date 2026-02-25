interface ProfileStatsProps {
  stats: {
    itemsCount: number;
    salesCount: number;
    reviewsCount: number;
  };
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const statList = [
    { label: "出品数", value: stats.itemsCount },
    { label: "販売数", value: stats.salesCount },
    { label: "レビュー", value: stats.reviewsCount },
  ];

  return (
    <ul className="flex justify-around border-t border-b border-gray-100 py-6 dark:border-gray-700">
      {statList.map((stat) => (
        <li key={stat.label} className="text-center">
          <span className="block text-xl font-bold text-gray-900 dark:text-white">
            {stat.value}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {stat.label}
          </span>
        </li>
      ))}
    </ul>
  );
}