"use client";

import React, { useState } from "react";
import { FaCircleExclamation } from "react-icons/fa6";
import AuthButton from "@/components/features/auth/ui/AuthButton";
import { verifyAuthCode } from "@/lib/api/api-client";
import OtpInput from 'react-otp-input';

interface StepNoticeProps {
  formData: any;
  setFormData: any;
  onNext: () => void;
  flowId: string | null;
  expiresAt?: string;
}

export default function StepVerifyCode({
  formData,
  setFormData: _,
  onNext,
  flowId,
  expiresAt
}: StepNoticeProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  React.useEffect(() => {
    if (!expiresAt) return;
    
    const calculateTimeLeft = () => {
        const end = new Date(expiresAt).getTime();
        const now = new Date().getTime();
        const diff = Math.max(0, Math.floor((end - now) / 1000));
        return diff;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
        const remaining = calculateTimeLeft();
        setTimeLeft(remaining);
        if (remaining <= 0) {
            clearInterval(timer);
        }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flowId) {
        setError("システムエラー: 認証IDが見つかりません。最初からやり直してください。");
        return;
    }
    setLoading(true);
    setError("");

    try {
      const result = await verifyAuthCode(flowId, code);
      if (result.verified) {
         onNext();
      } else {
         setError("認証コードが正しくありません。");
      }
    } catch (err) {
      setError("認証に失敗しました。");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
       <div className="mb-4 text-center">
         <h2 className="text-xl font-bold mb-2">メールアドレスの確認</h2>
         <p className="text-xs text-gray-400 mb-2">
           {formData.email} 宛に認証コードを送信しました。<br/>
           コードを入力して次へ進んでください。
         </p>
         {timeLeft !== null && (
             <p className={`text-sm font-mono ${timeLeft < 60 ? 'text-red-500' : 'text-gray-300'}`}>
                 有効期限: {formatTime(timeLeft)}
             </p>
         )}
       </div>

       <form onSubmit={handleVerify}>
         <div className="mb-6 flex justify-center">
             <OtpInput
                value={code}
                onChange={setCode}
                numInputs={6}
                renderInput={(props: any) => <input {...props} className="!w-10 !h-12 mx-1 text-center bg-zinc-900 border border-zinc-700 rounded text-xl focus:border-white focus:outline-none" />}
                containerStyle={{ display: 'flex', justifyContent: 'center' }}
             />
         </div>

         {error && (
            <div className="mb-4 flex items-center justify-center text-xs text-red-500">
               <FaCircleExclamation className="mr-1" />
               {error}
            </div>
         )}
         
         <AuthButton type="submit" isLoading={loading} disabled={code.length !== 6}>
           認証して次へ
         </AuthButton>
       </form>
    </div>
  );
}
