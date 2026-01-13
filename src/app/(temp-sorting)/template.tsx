"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // トップページは page.tsx 側で個別に制御するので除外
  if (pathname === "/") {
    return <>{children}</>;
  }

  // その他のページ用のアニメーション
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(5px)", scale: 0.99 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      transition={{ duration: 0.4, ease: "circOut" }}
    >
      {children}
    </motion.div>
  );
}