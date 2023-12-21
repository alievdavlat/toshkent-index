import React, { useCallback, useEffect, useRef, useState } from 'react'
import { get } from 'lodash'
import Link from 'next/link'
import Image from 'next/image'
import i18n from '@/services/i18n'
import { useRouter } from 'next/router'
import { useGetAll } from '@/hooks/crud'
import NoDataUI from '@/components/NoDataUI'
import { useTranslation } from 'next-i18next'
import Plus from '@../../../img/icons/plus.svg'
import Close from '@/../../img/icons/close.svg'
import Filter from '@/../../img/icons/filter.svg'
import Search from '@/../../img/icons/search.svg'
import { ContainerAll } from '@/modules/container'
import { withLayout } from '@/../../layout/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { usePathname, useSearchParams } from 'next/navigation'
import { setCategoryActive, setSubCategoryActive } from '@/store/features/system'
import Seo from '@/components/seo'

export const getServerSideProps = async () => {
  const title = {
    uz: "Tashkent INDEX | DO'KONLAR",
    ru: 'Tashkent INDEX | МАГАЗИНЫ'
  }

  const desc = {
    uz: "Tashkent INDEX - BARCHA TURDAGI DO'KONLAR MAVJUD",
    ru: 'Tashkent INDEX - ДОСТУПНЫ ВСЕВОЗМОЖНЫЕ МАГАЗИНЫ'
  }

  return {
    props: {
      title: title,
      desc: desc,
      url: '/shop/'
    }
  }
}

const Shop = ({ title, desc, url }) => {
  const [filterVisible, setFilterVisible] = useState(false)
  const [query, setQuery] = useState('')
  const [subCategoryItem, setSubCategoryItem] = useState(null)

  const timeoutId = useRef()
  const lang = i18n.language
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const dispatch = useDispatch()
  const { categoryActive, subCategoryActive, categoryMode } = useSelector(state => state.system)
  const CategoryId = searchParams.get('id')
  const allCategory = searchParams.get('all')
  const { t } = useTranslation('translation')

  const { data, isLoading, refetch } = useGetAll({
    url: '/eav/category/list/',
    name: '/eav/category/list/' + query,
    params: {
        q: query
    },
    onSuccess: data => {
      const selected = (data?.data?.items || [])?.find(menu => menu?.id === Number(CategoryId))
      selected ? dispatch(setCategoryActive(selected?.id)) : dispatch(setCategoryActive(categoryActive))
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

  useEffect(() => {
    if (!CategoryId && categoryMode === 'all') {
      dispatch(setCategoryActive(null))
    }

    if (!allCategory && categoryMode === 'all') {
      dispatch(setSubCategoryActive({}))
    }
  }, [dispatch, CategoryId, categoryMode, allCategory])

  const redirictHandler = () => {
    if (Boolean(typeof window !== 'undefined' && window.document && window.document.createElement)) {
      const userData = JSON.parse(localStorage.getItem('user'))

      if (userData) {
        if (userData?.is_juridical) {
          router.push('/profile/store')
        } else {
          router.push('/profile/cars')
        }
      } else {
        router.push('/profile/login')
      }
    }
  }

  const filterVisibleHandler = () => {
    setFilterVisible(prev => !prev)
  }

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
      <Seo
        title={title?.[i18n.language || 'uz']}
        description={desc?.[i18n.language || 'uz']}
        image={'/favicon.ico'}
        url={url}
      />
      <div className='container'>
        <div className='shop-content'>
          <div className={`shop-side filter ${filterVisible ? 'filter-visible' : ''}`}>
            <div className='info-popup__close' onClick={filterVisibleHandler}>
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
              {data?.data?.items?.length <= 0 && !isLoading ? <NoDataUI /> : ''}
              {data?.data?.items?.length > 0 && (
                <ul className='shop-side__list'>
                  {(data?.data?.items || [])?.map((item, idx) => {
                    return (
                      <li
                        className={`shop-side__item ${get(item, 'id') === categoryActive || !!query ? 'active' : ''}`}
                        key={idx}
                        onClick={e => {
                          e.stopPropagation()
                          dispatch(setCategoryActive(item?.id))
                          router.push(pathname + '?' + createQueryString('id', item?.id))
                        }}
                      >
                        <div className='shop-side__head'>
                          <Image
                            src={get(item, 'icon') || '/2.svg'}
                            title={get(item, `title.title_${lang}`)}
                            width={20}
                            height={20}
                            alt={get(item, `title.title_${lang}`)}
                          />
                          <span>{get(item, `title.title_${lang}`)}</span>
                        </div>
                        {item?.children?.length > 0 && (
                          <ul className='shop-side__dropdown'>
                            {(item?.children || [])?.map((childItem, childIdx) => (
                              <li
                                key={childIdx}
                                onClick={e => {
                                  e.stopPropagation()
                                  dispatch(setSubCategoryActive(childItem))
                                  setSubCategoryItem(childItem?.id)
                                  router.push(pathname + '?' + createQueryString('id', childItem?.id))
                                  filterVisibleHandler()
                                }}
                              >
                                <a
                                  href={null}
                                  style={{ cursor: 'pointer' }}
                                  className={subCategoryItem == childItem?.id ? 'category-active' : 'no-active'}
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
          <div className='shop-main'>
            <div className='section-head'>
              <h1 className='section-title' suppressHydrationWarning={true}>
                {(data?.data?.items?.length > 0 &&
                  data?.data?.items?.find(item => item.id === Number(CategoryId))?.title?.[`title_${lang}`]) ||
                  (data?.data?.items?.length > 0 &&
                    subCategoryActive?.id === Number(CategoryId) &&
                    subCategoryActive?.title?.[`title_${lang}`]) ||
                  t('shops')}
              </h1>
              <div className='section-wrap'>
                <button className='filter-open' onClick={filterVisibleHandler}>
                  <Image src={Filter} width={20} height={20} alt='icon' />
                </button>
                <a onClick={redirictHandler} style={{ cursor: 'pointer' }} className='section-btn'>
                  <Image src={Plus} width={20} height={20} alt='icon' />
                  <span suppressHydrationWarning={true}>{t('addStore')}</span>
                </a>
              </div>
            </div>
            <ContainerAll
              url={'/market/list/'}
              name='/market/list/'
              params={{
                  category_id: CategoryId,
                  q: query
              }}
            >
              {({ items, isLoading }) => {
                const _filtered = CategoryId ? items : (items || [])?.filter(allItems => allItems?.status === 4)
                return (
                  <>
                    {items?.length <= 0 && !isLoading ? <NoDataUI /> : ''}
                    {items?.length > 0 && (
                      <ul className='shop-list'>
                        {(_filtered || [])?.map((category, categoryIdx) => (
                          <li className='shop-item' key={categoryIdx}>
                            <div
                              className='shop-item__img'
                              style={{ cursor: 'pointer' }}
                              onClick={() => router.push(`/shop/${category?.slug}?id=${category?.id}`)}
                            >
                              <a href={null}>
                                <Image
                                  src={get(category, 'logo') || '/no-image.png'}
                                  width={260}
                                  height={140}
                                  alt={get(category, 'store_name')}
                                  title={get(category, 'store_name')}
                                />
                              </a>
                            </div>
                            <div className='shop-item__wrap'>
                              <div className='shop-item__name' style={{ marginBottom: '0.5rem' }}>
                                <a
                                  href={null}
                                  style={{ cursor: 'pointer', marginBottom: '0.5rem' }}
                                  onClick={() => router.push(`/shop/${category?.slug}?id=${category?.id}`)}
                                >
                                  {get(category, 'store_name')}
                                </a>
                              </div>
                              <div className='shop-item__name'>
                                <a
                                  href={null}
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => router.push(`/shop/${category?.slug}?id=${category?.id}`)}
                                >
                                  {get(category, 'title')}
                                </a>
                              </div>
                              <div className='shop-item__text'>{get(category, 'sub_title')}</div>
                              <div className='shop-item__bot'>
                                {get(category, 'floor') && (
                                  <span suppressHydrationWarning={true}>
                                    {get(category, 'floor')} {t('floor')}
                                  </span>
                                )}
                                <Link href='/map' style={{ color: '#3893ff' }}>
                                  {t('showOnMap')}
                                </Link>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )
              }}
            </ContainerAll>
          </div>
        </div>
      </div>
    </section>
  )
}

export default withLayout(Shop)
