import React, { useState } from 'react'
import Image from 'next/image'
import { Autoplay } from 'swiper/modules'
import NoDataUI from '@/components/NoDataUI'
import PageLoader from '@/components/PageLoader'
import { ContainerAll } from '@/modules/container'
import { Swiper, SwiperSlide } from 'swiper/react'
import ArrowLeft from '@/../../img/icons/arrow-left.svg'
import ArrowRight from '@/../../img/icons/arrow-right.svg'
import AutoShopCard from '@/components/Cards/AutoShopCard'
import Link from 'next/link'
import { useTranslation } from "next-i18next";

const AutoShop = () => {
  const [swiperRef, setSwiperRef] = useState(null)
  const {t} = useTranslation('translation');

  const prevHandler = () => {
    swiperRef.slidePrev()
  }

  const nextHandler = () => {
    swiperRef.slideNext()
  }

  return (
    <section className='section shop'>
      <ContainerAll url={`/elon/list/`} name='/elon/list'>
        {({ items, isLoading }) => {
          return (
            <>
              {items?.items?.length === 0 && !isLoading ? <NoDataUI /> : ''}
              {isLoading && <PageLoader />}
              {items?.items?.length > 0 && (
                <>
                  <div className='container section-container'>
                    <div className='section-head'>
                      <h2 className='section-title'>{t('autoshop')}</h2>
                      <div className='section-wrap'>
                        <Link href="/catalog" className='section-link'>
                          {t("all")}
                        </Link>
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
                      className='shop-carousel owl-carousel'
                      spaceBetween={30}
                      loop={items?.items?.length > 4}
                      speed={2000}
                      slidesPerView={1}
                      onSwiper={swiper => setSwiperRef(swiper)}
                      modules={[Autoplay]}
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
                          slidesPerView: 3,
                          spaceBetween: 20
                        },
                        1024: {
                          slidesPerView: 4,
                          spaceBetween: 20
                        }
                      }}
                    >
                      {(items?.items || []).map((item, idx) => (
                        <SwiperSlide key={idx}>
                          <AutoShopCard item={item} />
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

export default AutoShop;
