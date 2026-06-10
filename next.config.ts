import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

    // 開発環境で許可するオリジンを設定
  allowedDevOrigins: [
    '3.113.247.203',  // 現在(6/10)のEC2インスタンスIP
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
  ]
};

export default nextConfig;
