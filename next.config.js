const { remarkCodeHike } = require('@code-hike/mdx')
const theme = require('shiki/themes/min-light.json')

/** @type {import('@next/mdx')} */
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [[remarkCodeHike, { theme }]],
    // cspell:disable-next-line
    rehypePlugins: [],
    providerImportSource: '@mdx-js/react',
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  experimental: {
    newNextLinkBehavior: true,
  },
  async redirects() {
    return [
      {
        source: '/js',
        destination: '/idkit',
        permanent: true,
      },
      {
        source: '/js/:slug',
        destination: '/idkit/:slug',
        permanent: true,
      },
      {
        source: '/protocol',
        destination: '/id/protocol',
        permanent: false,
      },
      {
        source: '/test',
        destination: '/id/testing',
        permanent: false,
      },
      {
        source: '/simulator',
        destination: '/id/testing',
        permanent: false,
      },
      {
        source: '/privacy',
        destination: '/advanced/privacy',
        permanent: false,
      },
      {
        source: '/zkp',
        destination: '/advanced/zero-knowledge-proofs',
        permanent: false,
      },
      {
        source: '/waitlist',
        destination: 'https://toolsforhumanity.typeform.com/sdk-waitlist',
        permanent: true,
      },
      {
        source: '/use-cases',
        destination:
          'https://worldcoin.notion.site/World-ID-df11c0d2a42b4890a1e9e8d15b9f550f',
        permanent: false,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/:slug*',
        destination: '/api-docs/:slug*',
      },
    ]
  },
}

module.exports = withMDX(nextConfig)
