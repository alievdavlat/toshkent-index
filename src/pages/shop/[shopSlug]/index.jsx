import React, { useCallback, useEffect, useRef, useState } from 'react'
import { get } from 'lodash'
import Link from 'next/link'
import Image from 'next/image'
import i18n from '@/services/i18n'
import { useRouter } from 'next/router'
import NoDataUI from '@/components/NoDataUI'
import Close from '@/../../img/icons/close.svg'
import { useTranslation } from 'next-i18next'
import moment from 'moment'
import Search from '@/../../img/icons/search.svg'
import Filter from '@/../../img/icons/filter.svg'
import { ContainerOne } from '@/modules/container'
import { useGetAll, useGetOne } from '@/hooks/crud'
import { withLayout } from '../../../../layout/Layout'
import { useDispatch, useSelector } from 'react-redux'
import ProductCard from '@/components/Cards/ProductCard'
import { setCategoryActive, setSubCategoryActive } from '@/store/features/system'
import { useSearchParams } from 'next/navigation'
import AvtoProductCard from '@/components/Cards/AvtoProductCard'
import Compass from '@/components/shop/components/Compass'
import PhoneSvg from '@/components/shop/components/PhoneSvg'
import VkSvg from '@/components/shop/components/VkSvg'
import Telegram from '@/components/shop/components/Telegram'
import YouTube from '@/components/shop/components/YouTube'
import MapSvg from '@/components/shop/components/MapSvg'
import Facebook from '@/components/SvgFiles/Facebook'
import Instagram from '@/components/SvgFiles/Instagram'
import OkSvg from '@/components/SvgFiles/OkSvg'
import { request } from '@/services'
import Seo from '@/components/seo'

const getProduct = async slug => {
  const response = await request({
    method: 'GET',
    url: `/market/info/${slug}/`
  })
  return response?.data
}

export const getServerSideProps = async ({ params }) => {
  const { shopSlug } = params
  const data = await getProduct(shopSlug)
  const title = data?.title || ''

  const desc = data?.description || ''
  return {
    props: {
      title: title,
      desc: desc,
      url: '/product/' + shopSlug
    }
  }
}

const ShopSingle = ({ url, title, desc }) => {
  const lang = i18n.language
  const dispatch = useDispatch()
  const router = useRouter()
  const { categoryActive, subCategoryActive } = useSelector(state => state.system)
  const [productList, setProductList] = useState([])
  const { shopSlug, id } = router.query
  const { t } = useTranslation('translation')
  const [query, setQuery] = useState('')
  const timeoutId = useRef()
  const searchParams = useSearchParams()
  const [filterVisible, setFilterVisible] = useState(false)
  const currentDay = new Date().getDay()

  const weekdays = {
    0: { name: 'Ya', name_uz: 'Ya', name_ru: 'Вс' },
    1: { name: 'Du', name_uz: 'Du', name_ru: 'Пн' },
    2: { name: 'Se', name_uz: 'Se', name_ru: 'Вт' },
    3: { name: 'Ch', name_uz: 'Ch', name_ru: 'Ср' },
    4: { name: 'Pa', name_uz: 'Pa', name_ru: 'Чт' },
    5: { name: 'Ju', name_uz: 'Ju', name_ru: 'Пт' },
    6: { name: 'Sh', name_uz: 'Sh', name_ru: 'Сб' }
  }

  const { data, isLoading, refetch } = useGetAll({
    url: '/eav/category/list/',
    name: '/eav/category/list/' + query,
    params: {
      extra: {
        q: query
      }
    }
  })

  useGetOne({
    url: `/product/list/${shopSlug}/`,
    name: `/product/list/${shopSlug}/`,
    propId: id,
    onSuccess: data => {
      const filtered = [...data?.products, ...data?.ads].filter(item => item.status === 4)
      setProductList([...filtered])
    }
  })

  const handleSearch = useCallback(
    evt => {
      clearTimeout(timeoutId.current)
      setQuery(evt.target.value)

      timeoutId.current = setTimeout(() => {
        if (!!query) {
          refetch()
        }
      }, 300)
    },
    [setQuery, query, refetch]
  )
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )
  return (
    <section className='shop'>
      <Seo title={`Tashkent INDEX | ${title}`} description={desc} image={'/favicon.ico'} url={url} />
      <div className='container'>
        <div className='shop-content'>
          <div className={`shop-side filter ${filterVisible ? 'filter-visible' : ''}`}>
            <div className='info-popup__close' onClick={() => setFilterVisible(false)}>
              <Image src={Close} width={20} height={20} alt='icon' />
              <span suppressHydrationWarning={true}>{t('close')}</span>
            </div>
            <div className='shop-side__search'>
              <Image src={Search} width={20} height={20} alt='icon' />
              <input
                type='text'
                value={query}
                onChange={e => handleSearch(e)}
                placeholder={i18n.language === 'uz' ? 'Qidirmoq...' : 'Поиск...'}
              />
            </div>
            <>
              {data?.data?.items?.length === 0 && !isLoading ? <NoDataUI /> : ''}
              {/* {isLoading && !query && <PageLoader />} */}
              {data?.data?.items?.length > 0 && (
                <ul className='shop-side__list'>
                  {(data?.data?.items || []).map((item, idx) => {
                    return (
                      <li
                        className={`shop-side__item ${get(item, 'id') === categoryActive ? 'active' : ''}`}
                        key={idx}
                        onClick={e => {
                          e.stopPropagation()
                          dispatch(setCategoryActive(item?.id))
                          router.push('/shop' + '?' + createQueryString('id', item?.id))
                        }}
                      >
                        <div className='shop-side__head'>
                          <Image
                            src={get(item, 'icon')}
                            width={20}
                            height={20}
                            alt={get(item, `title.title_${lang}`)}
                            title={get(item, `title.title_${lang}`)}
                          />
                          <span>{get(item, `title.title_${lang}`)}</span>
                        </div>
                        {item?.children?.length > 0 && (
                          <ul className='shop-side__dropdown'>
                            {(item.children || []).map((childItem, childIdx) => (
                              <li
                                key={childIdx}
                                onClick={e => {
                                  e.stopPropagation()
                                  dispatch(setSubCategoryActive(childItem))
                                  router.push('/shop' + '?' + createQueryString('id', childItem?.id))
                                }}
                              >
                                <a
                                  href={null}
                                  style={{ cursor: 'pointer' }}
                                  className={childItem.id === get(subCategoryActive, 'id') ? 'category-active' : ''}
                                >
                                  {get(childItem, `title.title_${lang}`)}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
            </>
          </div>
          <ContainerOne url={`/market/info/${shopSlug}/`} name={`/market/info/${shopSlug}/`} propId={shopSlug}>
            {({ item, isLoading }) => {
              return (
                <>
                  {!item ? (
                    <></>
                  ) : (
                    <div className='shop-main'>
                      <div className='shop-single'>
                        <div className='shop-single__head'>
                          <div className='shop-single__banner'>
                            {get(item, 'network') && (
                              <button className='compass-btn' suppressHydrationWarning={true}>
                                <a
                                  href={get(item, 'network')}
                                  target='_blank'
                                  rel='nofollow'
                                  style={{ display: 'flex', alignItems: 'center', gap: '.2rem', color: '#fff' }}
                                >
                                  <Compass />
                                  {t('website')}
                                </a>
                              </button>
                            )}
                            {get(item, 'background_image') ? (
                              <Image
                                src={get(item, 'background_image')}
                                width={850}
                                height={350}
                                alt={get(item, 'store_name')}
                                title={get(item, 'store_name')}
                              />
                            ) : (
                              <Image
                                src={'/no-image.png'}
                                width={850}
                                height={350}
                                alt={get(item, 'store_name')}
                                title={get(item, 'store_name')}
                                style={{ objectFit: 'none' }}
                              />
                            )}
                          </div>
                          <div className='shop-single__logo'>
                            <Image
                              src={get(item, 'logo') || '/no-image.png'}
                              width={210}
                              height={130}
                              title={get(item, 'store_name')}
                              alt={get(item, 'store_name')}
                            />
                          </div>
                        </div>
                        <div className='shop-single__wrap'>
                          <button className='filter-open' onClick={() => setFilterVisible(true)}>
                            <Image
                              src={Filter}
                              width={38}
                              height={38}
                              alt={get(item, 'store_name')}
                              title={get(item, 'store_name')}
                            />
                          </button>
                          <div className='shop-single__content'>
                            <h1 className='section-title'>{get(item, 'store_name')}</h1>
                            <h2 className='shop-single__desc'>
                              {i18n.language === 'uz' ? get(item, 'sub_title') : get(item, 'sub_title_ru')}
                            </h2>
                            <div className='shop-single__text'>
                              <div className='shop-single__text__inner'>
                                {i18n.language === 'uz' ? get(item, 'description') : get(item, 'description_ru')}
                              </div>
                            </div>
                          </div>
                          <div className='shop-time'>
                            <div className='shop-time__wrap'>
                              <div className='shop-time__ico'>
                                <Image src={'/clock.svg'} width={38} height={38} alt='ico' />
                              </div>
                              <ul className='shop-time__list'>
                                {(get(item, 'schudale.items') || []).map((day, dayIdx) => {
                                  const _res = weekdays[currentDay]['name'] === get(day, 'title')
                                  return (
                                    <li
                                      key={dayIdx}
                                      className={
                                        weekdays[currentDay][`name_${i18n.language}`] ===
                                          get(day, `title_${i18n.language}`) || !!_res
                                          ? 'current-day'
                                          : ''
                                      }
                                      style={
                                        get(day, 'time.open') === '00:00' && get(day, 'time.close') === '00:00'
                                          ? { background: '#FF3529' }
                                          : {}
                                      }
                                    >
                                      <p
                                        className={
                                          get(day, 'time.open') === '00:00' && get(day, 'time.close') === '00:00'
                                            ? 'day-off'
                                            : 'workday'
                                        }
                                      >
                                        {get(day, 'title') || get(day, `title_${i18n.language}`)}
                                      </p>
                                      <p
                                        className={
                                          get(day, 'time.open') === '00:00' && get(day, 'time.close') === '00:00'
                                            ? 'day-off'
                                            : 'workday'
                                        }
                                      >
                                        {get(day, 'time.open')}
                                      </p>
                                      <p
                                        className={
                                          get(day, 'time.open') === '00:00' && get(day, 'time.close') === '00:00'
                                            ? 'day-off'
                                            : 'workday'
                                        }
                                      >
                                        {get(day, 'time.close')}
                                      </p>
                                    </li>
                                  )
                                })}
                              </ul>
                            </div>
                            <div className='shop-time__bot'>
                              <div className='shop-time__name' suppressHydrationWarning={true}>
                                {get(item, 'floor') && (
                                  <>
                                    <span className='department-floor'>
                                      <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='24'
                                        height='24'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                      >
                                        <path
                                          fill='currentColor'
                                          fillRule='evenodd'
                                          d='M10.61 3.378a2.658 2.658 0 0 1 2.392-.024l7.04 3.43c.79.385.774 1.608-.026 1.968l-7.09 3.193a2.655 2.655 0 0 1-2.24-.021l-6.718-3.18c-.778-.368-.794-1.559-.027-1.952l6.669-3.414Zm1.753 1.52a1.208 1.208 0 0 0-1.088.011l-5.528 2.83 5.562 2.633c.324.153.692.157 1.018.01l5.867-2.643-5.831-2.841Z'
                                          clipRule='evenodd'
                                        ></path>
                                        <path
                                          fill='currentColor'
                                          fillRule='evenodd'
                                          d='m20.46 12.916-7.534 3.394a2.655 2.655 0 0 1-2.24-.022L3.547 12.91v-1.852l7.761 3.678c.324.154.692.157 1.018.01l8.133-3.637v1.807Z'
                                          clipRule='evenodd'
                                        ></path>
                                        <path
                                          fill='currentColor'
                                          fillRule='evenodd'
                                          d='m20.46 17.288-7.534 3.394a2.655 2.655 0 0 1-2.24-.022l-7.138-3.378v-1.86l7.761 3.686c.324.154.692.157 1.018.01l8.133-3.655v1.825Z'
                                          clipRule='evenodd'
                                        ></path>
                                      </svg>
                                    </span>
                                    {get(item, 'floor')} {t('floor')}
                                  </>
                                )}
                              </div>
                              <div className='shop-time__name' suppressHydrationWarning={true}>
                                <span className='department-floor'>
                                  <svg
                                    width='24'
                                    height='24'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                  >
                                    <path
                                      d='M14.5 21V16C14.5 15.4477 14.0523 15 13.5 15H10.5C9.94772 15 9.5 15.4477 9.5 16V21'
                                      stroke='#33363F'
                                      strokeWidth='2'
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                    />
                                    <path
                                      d='M5 11V17C5 18.8856 5 19.8284 5.58579 20.4142C6.17157 21 7.11438 21 9 21H15C16.8856 21 17.8284 21 18.4142 20.4142C19 19.8284 19 18.8856 19 17V11'
                                      stroke='#33363F'
                                      strokeWidth='2'
                                    />
                                    <path
                                      d='M4.62127 4.51493C4.80316 3.78737 4.8941 3.42359 5.16536 3.21179C5.43663 3 5.8116 3 6.56155 3H17.4384C18.1884 3 18.5634 3 18.8346 3.21179C19.1059 3.42359 19.1968 3.78737 19.3787 4.51493L20.5823 9.32938C20.6792 9.71675 20.7276 9.91044 20.7169 10.0678C20.6892 10.4757 20.416 10.8257 20.0269 10.9515C19.8769 11 19.6726 11 19.2641 11V11C18.7309 11 18.4644 11 18.2405 10.9478C17.6133 10.8017 17.0948 10.3625 16.8475 9.76781C16.7593 9.55555 16.7164 9.29856 16.6308 8.78457V8.78457C16.6068 8.64076 16.5948 8.56886 16.5812 8.54994C16.5413 8.49439 16.4587 8.49439 16.4188 8.54994C16.4052 8.56886 16.3932 8.64076 16.3692 8.78457L16.2877 9.27381C16.2791 9.32568 16.2747 9.35161 16.2704 9.37433C16.0939 10.3005 15.2946 10.9777 14.352 10.9995C14.3289 11 14.3026 11 14.25 11V11C14.1974 11 14.1711 11 14.148 10.9995C13.2054 10.9777 12.4061 10.3005 12.2296 9.37433C12.2253 9.35161 12.2209 9.32568 12.2123 9.27381L12.1308 8.78457C12.1068 8.64076 12.0948 8.56886 12.0812 8.54994C12.0413 8.49439 11.9587 8.49439 11.9188 8.54994C11.9052 8.56886 11.8932 8.64076 11.8692 8.78457L11.7877 9.27381C11.7791 9.32568 11.7747 9.35161 11.7704 9.37433C11.5939 10.3005 10.7946 10.9777 9.85199 10.9995C9.82887 11 9.80258 11 9.75 11V11C9.69742 11 9.67113 11 9.64801 10.9995C8.70541 10.9777 7.90606 10.3005 7.7296 9.37433C7.72527 9.35161 7.72095 9.32568 7.7123 9.27381L7.63076 8.78457C7.60679 8.64076 7.59481 8.56886 7.58122 8.54994C7.54132 8.49439 7.45868 8.49439 7.41878 8.54994C7.40519 8.56886 7.39321 8.64076 7.36924 8.78457V8.78457C7.28357 9.29856 7.24074 9.55555 7.15249 9.76781C6.90524 10.3625 6.38675 10.8017 5.75951 10.9478C5.53563 11 5.26905 11 4.73591 11V11C4.32737 11 4.12309 11 3.97306 10.9515C3.58403 10.8257 3.31078 10.4757 3.28307 10.0678C3.27239 9.91044 3.32081 9.71675 3.41765 9.32938L4.62127 4.51493Z'
                                      stroke='#33363F'
                                      strokeWidth='2'
                                    />
                                  </svg>
                                </span>
                                {get(item, 'title')}
                              </div>
                              {get(item, 'block') && (
                                <div className='shop-time__block'>
                                  <svg
                                    width='24'
                                    height='24'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                  >
                                    <path
                                      d='M3 7L10 3L21 7M3 7V12L14 16L21 12V7M3 7L14 11L21 7'
                                      stroke='#33363F'
                                      strokeWidth='2'
                                      strokeLinejoin='round'
                                    />
                                    <path
                                      d='M3 12V17L14 21L21 17V12'
                                      stroke='#33363F'
                                      strokeWidth='2'
                                      strokeLinejoin='round'
                                    />
                                  </svg>
                                  <span>{get(item, 'block')}</span>
                                </div>
                              )}
                              {/* /.shop-time__block */}
                              <div className='shop-time__btn'>
                                <Link href='/map'>
                                  <MapSvg />
                                  <span>{t('seeOnTheMap')}</span>
                                </Link>
                              </div>
                            </div>
                            {get(item, 'news').length > 0 && (
                              <div className='shop-single-news'>
                                <p className='single-news-title' suppressHydrationWarning={true}>
                                  {t('whatsNew')}
                                </p>
                                <div className='single-news__wrap'>
                                  {(get(item, 'news') || []).map((item, idx) => (
                                    <div
                                      className='single-news-item'
                                      key={idx}
                                      onClick={() => router.push(`/news/${item?.id}`)}
                                    >
                                      <h3>{get(item, `title.title_${i18n.language}`)}</h3>
                                      <p>{moment(get(item, 'created_at')).format('DD.MM.YYYY')}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className='social-link-wrap'>
                          {get(item, 'phone_number') && (
                            <a href={`tel: ${get(item, 'phone_number')}`}>
                              <div className='phone-icon'>
                                <PhoneSvg />
                              </div>
                              {get(item, 'phone_number')}
                            </a>
                          )}
                          <ul className='social-link-contacts'>
                            {get(item, 'social_network.vk') && (
                              <li className='social-link-item'>
                                <a href={get(item, 'social_network.vk')} target='_blank' rel='nofollow'>
                                  <VkSvg />
                                </a>
                              </li>
                            )}
                            {get(item, 'social_network.telegram') && (
                              <li className='social-link-item'>
                                <a href={get(item, 'social_network.telegram')} target='_blank' rel='nofollow'>
                                  <Telegram />
                                </a>
                              </li>
                            )}
                            {get(item, 'social_network.youtube') && (
                              <li className='social-link-item'>
                                <a href={get(item, 'social_network.youtube')} target='_blank' rel='nofollow'>
                                  <YouTube />
                                </a>
                              </li>
                            )}
                            {get(item, 'social_network.facebook') && (
                              <li className='social-link-item'>
                                <a href={get(item, 'social_network.facebook')} target='_blank' rel='nofollow'>
                                  <Facebook />
                                </a>
                              </li>
                            )}
                            {get(item, 'social_network.instagram') && (
                              <li className='social-link-item'>
                                <a href={get(item, 'social_network.instagram')} target='_blank' rel='nofollow'>
                                  <Instagram />
                                </a>
                              </li>
                            )}
                            {get(item, 'social_network.ok') && (
                              <li className='social-link-item'>
                                <a href={get(item, 'social_network.ok')} target='_blank' rel='nofollow'>
                                  <OkSvg />
                                </a>
                              </li>
                            )}
                          </ul>
                        </div>
                        {productList.length > 0 && (
                          <div className='shop-single__more'>
                            <h2 className='section-title'>{t('products')}</h2>
                            <div className='shop-single__list'>
                              {item?.category?.is_avto
                                ? (productList || []).map((product, productIdx) => (
                                    <ProductCard item={product} key={productIdx} type='product' slug={null} />
                                  ))
                                : (productList || []).map((product, productIdx) => (
                                    <AvtoProductCard item={product} key={productIdx} type='product' slug={item} />
                                  ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )
            }}
          </ContainerOne>
        </div>
      </div>
    </section>
  )
}

export default withLayout(ShopSingle)
