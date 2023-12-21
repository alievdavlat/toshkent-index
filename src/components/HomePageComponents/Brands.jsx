import React from 'react'
import { get } from 'lodash'
import Link from 'next/link'
import Image from 'next/image'
import NoDataUI from '@/components/NoDataUI'
import PageLoader from '@/components/PageLoader'
import { ContainerAll } from '@/modules/container'
import { useTranslation } from 'next-i18next'
import i18n from '@/services/i18n'
import { useRouter } from 'next/router'

const Brands = () => {
  const { t } = useTranslation('translation')
  const router = useRouter()

  return (
    <section className='section brands'>
      <ContainerAll
        url={'/brend/list/'}
        name='/brend/list/'
        params={{
          limit: 12
        }}
      >
        {({ items, isLoading }) => {
          console.log(items, 'brands')
          return (
            <>
              {items?.length <= 0 && !isLoading ? <NoDataUI /> : ''}
              {isLoading && <PageLoader />}
              {items?.length > 0 && (
                <>
                  <div className='container section-container'>
                    <div className='section-head'>
                      <h2 className='section-title'>{t('Brands')}</h2>
                      <div className='section-wrap'>
                        <Link href='/brands' className='section-link'>
                          {t('all')}
                        </Link>
                      </div>
                    </div>
                    <ul className='brands-list'>
                      {(items.slice(0, 12) || []).map((item, idx) => (
                        <li
                          className='brands-list__item'
                          key={idx}
                          onClick={() => router.push(`/brands/${item?.slug}`)}
                        >
                          {get(item, 'image[0]') ? (
                            <Image
                              src={get(item, 'image[0]')}
                              width={126}
                              height={63}
                              alt={item.label[`label_${i18n.language}`]}
                            />
                          ) : (
                            item.label[`label_${i18n.language}`]
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </>
          )
        }}
      </ContainerAll>
    </section>
  )
}

export default Brands
