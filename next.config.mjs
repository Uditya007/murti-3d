/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Local images in /public serve fine; add external domains if needed later
    remotePatterns: [],
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
