import 'styles/global.css'
import { MDXProvider } from '@mdx-js/react'
import slugify from '@sindresorhus/slugify'
import { ReactNode, useMemo } from 'react'
import { AppProps } from 'next/app'
import { Layout } from 'Layout'
import { collectHeadings } from 'common/helpers/collecting-headings'
import { renderToString } from 'react-dom/server'
import parse from 'node-html-parser'
import { findPageTitle } from 'common/helpers/find-page-title'
import { findPageDescription } from 'common/helpers/find-page-description'
import { Fence } from 'common/Fence'
import { CodeBlock } from 'common/CodeBlock'
import { Link } from 'common/Link'
import { ThemeProvider } from 'common/contexts/ThemeContext'
import { useRouter } from 'next/router'
import { MDXComponents } from 'mdx/types'
import Script from 'next/script'

const components: MDXComponents = {
  h2: (props: { children?: ReactNode }) => (
    <h2 className="" id={slugify(props.children as string)}>
      {props.children}
    </h2>
  ),

  h3: (props: { children?: ReactNode }) => (
    <h3 id={slugify(props.children as string)}>{props.children}</h3>
  ),
  pre: (props) => {
    return (
      <Fence>
        {/* @ts-ignore */}
        <CodeBlock {...props.children.props} />
      </Fence>
    )
  },
  code: (props) => (
    <span className="rounded-md border border-black/10 bg-ebedef p-0.5 px-1 dark:border-ffffff/10 dark:bg-161b22">
      <CodeBlock {...props} />
    </span>
  ),
  a: Link,
}

export default function MyApp(pageProps: AppProps) {
  const router = useRouter()

  const pageContent = useMemo(
    () => <pageProps.Component {...pageProps} />,
    [pageProps]
  )

  const pageHtml = parse(renderToString(pageContent))
  const tableOfContents = collectHeadings(pageHtml)
  const pageTitle = findPageTitle(pageHtml)
  const pageDescription = findPageDescription(pageHtml)

  const isDefaultLayoutPage = useMemo(
    () => !['/use', '/404'].includes(router.pathname),
    [router.pathname]
  )

  return (
    <ThemeProvider>
      <Script src="https://unpkg.com/clippy-widget" strategy="lazyOnload" />
      <MDXProvider components={components}>
        {isDefaultLayoutPage && (
          <Layout
            title={pageTitle}
            description={pageDescription}
            tableOfContents={tableOfContents}
          >
            {pageContent}
          </Layout>
        )}

        {!isDefaultLayoutPage && pageContent}
      </MDXProvider>
    </ThemeProvider>
  )
}
