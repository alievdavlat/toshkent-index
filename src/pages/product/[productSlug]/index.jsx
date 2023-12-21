import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import { get } from 'lodash'
import Image from 'next/image'
import i18n from '@/services/i18n'
import { Image as AntImage } from 'antd'
import { useRouter } from 'next/router'
import helpers from '@/services/helpers'
import { usePostMain } from '@/hooks/crud'
import { useTranslation } from 'next-i18next'
import { withLayout } from '@/../../layout/Layout'
import { ContainerOne } from '@/modules/container'
import { Swiper, SwiperSlide } from 'swiper/react'
import Gallery from '../../../../img/icons/image.svg'
import ArrowLeft from '../../../../img/icons/arrow-left.svg'
import ArrowRight from '../../../../img/icons/arrow-right.svg'
import { FreeMode, Navigation, Thumbs, Autoplay } from 'swiper/modules'
import { applicationModalVisibleHandler } from '@/store/features/system'
import { useDispatch } from 'react-redux'
import ZoomImg from '@/components/products/ZoomImg'
import MarketList from '@/components/products/MarketList'
import AutoshopList from '@/components/products/AutoshopList'
import { request } from '@/services'
import Seo from '@/components/seo'

const getProduct = async slug => {
  const response = await request({
    method: 'GET',
    url: `/elon/info/${slug}/`
  })
  return response?.data
}

export const getServerSideProps = async ({ params }) => {
  const { productSlug } = params
  const data = await getProduct(productSlug)
  const item = data?.items?.[0]
  const title = item?.title || ''

  const desc = item?.description || ''
  return {
    props: {
      title: title,
      desc: desc,
      url: '/product/' + productSlug,
      image: item?.images?.[0]
    }
  }
}

const ProductSlug = ({ title, desc, url, image }) => {
  const router = useRouter()
  const lang = i18n.language
  const { productSlug, slg } = router.query
  const [swiperRef, setSwiperRef] = useState(null)
  const [showPhone, setShowPhone] = useState(false)
  const [marketId, setMarkedId] = useState(null)
  const [markaId, setMarkaId] = useState(null)
  const { mutate } = usePostMain()
  const { t } = useTranslation('translate')
  const [activeIndex, setActiveIndex] = useState(0)
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const dispatch = useDispatch()

  const [isZoomed, setIsZoomed] = useState(false)

  const toggleZoom = () => {
    setIsZoomed(!isZoomed)
  }

  useEffect(() => {
    if (isZoomed) {
      document.documentElement.classList.add('off-scroll')
    } else {
      document.documentElement.classList.remove('off-scroll')
    }

    return () => {
      document.documentElement.classList.remove('off-scroll')
    }
  }, [isZoomed])

  const imageClassName = `ant-zoom-img ${isZoomed ? 'zoomed' : ''}`
  const phoneVisibleHandler = () => {
    mutate({
      url: `/elon/count-add/${productSlug}/`,
      method: 'post'
    })
    setShowPhone(prev => !prev)
  }

  const applicationVisibleHandler = () => {
    setApplicationVisible(prev => !prev)
  }

  const prevHandler = () => {
    swiperRef.slidePrev()
    setActiveIndex(swiperRef?.realIndex)
  }

  const nextHandler = () => {
    swiperRef.slideNext()
    setActiveIndex(swiperRef?.realIndex)
  }

  const containerRef = useRef(null)

  return (
    <section className='product'>
      <Seo title={`Tashkent INDEX | ${title}`} description={desc} image={image} url={url} />
      <div className='container'>
        <ContainerOne
          url={
            slg == 'avto'
              ? `/elon/info/${productSlug}/`
              : !slg
              ? `/elon/info/${productSlug}/`
              : `/product/info/${productSlug}/`
          }
          name={
            slg == 'avto'
              ? `/elon/info/${productSlug}/`
              : !slg
              ? `/elon/info/${productSlug}/`
              : `/product/info/${productSlug}/`
          }
          propId={productSlug}
          onSuccess={data => {
            setMarkaId(get(data, 'items[0].marka[0]'))
            setMarkedId(get(data, 'items[0].market'))
          }}
        >
          {({ item, isLoading }) => {
            return (
              <>
                <a onClick={() => router.back()} className='section-back' style={{ cursor: 'pointer' }}>
                  <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M12 1L5 8L12 15'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  <span suppressHydrationWarning={true} onClick={() => router.push('/')}>
                    {t('autoshop')}
                  </span>
                </a>
                <h1 className='section-title product__title'>{get(item, 'items[0].title')}</h1>
                <div className='product-wrap'>
                  <div className='product-main'>
                    <div className='product-gallery' v-if='images'>
                      <div className='product-gallery__main'>
                        <div className='product-gallery__count'>
                          <Image src={Gallery} width={12} height={12} alt='ico' />
                          <span>
                            {' '}
                            {activeIndex + 1} of {get(item, 'items[0].images', []).length}{' '}
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
                          spaceBetween={20}
                          navigation={true}
                          loop={get(item, 'items[0].images', []).length > 1}
                          speed={2000}
                          onSwiper={swiper => setSwiperRef(swiper)}
                          thumbs={{ swiper: thumbsSwiper }}
                          modules={[FreeMode, Navigation, Thumbs, Autoplay]}
                          style={{ height: '100%' }}
                        >
                          {get(item, 'items[0].images', []).map((_item, idx) => (
                            <SwiperSlide key={idx}>
                              <div className='product-gallery__main-img'>
                                <AntImage
                                  key={idx}
                                  src={_item}
                                  width={100 + '%'}
                                  height={100 + '%'}
                                  alt={get(item, 'items[0].title')}
                                  title={get(item, 'items[0].title')}
                                  rootClassName={imageClassName}
                                  loading='lazy'
                                  onClick={() => setIsZoomed(true)}
                                  preview={{
                                    onVisibleChange: (visible, prevVisible) => setIsZoomed(visible)
                                  }}
                                />
                                <ZoomImg />
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
                        loop={false}
                        speed={2000}
                        className='product-gallery__thumbs'
                        style={{ display: 'flex', justifyContent: 'center' }}
                        modules={[Navigation, Thumbs, Autoplay]}
                      >
                        {get(item, 'items[0].images', []).map((_item, idx) => (
                          <SwiperSlide key={idx} style={{ width: '100%', maxWidth: '6rem' }}>
                            <div role='button' onClick={() => setActiveIndex(swiperRef?.realIndex)}>
                              <Image
                                src={_item}
                                width={790}
                                height={360}
                                alt={get(item, 'items[0].title')}
                                title={get(item, 'items[0].title')}
                              />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                    <div className='product-main__title' suppressHydrationWarning={true}>
                      {t('characteristics')}
                    </div>

                    <div className='product-chars'>
                      <ul className='product-main__list'>
                        <li className='product-main__item'>
                          <div className='product-main__wrap'>
                            <Image src={'/2.svg'} width={16} height={16} alt='ico' />
                            <span suppressHydrationWarning={true}>{t('color')}</span>
                          </div>
                          <div className='product-main__value'>
                            {get(item, `items[0].color[0].label.label_${lang}`)}
                          </div>
                        </li>
                        <li className='product-main__item'>
                          <div className='product-main__wrap'>
                            <Image src={'/2.svg'} width={16} height={16} alt='ico' />
                            <span suppressHydrationWarning={true}>{t('status')}</span>
                          </div>
                          <div className='product-main__value'>
                            {get(item, `items[0].condition[0].label.label_${lang}`)}
                          </div>
                        </li>
                        <li className='product-main__item'>
                          <div className='product-main__wrap'>
                            <Image src={'/2.svg'} width={16} height={16} alt='ico' />
                            <span>{t('fuelType')}</span>
                          </div>
                          <div className='product-main__value'>
                            {get(item, `items[0].fuel_type[0].label.label_${lang}`)}
                          </div>
                        </li>
                        <li className='product-main__item'>
                          <div className='product-main__wrap'>
                            <Image src={'/2.svg'} width={16} height={16} alt='ico' />
                            <span>{t('mark')}</span>
                          </div>
                          <div className='product-main__value'>
                            {get(item, `items[0].marka[0].label.label_${lang}`)}
                          </div>
                        </li>
                        <li className='product-main__item'>
                          <div className='product-main__wrap'>
                            <Image src={'/2.svg'} width={16} height={16} alt='ico' />
                            <span>{t('parkingSpace')}</span>
                          </div>
                          <div className='product-main__value' style={{ textAlign: 'end' }}>
                            {get(item, `items[0].address`)}
                          </div>
                        </li>
                        {get(item, `items[0].model`) && (
                          <li className='product-main__item'>
                            <div className='product-main__wrap'>
                              <Image src={'/2.svg'} width={16} height={16} alt='ico' />
                              <span>{t('model')}</span>
                            </div>
                            <div className='product-main__value'>
                              {get(item, `items[0].model[0].label.label_${lang}`)}
                            </div>
                          </li>
                        )}
                        <li className='product-main__item'>
                          <div className='product-main__wrap'>
                            <Image src={'/2.svg'} width={16} height={16} alt='ico' />
                            <span suppressHydrationWarning={true}>{t('type')}</span>
                          </div>
                          <div className='product-main__value'>{get(item, `items[0].type[0].label.label_${lang}`)}</div>
                        </li>
                        <li className='product-main__item'>
                          <div className='product-main__wrap'>
                            <Image src={'/2.svg'} width={16} height={16} alt='ico' />
                            <span suppressHydrationWarning={true}>{t('year')}</span>
                          </div>
                          <div className='product-main__value'>{get(item, 'items[0].year')}</div>
                        </li>
                        {item?.items[0]?.price_type ? (
                          <li className='product-main__item'>
                            <div className='product-main__wrap'>
                              <Image src={'/2.svg'} width={16} height={16} alt='ico' />
                              <span suppressHydrationWarning={true}>{t('paymantType')}</span>
                            </div>
                            <div className='product-main__value'>
                              {item?.items[0]?.price_type?.map(el => el?.label?.[`label_${lang}`])?.join(', ')}
                            </div>
                          </li>
                        ) : (
                          <li></li>
                        )}
                        {item?.items[0]?.position ? (
                          <li className='product-main__item'>
                            <div className='product-main__wrap'>
                              <Image src={'/2.svg'} width={16} height={16} alt='ico' />
                              <span suppressHydrationWarning={true}>{t('position')}</span>
                            </div>
                            <div className='product-main__value'>
                              {item?.items[0]?.position?.map(el => el?.label?.[`label_${i18n.language}`])?.join(', ')}
                            </div>
                          </li>
                        ) : (
                          <li></li>
                        )}
                        {item?.items[0]?.model ? (
                          <li className='product-main__item'>
                            <div className='product-main__wrap'>
                              <Image src={'/2.svg'} width={16} height={16} alt='ico' />
                              <span suppressHydrationWarning={true}>{t('model')}</span>
                            </div>
                            <div className='product-main__value'>
                              {item?.items[0]?.model?.map(el => el?.label?.[`label_${i18n.language}`])?.join(', ')}
                            </div>
                          </li>
                        ) : (
                          <li></li>
                        )}
                        {item?.items[0]?.probeg ? (
                          <li className='product-main__item'>
                            <div className='product-main__wrap'>
                              <Image src={'/2.svg'} width={16} height={16} alt='ico' />
                              <span suppressHydrationWarning={true}>{t('probeg')}</span>
                            </div>
                            <div className='product-main__value'>{item?.items[0]?.probeg}</div>
                          </li>
                        ) : (
                          <li></li>
                        )}
                        {item?.items[0]?.power ? (
                          <li className='product-main__item'>
                            <div className='product-main__wrap'>
                              <Image src={'/2.svg'} width={16} height={16} alt='ico' />
                              <span suppressHydrationWarning={true}>{t('power')}</span>
                            </div>
                            <div className='product-main__value'>{item?.items[0]?.power}</div>
                          </li>
                        ) : (
                          <li></li>
                        )}
                        {item?.items[0]?.capacity ? (
                          <li className='product-main__item'>
                            <div className='product-main__wrap'>
                              <Image src={'/2.svg'} width={16} height={16} alt='ico' />
                              <span suppressHydrationWarning={true}>{t('capacity')}</span>
                            </div>
                            <div className='product-main__value'>{item?.items[0]?.capacity}</div>
                          </li>
                        ) : (
                          <li></li>
                        )}
                        {item?.items[0]?.tire_size ? (
                          <li className='product-main__item'>
                            <div className='product-main__wrap'>
                              <Image src={'/2.svg'} width={16} height={16} alt='ico' />
                              <span suppressHydrationWarning={true}>{t('tire_size')}</span>
                            </div>
                            <div className='product-main__value'>{item?.items[0]?.tire_size}</div>
                          </li>
                        ) : (
                          <li></li>
                        )}
                        {item?.items[0]?.gear ? (
                          <li className='product-main__item'>
                            <div className='product-main__wrap'>
                              <Image src={'/2.svg'} width={16} height={16} alt='ico' />
                              <span suppressHydrationWarning={true}>{t('gear')}</span>
                            </div>
                            <div className='product-main__value'>
                              {item?.items[0]?.gear?.map(el => el?.label?.[`label_${i18n.language}`])?.join(', ')}
                            </div>
                          </li>
                        ) : (
                          <li></li>
                        )}
                        {item?.items[0]?.car_type ? (
                          <li className='product-main__item'>
                            <div className='product-main__wrap'>
                              <Image src={'/2.svg'} width={16} height={16} alt='ico' />
                              <span suppressHydrationWarning={true}>{t('car_type')}</span>
                            </div>
                            <div className='product-main__value'>
                              {item?.items[0]?.car_type?.map(el => el?.label?.[`label_${i18n.language}`])?.join(', ')}
                            </div>
                          </li>
                        ) : (
                          <li></li>
                        )}
                        {item?.items[0]?.amenities ? (
                          <li className='product-main__item'>
                            <div className='product-main__wrap'>
                              <Image src={'/2.svg'} width={16} height={16} alt='ico' />
                              <span suppressHydrationWarning={true}>{t('amenities')}</span>
                            </div>
                            <div className='product-main__value'>
                              {item?.items[0]?.amenities?.map(el => el?.label?.[`label_${i18n.language}`])?.join(', ')}
                            </div>
                          </li>
                        ) : (
                          <li></li>
                        )}
                      </ul>
                    </div>
                  </div>
                  <div className='product-info'>
                    <div className='product-info__card'>
                      <div className='product-info__card-wrap'>
                        <div className='product-info__title'>{get(item, 'items[0].title')}</div>
                        <div className='product-info__subtitle'>{t('Info')}</div>
                        <div className='product-info__text'>{get(item, 'items[0].description')}</div>
                        <div className='product-info__price'>
                          {helpers.convertToReadable(get(item, 'items[0].price'))}{' '}
                          {get(item, `items[0].currency[0].label.label_${lang}`) || t('sum')}
                        </div>
                      </div>
                      {showPhone ? (
                        <button className='btn'>
                          <a href={`tel: ${get(item, 'items[0].phone_number')}`} style={{ color: '#FFF' }}>
                            {get(item, 'items[0].phone_number')}
                          </a>
                        </button>
                      ) : (
                        <button className='btn' onClick={phoneVisibleHandler} suppressHydrationWarning={true}>
                          {t('shownumber')}
                        </button>
                      )}
                      <button
                        className='btn application-btn'
                        onClick={() => dispatch(applicationModalVisibleHandler(window.location.href))}
                        suppressHydrationWarning={true}
                      >
                        {t('sendAnApplication')}
                      </button>

                      {(get(item, 'items[0].market') || []).length > 0 && (
                        <div className='product-info__market'>
                          <div className='product-info__market-wrap'>
                            <div className='logo'>
                              <Image
                                src={get(item, 'items[0].market[0].logo') || '/no-image.png'}
                                width={210}
                                height={130}
                                alt='logo'
                              />
                            </div>
                            <div className='box'>
                              <div className='product-info__title'>{get(item, 'items[0].market[0].title')}</div>
                              <div className='product-info__subtitle'>{get(item, 'items[0].market[0].sub_title')}</div>
                            </div>
                            {/* /.box */}
                          </div>
                          <button className='btn'>
                            <a
                              href={`/shop/${get(item, 'items[0].market[0].slug')}?id=${get(
                                item,
                                'items[0].market[0].id'
                              )}`}
                              suppressHydrationWarning={true}
                              style={{ color: '#FFF' }}
                            >
                              {t('goToStore')}
                            </a>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )
          }}
        </ContainerOne>

        <div className='product-more'>
          {get(marketId, '[0].id') ? (
            <MarketList
              url={`/product/list/${get(marketId, '[0].id')}/`}
              name={`/product/list/${get(marketId, '[0].id')}/`}
              marketId={get(marketId, '[0].id')}
            />
          ) : (
            <AutoshopList url={`/elon/list/`} name={`/elon/list/`} marka={get(markaId, 'id')} />
          )}
        </div>
      </div>
    </section>
  )
}

export default withLayout(ProductSlug)
