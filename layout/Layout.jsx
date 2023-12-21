import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { useSelector } from 'react-redux'

const Header = dynamic(() => import('./Header'), { ssr: false })
const Footer = dynamic(() => import('./Footer'), { ssr: false })
const Search = dynamic(() => import('./components/Search'), { ssr: false })

const WithoutSSRFeedbackModal = dynamic(() => import('@/components/Modals/FeedbackModal'), { ssr: false })
const ApplicationModal = dynamic(() => import('@/components/Modals/ApplicationModal'), { ssr: false })

const Layout = ({ children }) => {
  const pathname = usePathname()
  const [scrollDirection, setScrollDirection] = useState(0)
  const { homeSearchVisible } = useSelector(state => state.system)

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setScrollDirection(window.pageYOffset)
    })
  }, [])

  return (
    <div className='home_layout'>
      <WithoutSSRFeedbackModal />
      <ApplicationModal />
      <Header extraClass={pathname !== '/' ? '' : 'header-fixed'} />
      <div className='home_layout_content'>{children}</div>
      <Footer scrollDirection={scrollDirection} />
    </div>
  )
}

export const withLayout = Component => {
  return function withLayoutComponent(props) {
    return (
      <Layout>
        <Component {...props} />
      </Layout>
    )
  }
}
