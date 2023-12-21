import React, { useState } from 'react'
import { get } from 'lodash'
import moment from 'moment'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import i18n from '@/services/i18n'
import { useRouter } from 'next/router'
import helpers from '@/services/helpers'
import { Autoplay } from 'swiper/modules'
import NoDataUI from '@/components/NoDataUI'
import { useTranslation } from 'next-i18next'
import AukWite from '@/img/icons/auk-white.svg'
import PageLoader from '@/components/PageLoader'
import { ContainerAll } from '@/modules/container'
import { Swiper, SwiperSlide } from 'swiper/react'
import ChevronUp from '@/img/icons/chevron-up.svg'
import { withLayout } from '../../../layout/Layout'
import AuctionCard from '@/components/Cards/AuctionCard'
import ArrowLeft from '@/../../img/icons/arrow-left.svg'
import CustomAccordion from '@/components/CustomAccordion'
import ArrowRight from '@/../../img/icons/arrow-right.svg'
import Seo from '@/components/seo'

const AuctionSingleModal = dynamic(() => import('@/components/Modals/AuctionSingleModal'), { ssr: false })

export const getServerSideProps = async () => {
  const title = {
    uz: 'Tashkent INDEX  | AUKSION',
    ru: 'Tashkent INDEX  | АУКЦИОН'
  }

  const desc = {
    uz: `Tashkent Index dan uzoq kutilgan auksion!`,
    ru: `Долгожданный аукцион от Tashkent Index!`
  }

  return {
    props: {
      title: title,
      desc: desc
    }
  }
}

const AuctionPage = ({ title, desc }) => {
  const [swiperRef, setSwiperRef] = useState(null)
  const [swiperSecondRef, setSecondSwiperRef] = useState(null)
  const [auctionSliderRef, setAuctionSliderRef] = useState(null)
  const lang = i18n.language
  const [auctionList, setAuctionList] = useState([])
  const [key, setKey] = useState([])
  const { t } = useTranslation('translation')

  const activeHnadler = tab => {
    setAuctionList(tab)
  }

  const prevHandler = () => {
    swiperRef.slidePrev()
    setKey(prev => prev + 1)
  }

  const nextHandler = () => {
    swiperRef.slideNext()
    setKey(prev => prev + 1)
  }

  return (
    <section className='auction'>
      <Seo
        title={title?.[i18n.language || 'uz']}
        description={desc?.[i18n.language || 'uz']}
        image={'/in.jpg'}
        url={'/'}
      />
      <div className='container'>
        <ContainerAll url={'/auction/active-auction/'} name='/auction/active-auction/'>
          {({ items, isLoading }) => {
            return (
              <>
                {items?.ads?.length === 0 && !isLoading ? <NoDataUI /> : ''}
                {isLoading && <PageLoader />}
                {items?.ads?.length > 0 && (
                  <div className='mb-2'>
                    <h1 className='section-title' suppressHydrationWarning={true}>
                      {t('activeAuctions')}
                    </h1>
                    <div className='section-head'>
                      <h2 className='section-title'></h2>
                      <div className='section-wrap'>
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
                      // key={key}
                      className='shop-carousel owl-carousel'
                      spaceBetween={30}
                      loop={true}
                      speed={2000}
                      slidesPerView={1}
                      onSwiper={swiper => setSwiperRef(swiper)}
                      modules={[Autoplay]}
                      autoplay={{
                        delay: 2500,
                        disableOnInteraction: false
                      }}
                      breakpoints={{
                        380: {
                          slidesPerView: 1,
                          spaceBetween: 20
                        },
                        640: {
                          slidesPerView: 1,
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
                      {(items?.ads || []).map((item, idx) => (
                        <SwiperSlide key={idx}>
                          <AuctionCard item={item} />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                )}
                <AuctionSingleModal />
              </>
            )
          }}
        </ContainerAll>

        <ContainerAll
          url={'/auction/noactivate-auction/'}
          name='/auction/noactivate-auction/'
          onSuccess={data => setAuctionList(get(data, 'data.items[0]'))}
        >
          {({ items, isLoading }) => {
            return (
              <>
                {/* {items?.items?.length <= 0 && !isLoading ? <NoDataUI /> : ""} */}
                {isLoading && <PageLoader />}
                {items?.items?.length > 0 && (
                  <>
                    <div className='section-head'>
                      <h1 className='section-title' suppressHydrationWarning={true}>
                        {t('Complited')}
                      </h1>
                      <div className='section-wrap'>
                        <div className='section-arrows'>
                          <span className='arrow-left' onClick={() => auctionSliderRef.slidePrev()}>
                            <Image src={ArrowLeft} width={40} height={40} alt='ico' />
                          </span>
                          <span className='arrow-right' onClick={() => auctionSliderRef.slideNext()}>
                            <Image src={ArrowRight} width={40} height={40} alt='ico' />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='auction-main'>
                      <Swiper
                        // className="auction-products"
                        spaceBetween={4}
                        loop={true}
                        speed={2000}
                        slidesPerView={2}
                        onSwiper={swiper => setAuctionSliderRef(swiper)}
                        // modules={[Autoplay]}
                        autoplay={{
                          delay: 2500,
                          disableOnInteraction: false
                        }}
                        breakpoints={{
                          640: {
                            slidesPerView: 2,
                            spaceBetween: 4
                          },
                          768: {
                            slidesPerView: 2,
                            spaceBetween: 4
                          },
                          992: {
                            slidesPerView: 4,
                            spaceBetween: 4
                          },
                          1024: {
                            slidesPerView: 4,
                            spaceBetween: 4
                          }
                        }}
                      >
                        <ul className='auction-list'>
                          {(items?.items || []).map((auction, idx) => (
                            <SwiperSlide key={idx}>
                              <li
                                className={
                                  auction.id === get(auctionList, 'id')
                                    ? 'auction-list__item active'
                                    : 'auction-list__item'
                                }
                                onClick={() => activeHnadler(auction)}
                              >
                                <div className='auction-list__wrap'>
                                  <Image src={AukWite} width={20} height={20} alt='ico' />
                                  <div className='auction-list__text'>
                                    <div>{get(auction, `title.title_${lang}`)}</div>
                                    <p>{get(auction, 'date')}</p>
                                  </div>
                                </div>
                                <div className='auction-list__arrow'>
                                  <Image src={ChevronUp} width={20} height={20} alt='ico' />
                                </div>
                              </li>
                            </SwiperSlide>
                          ))}
                        </ul>
                      </Swiper>
                      <div className='section-head' style={{ marginTop: '1rem' }}>
                        <h2 className='section-title'></h2>
                        <div className='section-wrap'>
                          <div className='section-arrows'>
                            <span className='arrow-left' onClick={() => swiperSecondRef.slidePrev()}>
                              <Image src={ArrowLeft} width={40} height={40} alt='ico' />
                            </span>
                            <span className='arrow-right' onClick={() => swiperSecondRef.slideNext()}>
                              <Image src={ArrowRight} width={40} height={40} alt='ico' />
                            </span>
                          </div>
                        </div>
                      </div>
                      <Swiper
                        className='auction-products'
                        spaceBetween={0}
                        loop={true}
                        speed={2000}
                        slidesPerView={1}
                        onSwiper={swiper => setSecondSwiperRef(swiper)}
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
                      >
                        {(auctionList?.ads || []).map((item, idx) => (
                          <SwiperSlide key={idx} className='product-item'>
                            <div className='product-item__img'>
                              <a href={null}>
                                <Image
                                  src={get(item, 'images[0]')}
                                  width={413}
                                  height={309}
                                  alt={get(item, 'title')}
                                  title={get(item, 'title')}
                                />
                              </a>
                            </div>
                            <div className='product-item__wrap'>
                              <div className='product-item__name'>
                                <a href={null}>{get(item, 'title')}</a>
                              </div>
                              <ul className='product-item__info'>
                                <li suppressHydrationWarning={true}>
                                  {t('initialPrice')} :{' '}
                                  <strong>$ {helpers.convertToReadable(get(item, 'price'))}</strong>{' '}
                                </li>
                                <li suppressHydrationWarning={true}>
                                  {t('sold_price')} :{' '}
                                  <strong>$ {helpers.convertToReadable(get(item, 'finish_price'))}</strong>{' '}
                                </li>
                                <li suppressHydrationWarning={true}>
                                  {t('locationDate')} : {moment(get(item, 'created_at')).format('DD.MM.YYYY')}
                                </li>
                                <li suppressHydrationWarning={true}>
                                  {t('lotNumber')}: {get(item, 'lot')}
                                </li>
                              </ul>
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                    {(auctionList?.image || []).length > 0 && (
                      <>
                        <h1 className='section-title' suppressHydrationWarning={true}>
                          {t('photoVideoReport')}
                        </h1>
                        <div className='auction-media'>
                          {(auctionList?.image || []).map((imgItem, idx) => {
                            return (
                              <div className='auction-media__item' key={idx}>
                                <Image src={imgItem} width={1000} height={1000} alt='img' />
                              </div>
                            )
                          })}
                          {(auctionList?.video || []).map((videoItem, idx) => {
                            return (
                              <div className='auction-media__item' key={idx}>
                                <video
                                  // poster={get(item, 'data.photo')}
                                  // ref={videoRef}
                                  width='100%'
                                  height='100%'
                                  loop
                                  loading='lazy'
                                  muted
                                  src={videoItem}
                                  controls={true}
                                ></video>
                              </div>
                            )
                          })}
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
            )
          }}
        </ContainerAll>

        <ContainerAll url={'/question/list/'} name={'/question/list/'}>
          {({ items, isLoading }) => {
            return (
              <>
                {isLoading && <PageLoader />}
                {items?.length > 0 && (
                  <div className='faq-main'>
                    <h2 className='faq__title section-title'>{t('faq')}</h2>
                    <CustomAccordion items={items} />
                  </div>
                )}
              </>
            )
          }}
        </ContainerAll>
      </div>
    </section>
  )
}

export default withLayout(AuctionPage)
