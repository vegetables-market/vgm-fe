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
  id: string; // ローカル識別用 ID
  file: File | null; // 圧縮後ファイル
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

  // itemId を Ref で追跡
  useEffect(() => {
    itemIdRef.current = itemId;
  }, [itemId]);

  /**
   * 処理キューを回す
   */
  const processQueue = useCallback(async () => {
    const currentItemId = itemIdRef.current;
    if (!currentItemId) return;
    if (activeUploadsRef.current >= MAX_CONCURRENCY) return;
    if (uploadQueueRef.current.size === 0) return;

    // 次のタスクを取り出す
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

    // ステータスを Uploading に変更
    setFiles((prev) =>
      prev.map((f) =>
        f.id === nextId ? { ...f, status: "uploading", progress: 0 } : f,
      ),
    );

    try {
      // 1. Token取得
      console.log("[DEBUG] Step 1: getUploadToken...");
      const { token, filename } = await withTimeout(
        getUploadToken(),
        TOKEN_TIMEOUT_MS,
        "getUploadToken",
      );
      console.log("[DEBUG] Step 1 OK: token取得成功, filename =", filename);

      // メディアサーバーはファイルを uuid.jpg のように拡張子付きで保存する
      const filenameWithExt = `${filename}.jpg`;

      // 2. Direct Upload (Workers)
      console.log("[DEBUG] Step 2: uploadImage...");
      await withTimeout(
        uploadImage(targetFile.file, "jpg", token, filename),
        UPLOAD_TIMEOUT_MS,
        "uploadImage",
      );
      console.log("[DEBUG] Step 2 OK: R2アップロード成功");

      // 3. Link (Backend) - 拡張子付きファイル名を使用
      console.log("[DEBUG] Step 3: linkImages, itemId =", currentItemId, ", filename =", filenameWithExt);
      await withTimeout(
        linkImages(currentItemId, [filenameWithExt]),
        LINK_TIMEOUT_MS,
        "linkImages",
      );
      console.log("[DEBUG] Step 3 OK: linkImages成功");

      // 完了
      setFiles((prev) =>
        prev.map((f) =>
          f.id === nextId
            ? {
                ...f,
                status: "completed",
                serverFilename: filenameWithExt,
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
   * itemId が設定されたらキュー処理を開始
   */
  useEffect(() => {
    if (itemId && uploadQueueRef.current.size > 0) {
      processQueue();
    }
  }, [itemId, processQueue]);

  // キュー取りこぼし対策: 定期的に処理開始を再試行
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
   * ファイル追加。ドラフトがなければ作成。
   */
  const addFiles = useCallback(
    async (newFiles: File[]) => {
      // ドラフトがなければ先に作成（initDraft が提供されている場合のみ）
      if (!itemIdRef.current) {
        if (initDraft) {
          try {
            const newItemId = await initDraft();
            itemIdRef.current = newItemId;
          } catch (err) {
            console.error("Failed to create draft:", err);
            return; // ドラフト作成失敗時は画像追加を中止
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

      // State 更新
      setFiles((prev) => [...prev, ...newEntries]);

      // キューに追加（ファイル情報も一緒に保存）
      newEntries.forEach((entry) => {
        uploadQueueRef.current.set(entry.id, entry);
      });

      // 即座に処理開始を試みる
      processQueue();
    },
    [processQueue, initDraft],
  );

  /**
   * ファイル削除
   */
  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
    // キューからも削除
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
