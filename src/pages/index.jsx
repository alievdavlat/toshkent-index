import Head from 'next/head'
import React, { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Element } from 'react-scroll'
import { useGetAll } from '@/hooks/crud'
import Faq from '@/components/HomePageComponents/Faq'
import News from '@/components/HomePageComponents/News'
import Info from '@/components/HomePageComponents/Info'
import { usePathname } from 'next/navigation'
import Banner from '@/components/HomePageComponents/Banner'
import Brands from '@/components/HomePageComponents/Brands'
import PageLoader from '@/components/PageLoader'
import { withLayout } from '../../layout/Layout'
import { FullPage, Slide } from 'react-full-page'
import Numbers from '@/components/HomePageComponents/Numbers'
import Contact from '@/components/HomePageComponents/Contact'
import Auction from '@/components/HomePageComponents/Auction'
import AutoShop from '@/components/HomePageComponents/AutoShop'
import { useDispatch, useSelector } from 'react-redux'
import Categories from '@/components/HomePageComponents/Categories'
import { currentSlideHandler, fullPageTotalSlidesHandler } from '@/store/features/system'
import useWindowSize from '@/hooks/useWindowDimensions'
import { useTranslation } from 'react-i18next'
import Seo from '@/components/seo'

export const getServerSideProps = async context => {
  const { locale } = context
  const title = {
    uz: 'Tashkent INDEX | YANGI ZAMONAVIY AVTO BOZOR',
    ru: 'Tashkent INDEX | НОВЫЙ СОВРЕМЕННЫЙ АВТОМОБИЛЬНЫЙ РЫНОК'
  }

  const desc = {
    uz: `72 gektarlik Tashkent INDEX industrial Business Park 3000 dan ortiq do'konlarni, 130 ta ishlab chiqarish ob'ektlarini, 3000 ga yaqin kichik biznes ob'ektlarini, ovqatlanish punktlarini, mehmonxonani, expocenterni, logistika majmuasini va boshqa bir qator infratuzilma ob'ektlarini o'z ichiga oladi.`,
    ru: `Индустриальный бизнес-парк Tashkent INDEX площадью 72 га включает в себя более 3000 магазинов, 130 производственных помещений, около 3000 помещений для малого бизнеса, точки общественного питания, гостиницу, экспоцентр, логистический комплекс и ряд других инфраструктурных объектов.`
  }

  return {
    props: {
      title: title,
      desc: desc,
      locale: locale
    }
  }
}

const Map = dynamic(() => import('@/components/HomePageComponents/Map'), { ssr: false })

const Home = ({ title, desc, locale }) => {
  const { i18n } = useTranslation()
  const pathname = usePathname()
  const dispatch = useDispatch()
  const [loader, setLoader] = useState(true)
  const [key, setKey] = useState(0)
  const { scrollEnabled, currentSlide } = useSelector(state => state.system)
  const ref = useRef()
  const [innerHeight, setInnerHeight] = useState(100)
  const [fullpageEvent, fullpageEventHandler] = useState({ from: 0, to: 1 })
  const sliderClassWatcher = fullpageEvent.from === 0 && fullpageEvent.to === 1
  const size = useWindowSize()

  const bannerHeightHandler = e => {
    e.to === 1 ? setInnerHeight(85) : setInnerHeight(100)
    fullpageEventHandler(e)
  }

  const { data, isLoading } = useGetAll({
    url: '/question-main/list/',
    name: '/question-main/list/'
  })

  useEffect(() => {
    let root = document.getElementsByTagName('html')[0]
    let rootBody = document.getElementsByTagName('body')[0]
    const footer = document.querySelector('.footer')
    dispatch(fullPageTotalSlidesHandler(ref?.current?._slides))

    root.classList.add('overflowH')
    rootBody.classList.add('bg')

    return () => {
      if (rootBody) {
        rootBody.classList.remove('bg')
      }
      if (root) {
        root.classList.remove('overflowH')
      }
      if (footer) {
        footer.classList.remove('footer-show')
      }
    }
  }, [pathname])

  useEffect(() => {
    let secondsToGo = 2

    const timer = setInterval(() => {
      secondsToGo -= 1
    }, 1000)

    setTimeout(() => {
      setLoader(false)
      clearInterval(timer)
    }, secondsToGo * 1000)

    const handleBeforeUnload = () => {
      dispatch(currentSlideHandler(0))
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  function CustomControls({ ...props }) {
    const { getCurrentSlideIndex, slidesCount, scrollToSlide } = props
    const currentSlideIndex = getCurrentSlideIndex()

    if (Boolean(typeof window !== 'undefined' && window.document && window.document.createElement)) {
      const footer = document.querySelector('.footer')

      if (footer) {
        footer.classList.add('footer-show')
      }

      if (currentSlideIndex === 0 || currentSlideIndex === slidesCount - 1) {
        if (footer) {
          footer.classList.remove('footer-show')
        }
      }
    }

    return (
      <nav className='fullpage-nav'>
        <ul>
          {([...Array(slidesCount)] || []).map((_, idx) => (
            <li key={idx} style={{ cursor: 'pointer' }}>
              <a href={null} onClick={() => scrollToSlide(idx)} className={currentSlideIndex === idx ? 'current' : ''}>
                <span></span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    )
  }

  return (
    <>
      <Seo
        title={title?.[i18n.language || 'uz']}
        description={desc?.[i18n.language || 'uz']}
        image={'/in.jpg'}
        url={'/'}
      />
      {loader && <PageLoader />}
      <FullPage
        controls={CustomControls}
        duration={1000}
        initialSlide={currentSlide}
        scrollMode={scrollEnabled ? 'normal' : 'full-page'}
        beforeChange={e => bannerHeightHandler(e)}
        afterChange={e => dispatch(currentSlideHandler(e.to))}
        ref={ref}
        key={key}
      >
        <Slide className={size.width < 800 && sliderClassWatcher ? 'fullpage-slider' : 'banner-slider'}>
          <Element id='banner' name='banner'>
            <Banner innerHeight={innerHeight} />
          </Element>
        </Slide>
        <Slide>
          <Element id='autoshop' name='autoshop'>
            <AutoShop />
          </Element>
        </Slide>
        <Slide>
          <Element id='categories' name='categories'>
            <Categories />
          </Element>
        </Slide>
        <Slide>
          <Element id='auction' name='auction'>
            <Auction />
          </Element>
        </Slide>
        <Slide>
          <Element id='info' name='info'>
            <Info />
          </Element>
        </Slide>
        <Slide>
          <Element id='numbers' name='numbers'>
            <Numbers />
          </Element>
        </Slide>
        <Slide>
          <Element id='map' name='map'>
            <Map />
          </Element>
        </Slide>
        <Slide>
          <Element id='news' name='news'>
            <News />
          </Element>
        </Slide>
        <Slide>
          <Element id='brands' name='brands'>
            <Brands />
          </Element>
        </Slide>
        {data?.data?.length > 0 ? (
          <Slide>
            <Element id='faq' name='faq'>
              <Faq data={data} isLoading={isLoading} />
            </Element>
          </Slide>
        ) : null}
        <Slide>
          <Element id='contact' name='contact'>
            <Contact />
          </Element>
        </Slide>
      </FullPage>
    </>
  )
}

export default withLayout(Home)
