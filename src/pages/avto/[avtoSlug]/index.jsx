  import React, { useEffect, useState } from 'react'
import { get } from 'lodash'
import Image from 'next/image'
import i18n from '@/services/i18n'
import Img2 from '@/img/config/2.svg'
import { Image as AntImage } from 'antd'
import { useRouter } from 'next/router'
import helpers from '@/services/helpers'
import { usePostMain } from '@/hooks/crud'
import Gallery from '@/img/icons/image.svg'
import { useTranslation } from 'next-i18next'
import PageLoader from '@/components/PageLoader'
import ArrowLeft from '@/img/icons/arrow-left.svg'
import { Swiper, SwiperSlide } from 'swiper/react'
import { ContainerAll } from '@/modules/container'
import ArrowRight from '@/img/icons/arrow-right.svg'
import { withLayout } from '../../../../layout/Layout'
import { FreeMode, Navigation, Thumbs, Autoplay } from 'swiper/modules'
import { applicationModalVisibleHandler } from '@/store/features/system'
import { useDispatch } from 'react-redux'
import ZoomImg from '@/components/avto/components/ZoomImg'
import Seo from '@/components/seo'
import { request } from '@/services'

const getProduct = async slug => {
  if (!!slug) {
    const response = await request({
      method: 'GET',
      url: `/product/info/${slug}/`
    })
    return response?.data
  }
}

export const getServerSideProps = async ({ params }) => {
  const { avtoSlug } = params
  const data = await getProduct(avtoSlug)
  const title = data?.title || ''

  const desc = data?.description || ''
  return {
    props: {
      title: title,
      desc: desc,
      url: '/avto/' + avtoSlug
    }
  }
}

const AvtoSlugSingle = ({ title, desc, url }) => {
  const router = useRouter()
  const [showPhone, setShowPhone] = useState(false)
  const { t } = useTranslation('translation')
  const { mutate } = usePostMain()
  const [swiperRef, setSwiperRef] = useState(null)
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const dispatch = useDispatch()

  const phoneVisibleHandler = () => {
    mutate({
      url: `/elon/count-add/${router?.query?.avtoSlug}/`,
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
    <>
      <Seo title={`Tashkent INDEX | ${title}`} description={desc} image={'/favicon.ico'} url={url} />
      {!!router?.query?.id ? (
        <ContainerAll
          url={`/eav/category/steps/${router?.query?.storySlug}/`}
          name={`/eav/category/steps/${router?.query?.storySlug}/`}
          auth={false}
        >
          {({ items: steps }) => {
            return (
              <ContainerAll
                url={`/product/info/${router?.query?.avtoSlug}/`}
                name={`/product/info/${router?.query?.avtoSlug}`}
                auth={false}
              >
                {({ items, isLoading }) => {
                  return (
                    <>
                      {isLoading && <PageLoader />}
                      <section className='product'>
                        <div className='container'>
                          <a
                            href={`/shop/${get(items, 'market.slug')}?id=${get(items, 'market.id')}`}
                            className='section-back'
                          >
                            <svg
                              width='16'
                              height='16'
                              viewBox='0 0 16 16'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                d='M12 1L5 8L12 15'
                                stroke='currentColor'
                                strokeWidth='1.5'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                            </svg>
                            <span suppressHydrationWarning={true}>{t('return')}</span>
                          </a>
                          <h1 className='section-title product__title'>{items?.title}</h1>
                          <div className='product-wrap'>
                            <div className='product-main'>
                             
                              <div className='product-gallery' v-if='images'>
                                <div className='product-gallery__main'>
                                  <div className='product-gallery__count'>
                                    <Image src={Gallery} width={12} height={12} alt='ico' />
                                    <span>
                                      {' '}
                                      {activeIndex + 1} of {get(items, 'images', []).length}{' '}
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
                                    loop={get(items, 'images', []).length > 1}
                                    speed={2000}
                                    onSwiper={swiper => setSwiperRef(swiper)}
                                    thumbs={{ swiper: thumbsSwiper }}
                                    modules={[FreeMode, Navigation, Thumbs, Autoplay]}
                                    style={{ height: '100%' }}
                                  >
                                    {get(items, 'images', []).map((_item, idx) => (
                                      <SwiperSlide key={idx}>
                                        <div className='product-gallery__main-img'>
                                          <AntImage
                                            src={_item}
                                            width={790}
                                            height={100}
                                            alt={items?.title}
                                            title={items?.title}
                                            rootClassName='ant-zoom-img'
                                            loading='lazy'
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
                                  loop={get(items, 'images', []).length > 4}
                                  speed={2000}
                                  className='product-gallery__thumbs'
                                  style={{ display: 'flex', justifyContent: 'center' }}
                                  modules={[Navigation, Thumbs, Autoplay]}
                                >
                                  {get(items, 'images', []).map((_item, idx) => (
                                    <SwiperSlide key={idx} style={{ width: '100%', maxWidth: '6rem' }}>
                                      <div role='button' onClick={() => setActiveIndex(swiperRef?.realIndex)}>
                                        <Image
                                          src={_item}
                                          width={790}
                                          height={360}
                                          alt={items?.title}
                                          title={items?.title}
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
                                  {steps?.fields?.map((step, i) => (
                                    <li className='product-main__item' key={i}>
                                      <div className='product-main__wrap'>
                                        <Image src={Img2} width={16} height={16} alt='ico' />
                                        <span>{step?.properties?.label[`label_${i18n.language}`]}</span>
                                      </div>
                                      <div className='product-main__value'>
                                        {step?.properties?.values?.find(
                                          el => el?.value === items?.properties[step.slug]
                                        )?.label[`label_${i18n.language}`] || items?.properties[step.slug]}
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <div className='product-info'>
                              <div className='product-info__card'>
                                <div className='product-info__card-wrap'>
                                  <div className='product-info__title'>{items?.title}</div>
                                  <div className='product-info__subtitle' suppressHydrationWarning={true}>
                                    {t('Info')}
                                  </div>
                                  <div className='product-info__text'>{items?.description}</div>
                                  <div className='product-info__price'>
                                    {helpers.convertToReadable(items?.price)}{' '}
                                    {items?.currency?.[0]?.label?.[`label_${i18.language})`]}
                                  </div>
                                </div>
                                {showPhone ? (
                                  <button className='btn'>
                                    <a href={`tel: ${get(items, 'phone_number')}`} style={{ color: '#FFF' }}>
                                      {get(items, 'phone_number')}
                                    </a>
                                  </button>
                                ) : (
                                  <button className='btn' onClick={phoneVisibleHandler}>
                                    {t('Raqam ko’rsatish')}
                                  </button>
                                )}
                                <button
                                  className='btn application-btn'
                                  onClick={() => dispatch(applicationModalVisibleHandler(window.location.href))}
                                  suppressHydrationWarning={true}
                                >
                                  {t('sendAnApplication')}
                                </button>
                                {get(items, 'market') && (
                                  <div className='product-info__market'>
                                    <div className='product-info__market-wrap'>
                                      <div className='logo'>
                                        <Image
                                          src={get(items, 'market.logo') || '/no-image.png'}
                                          width={210}
                                          height={130}
                                          alt='logo'
                                        />
                                      </div>
                                      <div className='box'>
                                        <div className='product-info__title'>{get(items, 'market.title')}</div>
                                        <div className='product-info__subtitle'>{get(items, 'market.sub_title')}</div>
                                      </div>
                                    </div>
                                    <button className='btn'>
                                      <a
                                        href={`/shop/${get(items, 'market.slug')}?id=${get(items, 'market.id')}`}
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
                        </div>
                      </section>
                    </>
                  )
                }}
              </ContainerAll>
            )
          }}
        </ContainerAll>
      ) : null}
    </>
  )
}

export default withLayout(AvtoSlugSingle)
