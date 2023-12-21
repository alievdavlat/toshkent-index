'use client'

import React, { useState } from 'react'
import { get } from 'lodash'
import Link from 'next/link'
import Image from 'next/image'
import i18n from '@/services/i18n'
import Img2 from '@/img/config/2.svg'
import { Image as AntImage } from 'antd'
import { useRouter } from 'next/router'
import helpers from '@/services/helpers'
import Gallery from '@/img/icons/image.svg'
import NodataUI from '@/components/NoDataUI'
import { useTranslation } from 'next-i18next'
import Delete from '@/modules/container/delete'
import { ContainerAll } from '@/modules/container'
import { Swiper, SwiperSlide } from 'swiper/react'
import ArrowLeft from '@/img/icons/arrow-left.svg'
import Header from '../../../../../../layout/Header'
import ArrowRight from '@/img/icons/arrow-right.svg'
import { FreeMode, Navigation, Thumbs, Autoplay } from 'swiper/modules'
import { requestAuth } from '@/services'
import check from '@/img/icons/done.svg'
import { useMutation } from '@tanstack/react-query'
import DeActivate from '@/modules/container/deactivate'
import ZoomImg from '@/components/avto/components/ZoomImg'

const DashboardSingle = () => {
  const router = useRouter()
  const { t } = useTranslation('translation')
  const [swiperRef, setSwiperRef] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
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
      <Header />
      {!!router?.query?.storySlug ? (
        <ContainerAll
          url={`/eav/category/steps/${router?.query?.storySlug}/`}
          name={`/eav/category/steps/${router?.query?.storySlug}/`}
          auth={true}
        >
          {({ items: steps }) => {
            return (
              <ContainerAll
                url={`/product/info/${router?.query?.productSlug}/`}
                name={`/product/info/${router?.query?.productSlug}`}
                auth={true}
              >
                {({ items, isLoading }) => {
                  const status = items?.status
                  return (
                    <section className='product'>
                      <div className='container'>
                        <a href='./' className='section-back'>
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
                          <span suppressHydrationWarning={true}>{t('personalCabinet')}</span>
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
                                  allowSlideNext={true}
                                  allowSlidePrev={true}
                                  rewind={true}
                                >
                                  {get(items, 'images', []).map((_item, idx) => (
                                    <SwiperSlide key={idx}>
                                      <div className='product-gallery__main-img'>
                                        <AntImage
                                          src={_item}
                                          width={100 + '%'}
                                          height={100 + '%'}
                                          alt={items?.title}
                                          rootClassName='ant-zoom-img'
                                          loading='lazy'
                                          title={items?.title}
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
                                      <span>{step?.properties?.title[`title_${i18n.language}`]}</span>
                                    </div>
                                    <div className='product-main__value'>
                                      {step?.properties?.values?.find(el => el?.value === items?.properties[step.slug])
                                        ?.label[`label_${i18n.language}`] || items?.properties[step.slug]}
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
                                  {t('information')}
                                </div>
                                <div className='product-info__text'>{items?.description}</div>
                                <div className='product-info__price' suppressHydrationWarning={true}>
                                  {helpers.convertToReadable(items?.price)} {t('sum')}
                                </div>
                              </div>
                              <Link
                                href={`${router.asPath}/edit`}
                                className='btn btn-blue'
                                suppressHydrationWarning={true}
                              >
                                {t('changeAd')}
                              </Link>
                              {items?.status === 6 ? (
                                <>
                                  <Delete
                                    url={`/product/delete/${router?.query?.productSlug}/`}
                                    className={'btn btn-red'}
                                    type={'button'}
                                    title={i18n.language == 'uz' ? 'E’lonni o’chirish' : 'Удалить объявление'}
                                  />

                                  <button
                                    disabled={isLoading || adeArchiveLoading}
                                    className='btn btn-blue'
                                    style={{ marginTop: '1.2rem' }}
                                    onClick={() =>
                                      mutate({
                                        url: `/product/edit/${router?.query?.productSlug}/`,
                                        data: {
                                          title: items?.title,
                                          description: items?.description,
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
                                  url={`/product/deactivate/${router?.query?.productSlug}/`}
                                  className={'btn btn-red'}
                                  type={'button'}
                                  title={
                                    i18n.language === 'uz' ? 'E’lonni faolsizlantirish' : 'Деактивировать объявление'
                                  }
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  )
                }}
              </ContainerAll>
            )
          }}
        </ContainerAll>
      ) : (
        <NodataUI />
      )}
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

export default DashboardSingle
