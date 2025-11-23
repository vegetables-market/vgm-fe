import type {NextConfig} from "next";

const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
};

const nextConfig: NextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return {
            beforeFiles: [
                {
                    source: '/api/:path*',
                    destination: `${getBackendUrl()}/api/:path*`,
                },
            ],
        };
    },
};

export default nextConfig;