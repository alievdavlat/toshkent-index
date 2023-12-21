import React, { useState } from 'react'
import Image from 'next/image'
import Gallery from '@/img/icons/image.svg'
import ArrowLeft from '@/img/icons/arrow-left.svg'
import ArrowRight from '@/img/icons/arrow-right.svg'
import { withLayout } from '@/../../layout/Layout'
import { useRouter } from 'next/router'
import i18n from '@/services/i18n'
import { get } from 'lodash'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Thumbs, Autoplay } from 'swiper/modules'
import helpers from '@/services/helpers'
import { ContainerAll, ContainerOne } from '@/modules/container'
import { usePostMain } from '@/hooks/crud'
import PageLoader from '@/components/PageLoader'
import NodataUI from '@/components/NoDataUI'
import { useTranslation } from 'next-i18next'
import MarketList from '@/components/products/MarketList'
import AutoshopList from '@/components/products/AutoshopList'

const Product = () => {
  const { t } = useTranslation('translation')
  const { mutate, isSuccess, isLoading } = usePostMain()
  const router = useRouter()
  const { slg, id, markedID } = router?.query
  const [swiperRef, setSwiperRef] = useState(null)
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [showPhone, setShowPhone] = useState(false)
  const [marketId, setMarkedId] = useState(null)
  const [markaId, setMarkadId] = useState(null)

  const phoneVisibleHandler = () => {
    mutate({
      url: `/elon/count-add/${slg}/`,
      method: 'post'
    })
    setShowPhone(prev => !prev)
  }

  const prevHandler = () => {
    swiperRef.slidePrev()
    setActiveIndex(swiperRef?.realIndex)
  }

  const nextHandler = () => {
    swiperRef.slideNext()
    setActiveIndex(swiperRef?.realIndex)
  }

  return (
    <section className='product'>
      <div className='container'>
        <ContainerOne
          url={`/product/info/${slg}/`}
          name={`/product/info/${slg}/`}
          propId={id}
          onSuccess={data => {
            setMarkedId(get(data, 'market'))
          }}
        >
          {({ item, isLoading }) => {
            return (
              <>
                {isLoading && <PageLoader />}
                <a href={null} className='section-back'>
                  <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M12 1L5 8L12 15'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  <span onClick={() => router.push('/')}>Avtodo’kon</span>
                </a>
                <h1 className='section-title product__title'>{get(item, 'title')}</h1>
                <div className='product-wrap'>
                  <div className='product-main'>
                    <div className='product-gallery' v-if='images'>
                      <div className='product-gallery__main'>
                        <div className='product-gallery__count'>
                          <Image src={Gallery} width={12} height={12} alt='ico' />
                          <span>
                            {' '}
                            {activeIndex + 1} of of {get(item, 'images', []).length}{' '}
                          </span>
                        </div>
                        <div className='product-gallery__arrows'>
                          <span className='arrow-left' onClick={prevHandler}>
                            <Image src={ArrowLeft} width={16} height={16} alt='ico' />
                          </span>
                          <span className='arrow-right' onClick={nextHandler}>
                            <Image src={ArrowRight} width={16} height={16} alt='ico' />
                          </span>
                        </div>
                        <Swiper
                          spaceBetween={0}
                          navigation={true}
                          loop={get(item, 'images', []).length > 1}
                          speed={2000}
                          onSwiper={swiper => setSwiperRef(swiper)}
                          thumbs={{ swiper: thumbsSwiper }}
                          modules={[FreeMode, Navigation, Thumbs, Autoplay]}
                          style={{ height: '100%' }}
                        >
                          {get(item, 'images', []).map((_item, idx) => (
                            <SwiperSlide key={idx}>
                              <div className='product-gallery__main-img'>
                                <Image
                                  src={_item}
                                  width={790}
                                  height={360}
                                  alt={get(item, 'title')}
                                  title={get(item, 'title')}
                                />
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                      <Swiper
                        onSwiper={setThumbsSwiper}
                        spaceBetween={22}
                        slidesPerView={6}
                        freeMode={true}
                        watchSlidesProgress={true}
                        loop={get(item, 'images', []).length > 4}
                        speed={2000}
                        className='product-gallery__thumbs'
                        style={{ display: 'flex', justifyContent: 'center' }}
                        modules={[Navigation, Thumbs, Autoplay]}
                      >
                        {get(item, 'images', []).map((_item, idx) => (
                          <SwiperSlide key={idx} style={{ width: '100%', maxWidth: '6rem' }}>
                            <div role='button' onClick={() => setActiveIndex(swiperRef?.realIndex)}>
                              <Image
                                src={_item}
                                width={790}
                                height={360}
                                alt={get(item, 'title')}
                                title={get(item, 'title')}
                              />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                    <div className='product-main__title' suppressHydrationWarning={true}>
                      {t('characteristics')}
                    </div>
                    <ContainerAll url={`/eav/category/steps/${markedID}/`} name={`/eav/category/steps/${markedID}/`}>
                      {({ items: steps, isLoading }) => {
                        return (
                          <>
                            {steps?.fields?.length <= 0 && !isLoading ? <NodataUI /> : ''}
                            {isLoading && <PageLoader />}
                            <div className='product-chars'>
                              <ul className='product-main__list'>
                                {steps?.fields?.map((step, i) => (
                                  <li className='product-main__item' key={i}>
                                    <div className='product-main__wrap'>
                                      <Image src={'/2.svg'} width={16} height={16} alt='ico' />
                                      <span>{step?.properties?.label[`label_${i18n.language}`]}</span>
                                    </div>
                                    <div className='product-main__value'>
                                      {step?.properties?.values?.find(el => el?.value === item?.properties[step.slug])
                                        ?.label[`label_${i18n.language}`] || item?.properties[step.slug]}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </>
                        )
                      }}
                    </ContainerAll>
                  </div>
                  <div className='product-info'>
                    <div className='product-info__card'>
                      <div className='product-info__card-wrap'>
                        <div className='product-info__title'>{get(item, 'title')}</div>
                        <div className='product-info__subtitle'>{t('Info')}</div>
                        <div className='product-info__text'>{get(item, 'description')}</div>
                        <div className='product-info__price' suppressHydrationWarning={true}>
                          {helpers.convertToReadable(get(item, 'items[0].price'))} {t('sum')}
                        </div>
                      </div>
                      {showPhone ? (
                        <button className='btn'>
                          <a href={`tel: ${get(item, 'phone_number')}`} style={{ color: '#FFF' }}>
                            {get(item, 'phone_number')}
                          </a>
                        </button>
                      ) : (
                        <button className='btn' onClick={phoneVisibleHandler}>
                          {t('showNumber')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )
          }}
        </ContainerOne>
        <div className='product-more'>
          {marketId?.id ? (
            <MarketList
              url={`/product/list/${get(marketId, 'id')}/`}
              name={`/product/list/${get(marketId, 'id')}/`}
              marketId={get(marketId, 'id')}
            />
          ) : (
            <AutoshopList url={`/elon/list/`} name={`/elon/list/`} marka={get(markaId, 'id')} />
          )}
        </div>
      </div>
    </section>
  )
}

export default withLayout(Product)
