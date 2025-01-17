import {
  Fragment,
  JSXElementConstructor,
  memo,
  ReactElement,
  useMemo,
  useRef,
} from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { navItems } from './helpers/navigation'
import { Hero } from './Hero'
import { Navbar } from './Navbar'
import { Prose } from './Prose'
import { Header } from '../common/Header'
import cn from 'classnames'
import { TableOfContent } from './TableOfContent'
import { styles } from 'common/helpers/styles'
import Head from 'next/head'
import { TOC } from 'common/types'

export const Layout = memo(function Layout(props: {
  children: ReactElement<any, string | JSXElementConstructor<any>>
  title?: string
  description?: string
  tableOfContents: TOC
}) {
  const router = useRouter()

  const allLinks = navItems.flatMap((section) =>
    section.items ? section.items : section
  )

  const linkIndex = allLinks.findIndex((link) => link?.href === router.pathname)
  const previousPage = allLinks[linkIndex - 1]
  const nextPage = allLinks[linkIndex + 1]

  const section = navItems.find((section) =>
    section.items?.find((article) => article.href === router.pathname)
  )
  const mainRef = useRef<HTMLElement | null>(null)
  const isHomePage = useMemo(() => router.pathname === '/', [router.pathname])

  return (
    <Fragment>
      <Head>
        <title>{`${props.title || 'Documentation'} | World ID`}</title>
        {props.description && (
          <meta name="description" content={props.description} />
        )}
      </Head>

      <div className="relative z-10">
        <Header navItems={navItems} />

        <div
          className={cn(
            styles.screenPadding,
            'grid items-start py-11 lg:grid-cols-auto/fr/auto'
          )}
        >
          <aside className="sticky top-20 hidden lg:block lg:pr-4 2xl:pr-16">
            <Navbar items={navItems} />
          </aside>

          <main
            ref={mainRef}
            className="max-w-full overflow-hidden lg:min-w-[650px] lg:px-8 2xl:px-16"
          >
            <article>
              {isHomePage && <Hero />}

              {(props.title || section) && (
                <header className="mb-3">
                  {section && (
                    <p className="text-14 uppercase tracking-wide text-neutral-400">
                      {section.title}
                    </p>
                  )}
                </header>
              )}

              <Prose>{props.children}</Prose>
            </article>

            <dl className="mt-8 grid gap-y-8 border-t border-slate-200 pt-8 lg:mt-16 lg:grid-cols-2 lg:pt-16">
              {previousPage?.href && (
                <div className="text-center lg:text-left">
                  <dt
                    className={cn(
                      'text-left text-14 font-medium text-neutral-500'
                    )}
                  >
                    Previous
                  </dt>

                  <dd className="mt-1 text-left">
                    <Link
                      href={previousPage.href}
                      className={cn(
                        'bg-211c29 text-20 font-semibold',
                        styles.darkTextGradient
                      )}
                    >
                      <span aria-hidden="true">&larr;</span>{' '}
                      {previousPage.title}
                    </Link>
                  </dd>
                </div>
              )}

              {nextPage?.href && (
                <div className="col-start-2 text-center lg:ml-auto lg:text-right">
                  <dt className="text-right text-14 font-medium text-neutral-500">
                    Next
                  </dt>

                  <dd className="mt-1 text-right">
                    <Link
                      href={nextPage.href}
                      className={cn(
                        'bg-211c29 text-right text-20 font-semibold',
                        styles.darkTextGradient
                      )}
                    >
                      {nextPage.title} <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </dd>
                </div>
              )}
            </dl>
          </main>

          <aside className="sticky top-20 hidden gap-y-6 lg:grid lg:pl-8 2xl:pl-16">
            <TableOfContent items={props.tableOfContents} />
          </aside>
        </div>
      </div>
    </Fragment>
  )
})
