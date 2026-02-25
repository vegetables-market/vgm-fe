import { useState, useCallback, useRef } from "react";
import { createDraft } from "@/service/market/stocks/create-draft";

export function useItemDraft() {
  const [itemId, setItemId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 驥崎､・他縺ｳ蜃ｺ縺鈴亟豁｢逕ｨ縺ｮRef
  const isCreatingRef = useRef(false);
  const createdIdRef = useRef<string | null>(null);
  // 蠕・ｩ滉ｸｭ縺ｮPromise resolver 繧剃ｿ晄戟
  const waitingResolversRef = useRef<Array<(id: string) => void>>([]);

  /**
   * Draft Item繧剃ｽ懈・縺ｾ縺溘・譌｢蟄倥・ID繧定ｿ泌唆
   * 譌｢縺ｫitemId縺後≠繧句ｴ蜷医・API繧ｳ繝ｼ繝ｫ縺帙★縺昴・ID繧定ｿ斐☆
   */
  const initDraft = useCallback(async (): Promise<string> => {
    // 譌｢縺ｫ菴懈・貂医∩縺ｮ蝣ｴ蜷医・蜊ｳ蠎ｧ縺ｫ霑斐☆
    if (createdIdRef.current) return createdIdRef.current;

    // 菴懈・荳ｭ縺ｮ蝣ｴ蜷医・螳御ｺ・ｒ蠕・ｩ滂ｼ磯㍾隍・亟豁｢・・
    if (isCreatingRef.current) {
      return new Promise<string>((resolve) => {
        waitingResolversRef.current.push(resolve);
      });
    }

    isCreatingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const response = await createDraft();
      console.log("Draft created:", response.itemId);
      createdIdRef.current = response.itemId;
      setItemId(response.itemId);

      // 蠕・ｩ滉ｸｭ縺ｮ蜻ｼ縺ｳ蜃ｺ縺励↓邨先棡繧帝夂衍
      waitingResolversRef.current.forEach((resolve) =>
        resolve(response.itemId),
      );
      waitingResolversRef.current = [];

      return response.itemId;
    } catch (err) {
      console.error("Failed to create draft:", err);
      const errorObj =
        err instanceof Error ? err : new Error("Failed to create draft");
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
      // 繧ｨ繝ｩ繝ｼ譎ゅ・縺ｿ繝ｪ繧ｻ繝・ヨ・域・蜉滓凾縺ｯ createdIdRef 縺瑚ｨｭ螳壹＆繧後※縺・ｋ縺ｮ縺ｧ蜀崎ｩｦ陦後＆繧後↑縺・ｼ・
      if (!createdIdRef.current) {
        isCreatingRef.current = false;
      }
    }
  }, []); // 萓晏ｭ倬・蛻励ｒ遨ｺ縺ｫ - Ref縺ｧ迥ｶ諷狗ｮ｡逅・＠縺ｦ縺・ｋ縺ｮ縺ｧ荳崎ｦ・

  return {
    itemId,
    initDraft,
    loading,
    error,
  };
}
