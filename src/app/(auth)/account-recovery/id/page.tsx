import AuthTitle from "@/components/ui/auth/AuthTitle";
import AuthSubTitle from "@/components/ui/auth/AuthSubTitle";
import { FaCircleChevronLeft } from "react-icons/fa6";

export default function ForgotIdPage() {
  return (
       <div className="relative flex w-full flex-col items-center">
            {/* Back Button */}
            <a href="/login" className="absolute top-0 left-0 p-4">
                 <FaCircleChevronLeft className="text-3xl text-gray-400 hover:text-gray-200 transition-colors" />
            </a>

            <div className="flex w-75 flex-col items-center mt-12">
                <AuthTitle>IDを忘れた場合</AuthTitle>
                <div className="w-full bg-white/5 p-6 rounded-lg border border-white/10 mt-6">
                    <div className="text-center mb-4">
                        <AuthSubTitle>
                            サポートにお問い合わせください
                        </AuthSubTitle>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                        セキュリティ上の理由により、ユーザーIDの直接の確認機能は提供しておりません。
                        もし登録済みのメールアドレスを覚えている場合は、パスワード再設定を試みることで、
                        受信したメールにユーザーIDが記載されている場合があります。
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        それでも解決しない場合は、以下のリンクからサポートにお問い合わせください。
                    </p>
                    
                    <div className="mt-6 text-center">
                        <a 
                            href="mailto:support@example.com" 
                            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-hover transition-colors inline-block"
                        >
                            サポートへ問い合わせる
                        </a>
                    </div>
                </div>
            </div>
       </div>
  );
}
