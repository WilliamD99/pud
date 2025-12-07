import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack is the default bundler in Next.js 16
  // It handles TypeScript extension resolution natively
  turbopack: {
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.cjs'],
  },
  images: {
    remotePatterns: [new URL('https://picsum.photos/id/**')],
  },
  cacheComponents: true,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
