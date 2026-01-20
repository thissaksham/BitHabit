/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: false,
    },
    eslint: {
        ignoreDuringBuilds: false,
    },
    output: "export",
    basePath: "/BitHabit",
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
