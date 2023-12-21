import React, { useState } from 'react'
import Image from 'next/image'
import { Autoplay } from 'swiper/modules'
import { useRouter } from 'next/router'
import NodataUI from '@/components/NoDataUI'
import PageLoader from '@/components/PageLoader'
import { ContainerAll } from '@/modules/container'
import NewsCard from '@/components/Cards/NewsCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import ArrowLeft from '@/../../img/icons/arrow-left.svg'
import ArrowRight from '@/../../img/icons/arrow-right.svg'
import { useTranslation } from 'next-i18next'

const News = () => {
    const router = useRouter()
  const [swiperRef, setSwiperRef] = useState(null)
  const { t } = useTranslation('translation')

  const prevHandler = () => {
    swiperRef.slidePrev()
  }

  const nextHandler = () => {
    swiperRef.slideNext()
  }

  return (
    <section className='section news'>
      <ContainerAll
        url={'/news/list/'}
        name={'/news/list/'}
        params={{
          limit: 4
        }}
      >
        {({ items, isLoading }) => {
          return (
            <>
              {items?.length <= 0 && !isLoading ? <NodataUI /> : ''}
              {isLoading && <PageLoader />}
              {items?.length > 0 && (
                <>
                  <div className='container section-container'>
                    <div className='section-head'>
                      <h2 className='section-title'>{t('newsPromotions')}</h2>
                      <div className='section-wrap'>
                          <a href={null}
                             onClick={() => router.push(`/news/`)} className="section-link" >
                              {t('all')}
                                                </a>
                        <div className='section-arrows'>
                          <span className='arrow-left' onClick={prevHandler}>
                            <Image src={ArrowLeft} width={40} height={40} alt='ico' />
                          </span>
                          <span className='arrow-right' onClick={nextHandler}>
                            <Image src={ArrowRight} width={40} height={40} alt='ico' />
                          </span>
                        </div>
                      </div>
                    </div>
                    <Swiper
                      className='news-carousel owl-carousel'
                      spaceBetween={30}
                      loop={true}
                      speed={2000}
                      slidesPerView={1}
                      modules={[Autoplay]}
                      onSwiper={swiper => setSwiperRef(swiper)}
                      autoplay={{
                        delay: 2500,
                        disableOnInteraction: false
                      }}
                      breakpoints={{
                        640: {
                          slidesPerView: 2,
                          spaceBetween: 20
                        },
                        768: {
                          slidesPerView: 2,
                          spaceBetween: 20
                        },
                        992: {
                          slidesPerView: 4,
                          spaceBetween: 20
                        },
                        1024: {
                          slidesPerView: 4,
                          spaceBetween: 20
                        }
                      }}
                    >
                      {(items || []).map((item, idx) => (
                        <SwiperSlide key={idx}>
                          <NewsCard item={item} />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </>
              )}
            </>
          )
        }}
      </ContainerAll>
    </section>
  )
}

export default News
