import { useState, useCallback, useEffect, useRef } from "react";

import { compressImage } from "@/lib/utils/imageCompression";
import { getUploadToken } from "@/service/market/stocks/get-upload-token";
import { uploadImage } from "@/lib/api/media";
import { linkImages } from "@/service/market/stocks/link-images";

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export type UploadFileStatus =
  | "pending"
  | "compressing"
  | "uploading"
  | "completed"
  | "error";

export interface UploadFile {
  id: string; // 繝ｭ繝ｼ繧ｫ繝ｫ隴伜挨逕ｨID
  file: File | null; // 蝨ｧ邵ｮ蠕後・繝輔ぃ繧､繝ｫ
  originalFile: File;
  previewUrl: string;
  status: UploadFileStatus;
  progress: number;
  serverFilename?: string;
  error?: string;
}

const MAX_CONCURRENCY = 3;
const TOKEN_TIMEOUT_MS = 15_000;
const UPLOAD_TIMEOUT_MS = 45_000;
const LINK_TIMEOUT_MS = 15_000;

function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label: string,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms}ms`));
    }, ms);

    promise
      .then((value) => {
        clearTimeout(timeoutId);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        reject(err);
      });
  });
}

interface UseMultiImageUploadOptions {
  initDraft?: () => Promise<string>;
}

export function useMultiImageUpload(
  itemId: string | null,
  options?: UseMultiImageUploadOptions,
) {
  const initDraft = options?.initDraft;
  const [files, setFiles] = useState<UploadFile[]>([]);
  const filesRef = useRef<UploadFile[]>([]);
  const uploadQueueRef = useRef<Map<string, UploadFile>>(new Map());
  const activeUploadsRef = useRef<number>(0);
  const itemIdRef = useRef<string | null>(null);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    return () => {
      filesRef.current.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    };
  }, []);

  // itemId繧坦ef縺ｧ霑ｽ霍｡
  useEffect(() => {
    itemIdRef.current = itemId;
  }, [itemId]);

  /**
   * 蜃ｦ逅・く繝･繝ｼ繧貞屓縺・
   */
  const processQueue = useCallback(async () => {
    const currentItemId = itemIdRef.current;
    if (!currentItemId) return;
    if (activeUploadsRef.current >= MAX_CONCURRENCY) return;
    if (uploadQueueRef.current.size === 0) return;

    // 谺｡縺ｮ繧ｿ繧ｹ繧ｯ繧貞叙繧雁・縺・
    const iterator = uploadQueueRef.current.entries().next();
    if (iterator.done) return;

    const [nextId, targetFile] = iterator.value;
    uploadQueueRef.current.delete(nextId);

    if (!targetFile || !targetFile.file) {
      console.error("File not found in queue:", nextId);
      processQueue();
      return;
    }

    activeUploadsRef.current++;

    // 繧ｹ繝・・繧ｿ繧ｹ繧旦ploading縺ｫ螟画峩
    setFiles((prev) =>
      prev.map((f) =>
        f.id === nextId ? { ...f, status: "uploading", progress: 0 } : f,
      ),
    );

    try {
      // 1. Token蜿門ｾ・
      const { token, filename } = await withTimeout(
        getUploadToken(),
        TOKEN_TIMEOUT_MS,
        "getUploadToken",
      );

      // 2. Direct Upload (Workers)
      await withTimeout(
        uploadImage(targetFile.file, "jpg", token, filename),
        UPLOAD_TIMEOUT_MS,
        "uploadImage",
      );

      // 3. Link (Backend)
      await withTimeout(
        linkImages(currentItemId, [filename]),
        LINK_TIMEOUT_MS,
        "linkImages",
      );

      // 螳御ｺ・
      setFiles((prev) =>
        prev.map((f) =>
          f.id === nextId
            ? {
                ...f,
                status: "completed",
                serverFilename: filename,
                progress: 100,
              }
            : f,
        ),
      );
    } catch (err) {
      console.error(`Upload failed for ${nextId}:`, err);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === nextId
            ? {
                ...f,
                status: "error",
                error: err instanceof Error ? err.message : "Upload failed",
              }
            : f,
        ),
      );
    } finally {
      activeUploadsRef.current--;
      processQueue();
    }
  }, []);

  /**
   * itemId縺瑚ｨｭ螳壹＆繧後◆繧峨く繝･繝ｼ蜃ｦ逅・ｒ髢句ｧ・
   */
  useEffect(() => {
    if (itemId && uploadQueueRef.current.size > 0) {
      processQueue();
    }
  }, [itemId, processQueue]);

  // 繧ｭ繝･繝ｼ蜿悶ｊ縺薙⊂縺怜ｯｾ遲・ 螳壽悄逧・↓蜃ｦ逅・ｒ蜀埼ｧ・虚
  useEffect(() => {
    const timer = setInterval(() => {
      if (!itemIdRef.current) return;
      if (uploadQueueRef.current.size === 0) return;
      if (activeUploadsRef.current >= MAX_CONCURRENCY) return;
      processQueue();
    }, 500);

    return () => clearInterval(timer);
  }, [processQueue]);

  /**
   * 繝輔ぃ繧､繝ｫ霑ｽ蜉・医ラ繝ｩ繝輔ヨ縺後↑縺代ｌ縺ｰ菴懈・・・
   */
  const addFiles = useCallback(
    async (newFiles: File[]) => {
      // 繝峨Λ繝輔ヨ縺後↑縺代ｌ縺ｰ蜈医↓菴懈・・・nitDraft縺梧署萓帙＆繧後※縺・ｋ蝣ｴ蜷医・縺ｿ・・
      if (!itemIdRef.current) {
        if (initDraft) {
          try {
            const newItemId = await initDraft();
            itemIdRef.current = newItemId;
          } catch (err) {
            console.error("Failed to create draft:", err);
            return; // 繝峨Λ繝輔ヨ菴懈・螟ｱ謨玲凾縺ｯ逕ｻ蜒剰ｿｽ蜉繧剃ｸｭ豁｢
          }
        } else {
          console.error("No itemId and no initDraft provided");
          return;
        }
      }

      const newEntries: UploadFile[] = await Promise.all(
        newFiles.map(async (f) => {
          const id = generateId();

          let compressed = f;
          const previewUrl = URL.createObjectURL(f);

          try {
            const result = await compressImage(f, "jpeg");
            compressed = result.compressedFile;
          } catch (e) {
            console.warn("Compression failed, using original", e);
          }

          return {
            id,
            originalFile: f,
            file: compressed,
            previewUrl,
            status: "pending" as const,
            progress: 0,
          };
        }),
      );

      // State譖ｴ譁ｰ
      setFiles((prev) => [...prev, ...newEntries]);

      // 繧ｭ繝･繝ｼ縺ｫ霑ｽ蜉・医ヵ繧｡繧､繝ｫ諠・ｱ繧ゆｸ邱偵↓菫晏ｭ假ｼ・
      newEntries.forEach((entry) => {
        uploadQueueRef.current.set(entry.id, entry);
      });

      // 蜊ｳ蠎ｧ縺ｫ蜃ｦ逅・幕蟋九ｒ隧ｦ縺ｿ繧・
      processQueue();
    },
    [processQueue, initDraft],
  );

  /**
   * 繝輔ぃ繧､繝ｫ蜑企勁
   */
  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
    // 繧ｭ繝･繝ｼ縺九ｉ繧ょ炎髯､
    uploadQueueRef.current.delete(id);
  }, []);

  return {
    files,
    addFiles,
    removeFile,
    isAllCompleted:
      files.length > 0 && files.every((f) => f.status === "completed"),
    hasError: files.some((f) => f.status === "error"),
    pendingCount: files.filter(
      (f) => f.status !== "completed" && f.status !== "error",
    ).length,
  };
}
