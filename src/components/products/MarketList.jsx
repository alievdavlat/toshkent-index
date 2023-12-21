import React, { useState } from 'react'
import { get } from 'lodash'
import Image from 'next/image'
import i18n from '@/services/i18n'
import NodataUI from '@/components/NoDataUI'
import { useTranslation } from 'next-i18next'
import PageLoader from '@/components/PageLoader'
import { Swiper, SwiperSlide } from 'swiper/react'
import { ContainerAll } from '@/modules/container'
import { Navigation, Autoplay } from 'swiper/modules'
import AutoShopCard from '@/components/Cards/AutoShopCard'
import ArrowLeft from '@/img/icons/arrow-left.svg'
import ArrowRight from '@/img/icons/arrow-right.svg'
import MarkedListCard from './MarkedListCard'

const MarketList = ({ ...props }) => {
  const { url, name, marketId } = props
  const [shopSwiperRef, setShopSwiperRef] = useState(null)
  const { t } = useTranslation('translate')

  const shopPrevHandler = () => {
    shopSwiperRef.slidePrev()
  }

  const shopNextHandler = () => {
    shopSwiperRef.slideNext()
  }

  return (
    <ContainerAll url={url} name={name}>
      {({ items, isLoading }) => {
        return (
          <>
            {items?.ads?.length <= 0 && !isLoading ? <NodataUI /> : ''}
            {isLoading && <PageLoader />}
            {items?.ads?.length > 0 && (
              <>
                <div className='section-head'>
                  <h2 className='section-title'>{t('products')}</h2>
                  <div className='section-wrap'>
                    <div className='section-arrows'>
                      <span className='arrow-left' onClick={shopPrevHandler}>
                        <Image src={ArrowLeft} width={16} height={16} alt='ico' />
                      </span>
                      <span className='arrow-right' onClick={shopNextHandler}>
                        <Image src={ArrowRight} width={16} height={16} alt='ico' />
                      </span>
                    </div>
                  </div>
                </div>

                <Swiper
                  spaceBetween={20}
                  navigation={true}
                  loop={true}
                  speed={2000}
                  slidesPerView={1}
                  onSwiper={swiper => setShopSwiperRef(swiper)}
                  modules={[Navigation, Autoplay]}
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
                      slidesPerView: 4,
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
                  className='shop-carousel owl-carousel'
                >
                  {get(items, 'ads', []).map((item, idx) => (
                    <SwiperSlide key={idx}>
                      <AutoShopCard item={item} />
                    </SwiperSlide>
                  ))}
                  {get(items, 'products', []).map((item, idx) => (
                    <SwiperSlide key={idx}>
                      <MarkedListCard item={item} marketId={marketId} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </>
            )}
          </>
        )
      }}
    </ContainerAll>
  )
}

export default MarketList
