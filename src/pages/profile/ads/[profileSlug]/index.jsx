'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Gallery from '@/img/icons/image.svg'
import ArrowLeft from '@/img/icons/arrow-left.svg'
import ArrowRight from '@/img/icons/arrow-right.svg'
import Img1 from '@/img/config/1.svg'
import Img2 from '@/img/config/2.svg'
import Img3 from '@/img/config/3.svg'
import Img4 from '@/img/config/4.svg'
import { useRouter } from 'next/router'
import { Image as AntImage } from 'antd'
import { ContainerOne } from '@/modules/container'
import i18n from '@/services/i18n'
import helpers from '@/services/helpers'
import Link from 'next/link'
import Delete from '@/modules/container/delete'
import DeActivate from '@/modules/container/deactivate'
import { withLayout } from '../../../../../layout/Layout'
import { FreeMode, Navigation, Thumbs, Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import ZoomImg from './components/ZoomImg'
import { get } from 'lodash'
import PageLoader from '@/components/PageLoader'
import { useTranslation } from 'next-i18next'
import check from '@/img/icons/done.svg'
import Header from '../../../../../layout/Header'
import { requestAuth } from '@/services'
import { useMutation } from '@tanstack/react-query'

const DashboardSingle = () => {
  const router = useRouter()
  const { t } = useTranslation('translation')
  const [swiperRef, setSwiperRef] = useState(null)
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [thumbsActive, setThumbsActive] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const deleteArchive = async data => {
    const response = await requestAuth({
      url: data?.url,
      data: data?.data,
      method: 'PUT'
    })
    return response
  }

  const { mutate, isLoading: adeArchiveLoading } = useMutation(deleteArchive, {
    onSuccess: data => {
      setIsModalOpen(true)
    }
    // onError: () => onError
  })

  const succesModalHandler = () => {
    setIsModalOpen(false)
    router.back()
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
      <ContainerOne
        url={`/elon/info/${router?.query?.profileSlug}/`}
        name={`/elon/info/${router?.query?.profileSlug}/`}
        auth={true}
        propId={router?.query?.profileSlug}
        params={{
          limit: 1
        }}
      >
        {({ item, isLoading }) => {
          const status = item?.items?.[0]?.status
          return (
            <>
              {isLoading && <PageLoader />}
              <section className='product'>
                <div className='container'>
                  <a className='section-back' onClick={() => router.back()} style={{ cursor: 'pointer' }}>
                    <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
                      <path
                        d='M12 1L5 8L12 15'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                    <span suppressHydrationWarning={true}>{t('personalCabinet')}</span>
                  </a>
                  <h1 className='section-title product__title'>{item && item?.items[0]?.title}</h1>
                  <div className='product-wrap'>
                    <div className='product-main'>
                      <div className='product-gallery'>
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
                            // zIndex={-1}
                            onSwiper={swiper => setSwiperRef(swiper)}
                            thumbs={{ swiper: thumbsSwiper }}
                            modules={[FreeMode, Navigation, Thumbs, Autoplay]}
                            style={{ height: '100%' }}
                          >
                            {get(item, 'items[0].images', []).map((_item, idx) => (
                              <SwiperSlide key={idx}>
                                <div className='product-gallery__main-img'>
                                  <AntImage
                                    src={_item}
                                    width={790}
                                    height={360}
                                    alt={item?.items[0]?.title}
                                    title={item?.items[0]?.title}
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
                          loop={get(item, 'items[0].images', []).length > 4}
                          speed={2000}
                          className='product-gallery__thumbs'
                          style={{ display: 'flex', justifyContent: 'center', zindex: 1 }}
                          modules={[Navigation, Thumbs, Autoplay]}
                        >
                          {get(item, 'items[0].images', []).map((_item, idx) => (
                            <SwiperSlide key={idx} style={{ width: '100%', maxWidth: '6rem' }}>
                              <div role='button' onClick={() => setActiveIndex(swiperRef?.realIndex)}>
                                <Image
                                  src={_item}
                                  width={790}
                                  height={360}
                                  alt={item?.items[0]?.title}
                                  title={item?.items[0]?.title}
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
                              <Image src={Img1} width={16} height={16} alt='ico' />
                              <span suppressHydrationWarning={true}>{t('status')}</span>
                            </div>
                            <div className='product-main__value'>
                              {item?.items[0]?.condition[0]?.label?.[`label_${i18n.language}`]}
                            </div>
                          </li>
                          <li className='product-main__item'>
                            <div className='product-main__wrap'>
                              <Image src={Img2} width={16} height={16} alt='ico' />
                              <span suppressHydrationWarning={true}>{t('year')}</span>
                            </div>
                            <div className='product-main__value'>{item?.items?.[0]?.year}</div>
                          </li>
                          <li className='product-main__item'>
                            <div className='product-main__wrap'>
                              <Image src={Img3} width={16} height={16} alt='ico' />
                              <span suppressHydrationWarning={true}>{t('mark')}</span>
                            </div>
                            <div className='product-main__value'>
                              {item?.items[0]?.marka?.[0]?.label[`label_${i18n.language}`]}
                            </div>
                          </li>
                          <li className='product-main__item'>
                            <div className='product-main__wrap'>
                              <Image src={Img4} width={16} height={16} alt='ico' />
                              <span suppressHydrationWarning={true}>{t('type')}</span>
                            </div>
                            <div className='product-main__value'>
                              {item?.items?.[0]?.type?.[0]?.label[`label_${i18n.language}`]}
                            </div>
                          </li>
                          {(get(item, 'items[0].price_type') || []).length > 0 && (
                            <li className='product-main__item'>
                              <div className='product-main__wrap'>
                                <Image src={Img2} width={16} height={16} alt='ico' />
                                <span suppressHydrationWarning={true}>{t('paymantType')}</span>
                              </div>
                              <div className='product-main__value'>
                                {(get(item, 'items[0].price_type') || [])
                                  .map((price, priceIdx) => price?.label?.[`label_${i18n.language}`])
                                  ?.join(', ')}
                              </div>
                            </li>
                          )}

                          <li className='product-main__item'>
                            <div className='product-main__wrap'>
                              <Image src={Img3} width={16} height={16} alt='ico' />
                              <span suppressHydrationWarning={true}>{t('color')}</span>
                            </div>
                            <div className='product-main__value'>
                              {item?.items?.[0]?.color?.[0]?.label?.[`label_${i18n.language}`]}
                            </div>
                          </li>
                          {get(item, 'items[0].address') && (
                            <li className='product-main__item'>
                              <div className='product-main__wrap'>
                                <Image src={Img3} width={16} height={16} alt='ico' />
                                <span suppressHydrationWarning={true}>{t('address')}</span>
                              </div>
                              <div className='product-main__value' style={{ textAlign: 'end' }}>
                                {get(item, 'items[0].address')}
                              </div>
                            </li>
                          )}
                          {!!item?.items?.[0]?.position?.length ? (
                            <li className='product-main__item'>
                              <div className='product-main__wrap'>
                                <Image src={'/2.svg'} width={16} height={16} alt='ico' />
                                <span suppressHydrationWarning={true}>{t('position')}</span>
                              </div>
                              <div className='product-main__value'>
                                {item?.items?.[0]?.position
                                  ?.map(el => el?.label?.[`label_${i18n.language}`])
                                  ?.join(', ')}
                              </div>
                            </li>
                          ) : (
                            <li></li>
                          )}
                          {!!item?.items[0]?.model?.length ? (
                            <li className='product-main__item'>
                              <div className='product-main__wrap'>
                                <Image src={'/2.svg'} width={16} height={16} alt='ico' />
                                <span suppressHydrationWarning={true}>{t('model')}</span>
                              </div>
                              <div className='product-main__value'>
                                {item?.items?.[0]?.model?.map(el => el?.label?.[`label_${i18n.language}`])?.join(', ')}
                              </div>
                            </li>
                          ) : (
                            <li></li>
                          )}
                          {!!item?.items?.[0]?.probeg ? (
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
                          {!!item?.items[0]?.power ? (
                            <li className='product-main__item'>
                              <div className='product-main__wrap'>
                                <Image src={'/2.svg'} width={16} height={16} alt='ico' />
                                <span suppressHydrationWarning={true}>{t('power')}</span>
                              </div>
                              <div className='product-main__value'>{item?.items?.[0]?.power}</div>
                            </li>
                          ) : (
                            <li></li>
                          )}
                          {!!item?.items[0]?.capacity ? (
                            <li className='product-main__item'>
                              <div className='product-main__wrap'>
                                <Image src={'/2.svg'} width={16} height={16} alt='ico' />
                                <span suppressHydrationWarning={true}>{t('capacity')}</span>
                              </div>
                              <div className='product-main__value'>{item?.items?.[0]?.capacity}</div>
                            </li>
                          ) : (
                            <li></li>
                          )}
                          {!!item?.items[0]?.tire_size ? (
                            <li className='product-main__item'>
                              <div className='product-main__wrap'>
                                <Image src={'/2.svg'} width={16} height={16} alt='ico' />
                                <span suppressHydrationWarning={true}>{t('tire_size')}</span>
                              </div>
                              <div className='product-main__value'>{item?.items?.[0]?.tire_size}</div>
                            </li>
                          ) : (
                            <li></li>
                          )}
                          {!!item?.items?.[0]?.gear?.length ? (
                            <li className='product-main__item'>
                              <div className='product-main__wrap'>
                                <Image src={'/2.svg'} width={16} height={16} alt='ico' />
                                <span suppressHydrationWarning={true}>{t('gear')}</span>
                              </div>
                              <div className='product-main__value'>
                                {item?.items?.[0]?.gear?.map(el => el?.label?.[`label_${i18n.language}`])?.join(', ')}
                              </div>
                            </li>
                          ) : (
                            <li></li>
                          )}
                          {!!item?.items?.[0]?.car_type?.length ? (
                            <li className='product-main__item'>
                              <div className='product-main__wrap'>
                                <Image src={'/2.svg'} width={16} height={16} alt='ico' />
                                <span suppressHydrationWarning={true}>{t('car_type    ')}</span>
                              </div>
                              <div className='product-main__value'>
                                {item?.items?.[0]?.car_type
                                  ?.map(el => el?.label?.[`label_${i18n.language}`])
                                  ?.join(', ')}
                              </div>
                            </li>
                          ) : (
                            <li></li>
                          )}
                          {!!item?.items?.[0]?.amenities?.length ? (
                            <li className='product-main__item'>
                              <div className='product-main__wrap'>
                                <Image src={'/2.svg'} width={16} height={16} alt='ico' />
                                <span suppressHydrationWarning={true}>{t('amenities')}</span>
                              </div>
                              <div className='product-main__value'>
                                {item?.items[0]?.amenities
                                  ?.map(el => el?.label?.[`label_${i18n.language}`])
                                  ?.join(', ')}
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
                          <div className='product-info__title'>{item?.items?.[0]?.title}</div>
                          <div className='product-info__subtitle' suppressHydrationWarning={true}>
                            {t('information')}
                          </div>
                          <div className='product-info__text'>{item?.items?.[0]?.description}</div>
                          <div className='product-info__price'>
                            {helpers.convertToReadable(item?.items[0]?.price)}{' '}
                            {item?.items?.[0]?.currency?.[0]?.label?.[`label_${i18n.language}`]}
                          </div>
                        </div>
                        <Link href={`${router?.asPath}/edit`} className='btn btn-blue' suppressHydrationWarning={true}>
                          {t('changeAd')}
                        </Link>
                        {status === 6 ? (
                          <>
                            <Delete
                              url={`/elon/delete/${router?.query?.profileSlug}/`}
                              className={'btn btn-red'}
                              type={'button'}
                              title={i18n.language === 'uz' ? 'E’lonni o’chirish' : 'Удалить объявление'}
                            />

                            <button
                              disabled={isLoading || adeArchiveLoading}
                              className='btn btn-blue'
                              style={{ marginTop: '1.2rem' }}
                              onClick={() =>
                                mutate({
                                  url: `/elon/edit/${router.query.profileSlug}/`,
                                  data: {
                                    title: item?.items[0]?.title,
                                    description: item?.items[0]?.description,
                                    created_at: new Date()
                                  }
                                })
                              }
                            >
                              {isLoading || adeArchiveLoading ? t('Loading') : t('activate')}
                            </button>
                          </>
                        ) : (
                          <DeActivate
                            url={`/elon/deactivate/${router?.query?.profileSlug}/`}
                            className={'btn btn-red'}
                            type={'button'}
                            title={i18n.language === 'uz' ? 'E’lonni faolsizlantirish' : 'Деактивировать объявление'}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )
        }}
      </ContainerOne>
      <div
        className='account-popup account-popup__delete'
        style={{ display: isModalOpen ? 'block' : 'none', zindex: 1000 }}
      >
        <div className='account-popup__content'>
          <div className='account-popup__img'>
            <Image src={check} width={100} height={100} alt='ico' />
          </div>
          <div className='account-popup__text' suppressHydrationWarning={true}>
            {t('deArchieSuccessTitle')}
          </div>
          <div
            className='account-popup__btns'
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <button
              onClick={succesModalHandler}
              className='account-popup__btn btn '
              style={{
                alignSelf: 'center'
              }}
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default withLayout(DashboardSingle)
