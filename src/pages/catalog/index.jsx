import Image from 'next/image'
import React, { useState, useEffect, useCallback } from 'react'
import PlusIcon from '@/img/icons/plus.svg'
import Link from 'next/link'
import { withLayout } from '../../../layout/Layout'
import NoDataUI from '@/components/NoDataUI'
import PageLoader from '@/components/PageLoader'
import { ContainerAll } from '@/modules/container'
import FilterCard from '@/components/Cards/FilterCard'
import FormikWithParams from '@/modules/UseFormik'
import i18n from '@/services/i18n'
import { Select, DatePicker, Slider, Pagination } from 'antd'
import { get } from 'lodash'
import moment from 'moment'
import FilterIcon from '@/img/icons/filter.svg'
import helpers from '@/services/helpers'
import { useRouter } from 'next/router'
import { usePathname, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import Seo from '@/components/seo'
import usePagination from '@/hooks/usePagination'

// const IsSSR = typeof window === 'undefined'

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

const TYPES = [
  {
    slug: '',
    uz: 'Saralash',
    ru: 'Сортировка'
  },
  {
    slug: 'new',
    uz: 'Yangi',
    ru: 'Новый'
  },
  {
    slug: 'old',
    ru: 'Старый',
    uz: 'Eski'
  },
  {
    slug: 'cheap',
    uz: 'Arzon',
    ru: 'Дешевый'
  },
  {
    slug: 'expensive',
    ru: 'Дорогой',
    uz: 'Qimmat'
  },
  {
    slug: 'popular',
    uz: 'Mashhur',
    ru: 'Популярный'
  }
]

const Catalog = ({ title, desc }) => {
  const { Option } = Select
  const [filterShow, setFilterShow] = useState(false)
  const { t } = useTranslation('translation')
  const router = useRouter()
  const [params, setParams] = useState({})
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isSSR, setIsSSR] = useState(true)
  const { page, perPage, setPage } = usePagination({ page: 1, perPage: 10 })

  useEffect(() => {
    setIsSSR(false)
  }, [])

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(object => {
    const params = new URLSearchParams()
    Object.keys(object).forEach(key => {
      if (!!object[key]) {
        params.set(key, object?.[key])
      }
    })

    return params.toString()
  }, [])
  const filterShowHandler = () => {
    setFilterShow(prev => !prev)
  }

  console.log(router.query, 'query')

  const redirectHandler = () => {
    if (Boolean(typeof window !== 'undefined' && window.document && window.document.createElement)) {
      const token = localStorage.getItem('access-token')
      if (token) {
        router.push('/profile/cars')
      } else {
        router.push('/profile/login')
      }
    }
  }

  useEffect(() => {
    if (router.query) {
      setParams(router.query)
    }
  }, [router.query])

  const clearForm = (data, cb) => {
    data?.map(item => {
      cb(item.key, '')
    })
    cb('year_%from', '')
    cb('price_%to', '')
  }

  return (
    <section className='catalog'>
      <Seo
        title={title?.[i18n.language || 'uz']}
        description={desc?.[i18n.language || 'uz']}
        image={'/in.jpg'}
        url={'/catalog'}
      />
      {!isSSR && (
        <div className='container'>
          <div className='section-head'>
            <h1 className='section-title' suppressHydrationWarning={true}>
              {t('autoshop')}
            </h1>
            <div className='section-wrap catalog-flex'>
              <button className='filter-open' onClick={filterShowHandler}>
                <Image src={FilterIcon} width={20} height={20} alt='ico' />
              </button>
              <Select
                placeholder={t('Sort')}
                optionLabelProp={`label`}
                //   name={type.key}
                menuplacement={'bottom'}
                value={params.sort}
                onChange={value => {
                  setParams(prev => {
                    return {
                      ...prev,
                      sort: value
                    }
                  })
                  router.push(pathname + '?' + createQueryString({ ...params, sort: value }))
                }}
              >
                {TYPES.map((option, idx) => (
                  <Option value={get(option, 'slug')} key={idx} label={get(option, `${i18n.language}`)}>
                    {get(option, `${i18n.language}`)}
                  </Option>
                ))}
              </Select>
              <a onClick={redirectHandler} className='section-btn catalog-add' style={{ cursor: 'pointer' }}>
                <Image src={PlusIcon} width={20} height={20} alt='ico' />
                <span suppressHydrationWarning={true}>{t('addAdv')}</span>
              </a>
            </div>
          </div>
          <div className='catalog-wrap'>
            <ContainerAll url={'/filter/ads-list/'} name='/filter/ads-list/'>
              {({ items, isLoading }) => {
                return (
                  <>
                    {items?.items?.length === 0 && !isLoading ? <NoDataUI /> : ''}
                    {/* {isLoading && <PageLoader />} */}
                    {items?.items?.length > 0 && (
                      <FormikWithParams
                        method='get'
                        //   url='/elon/list/'

                        //   onSuccess={data => setFiltered(data?.items)}
                        fields={[
                          ...items?.items?.map(field => {
                            return {
                              name: field.key,
                              required: false,
                              key: field.id,
                              value: searchParams.get(field.key) || '',
                              onSubmitValue: value => (value ? value : null)
                            }
                          }),
                          {
                            name: 'year_%from',
                            required: false,
                            value: searchParams.get('year_%from') || '',
                            onSubmitValue: value => (value ? value + '-01-01' : null)
                          },
                          {
                            name: 'year_%to',
                            required: false,
                            value: searchParams.get('year_%to') || '',
                            onSubmitValue: value => (value ? value + '-01-01' : null)
                          },
                          {
                            name: 'price_%from',
                            required: false,
                            value: searchParams.get('price_%from')
                              ? Number(searchParams.get('price_%from')) / 1000000
                              : 0,
                            onSubmitValue: value => (value > 0 ? value * 100000 : null)
                          },
                          {
                            name: 'price_%to',
                            required: false,
                            value: searchParams.get('price_%to')
                              ? Number(searchParams.get('price_%to')) / 1000000
                              : 1000,
                            onSubmitValue: value => (value > 0 ? value * 100000 : null)
                          }
                        ]}
                      >
                        {({ setFieldValue, values }) => {
                          console.log(values)
                          return (
                            <>
                              <div className={filterShow ? 'filter filter-show' : 'filter'}>
                                <div className='filter-head'>
                                  <div className='filter__title' suppressHydrationWarning={true}>
                                    {t('filter')}
                                  </div>
                                  <div className='filter__close' onClick={filterShowHandler}>
                                    <span></span>
                                  </div>
                                </div>
                                <div className='filter-item'>
                                  <div className='filter-year'>
                                    <div className='filter-year__input'>
                                      <DatePicker
                                        picker='year'
                                        name='year_%from'
                                        size='middle'
                                        placeholder={moment(Date.now()).format('YYYY')}
                                        onChange={(e, b) => setFieldValue('year_%from', moment(b).format('YYYY-MM-DD'))}
                                      />
                                    </div>

                                    <span> — </span>

                                    <div className='filter-year__input'>
                                      <DatePicker
                                        picker='year'
                                        name='year_%to'
                                        size='middle'
                                        placeholder={moment(Date.now()).format('YYYY')}
                                        onChange={(e, b) => setFieldValue('year_%to', moment(b).format('YYYY-MM-DD'))}
                                      />
                                    </div>
                                  </div>
                                </div>
                                {(items?.items || []).map((type, typeIdx) =>
                                  type?.input_type === 'select' ? (
                                    <div className='filter-item' key={typeIdx}>
                                      <div className='filter-item__title'>{get(type, `name.${i18n.language}`)}</div>
                                      <div className='filter-select'>
                                        <Select
                                          placeholder={type?.name?.[i18n.language]}
                                          optionLabelProp={`label`}
                                          name={type.key}
                                          menuplacement={'bottom'}
                                          value={values?.[type.key]}
                                          onChange={value => {
                                            setFieldValue(type.key, value)
                                          }}
                                        >
                                          <Option value={''} key={type?.name?.[i18n.language]} label={type?.name?.[i18n.language]}>
                                            {type?.name?.[i18n.language]}
                                          </Option>
                                          {(type?.values || []).map((option, idx) => (
                                            <Option
                                              value={get(option, 'slug')}
                                              key={idx}
                                              label={get(option, `label.label_${i18n.language}`)}
                                            >
                                              {get(option, `label.label_${i18n.language}`)}
                                            </Option>
                                          ))}
                                        </Select>
                                      </div>
                                    </div>
                                  ) : type?.input_type === 'checkbox' ? (
                                    <div className='filter-item'>
                                      <div className='filter-item__title'>{get(type, `name.${i18n.language}`)}</div>
                                      <div className='filter-type'>
                                        {(type?.values || []).map(checkItem => (
                                          <label htmlFor={checkItem?.key} key={checkItem?.key}>
                                            <input
                                              type='checkbox'
                                              name={type.key}
                                              id={checkItem?.slug}
                                              checked={checkItem?.slug === values?.[type.key]}
                                              onChange={e => {
                                                if (values?.[type.key] === e.target.id) {
                                                  setFieldValue(type.key, null)
                                                } else {
                                                  setFieldValue(type.key, e.target.id)
                                                }
                                              }}
                                            />
                                            <div>{get(checkItem, `label.label_${i18n.language}`)}</div>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  ) : type?.input_type === 'radio' ? (
                                    <div className='filter-item'>
                                      <div className='filter-item__title'>{get(type, `name.${i18n.language}`)}</div>
                                      <div className='filter-type'>
                                        {(type?.values || []).map(checkItem => (
                                          <label
                                            htmlFor={checkItem?.key}
                                            key={checkItem?.key}
                                            onClick={e => {
                                              console.log(values?.[type.key] === e.target.id)
                                              if (values?.[type.key] === e.target.id) {
                                                setFieldValue(type.key, '')
                                              } else {
                                                setFieldValue(type.key, e.target.id)
                                              }
                                            }}
                                          >
                                            <input
                                              type='radio'
                                              name={type.key}
                                              id={checkItem?.slug}
                                              checked={checkItem?.slug === values?.[type.key]}
                                              // onChange={e => {
                                              //   console.log(Number(values?.[type.key]) === Number(e.target.id))
                                              //   if (Number(values?.[type.key]) === Number(e.target.id)) {
                                              //     setFieldValue(type.key, '')
                                              //   } else {
                                              //     setFieldValue(type.key, e.target.id)
                                              //   }
                                              // }}
                                            />
                                            <div>{get(checkItem, `label.label_${i18n.language}`)}</div>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  ) : (
                                    ''
                                  )
                                )}
                                <div className='filter-item'>
                                  <div className='filter-price'>
                                    <div className='filter-item__title' suppressHydrationWarning={true}>
                                      {t('price')}
                                    </div>
                                    <div className='filter-price__range'>
                                      <div className='input-range__wrap'>
                                        <Slider
                                          range
                                          min={0}
                                          max={10000}
                                          defaultValue={[+values['price_%from'], +values['price_%to']]}
                                          name='price'
                                          onChange={value => {
                                            setFieldValue('price_%from', value?.[0])
                                            setFieldValue('price_%to', value?.[1])
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <div className='filter-price__inputs'>
                                      <input
                                        type='text'
                                        readOnly
                                        value={`${helpers.convertToReadable(values['price_%from'] * 1000000)} UZS`}
                                      />
                                      <span> — </span>
                                      <input
                                        type='text'
                                        readOnly
                                        value={`${helpers.convertToReadable(values['price_%to'] * 1000000)} UZS`}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className='filter-item'>
                                  <button
                                    type='reset'
                                    className='reset'
                                    onClick={() => {
                                      clearForm(items?.items, setFieldValue)
                                      setParams({})
                                      router.push(pathname + '?' + createQueryString({}))
                                    }}
                                  >
                                    {t('reset')}
                                  </button>
                                  <button
                                    className='btn'
                                    type='button'
                                    onClick={() => {
                                      setParams({
                                        ...values,
                                        ['price_%from']: values['price_%from'] * 1000000,
                                        ['price_%to']: values['price_%to'] * 1000000
                                      })
                                      router.push(
                                        pathname +
                                          '?' +
                                          createQueryString({
                                            ...params,
                                            ...values,
                                            ['price_%from']: values['price_%from'] * 1000000,
                                            ['price_%to']: values['price_%to'] * 1000000
                                          })
                                      )
                                    }}
                                    suppressHydrationWarning={true}
                                  >
                                    {t('show')}
                                  </button>
                                </div>
                              </div>

                              <ContainerAll
                                url={`/elon/list/`}
                                name='/elon/list/'
                                params={helpers.clearObject({ ...params, per_page: perPage, page: page })}
                              >
                                {({ items, isLoading }) => {
                                  return (
                                    <>
                                      {items?.items?.length === 0 && !isLoading ? <NoDataUI /> : ''}
                                      {/* {isLoading && <PageLoader />} */}
                                      {items?.items?.length > 0 && (
                                        <div className='catalog-main'>
                                          {(items?.items || []).map((item, idx) => (
                                            <FilterCard item={item} key={idx} />
                                          ))}

                                          <Pagination
                                            defaultCurrent={page}
                                            current={page}
                                            total={items?.meta?.count}
                                            onChange={value => setPage(value)}
                                          />
                                        </div>
                                      )}
                                    </>
                                  )
                                }}
                              </ContainerAll>
                            </>
                          )
                        }}
                      </FormikWithParams>
                    )}
                  </>
                )
              }}
            </ContainerAll>
          </div>
        </div>
      )}
    </section>
  )
}

export default withLayout(Catalog)
