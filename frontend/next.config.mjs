/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: process.env.NODE_ENV === 'production' ? '/frontend' : '',
    assetPrefix: process.env.NODE_ENV === 'production' ? '/frontend/' : '',
};
  
export default nextConfig;