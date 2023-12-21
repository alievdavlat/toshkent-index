import React from 'react'
import Image from 'next/image'
import { ContainerAll } from '@/modules/container'
import PageLoader from '@/components/PageLoader'
import NoDataUI from '@/components/NoDataUI'
import { useRouter } from 'next/router'
import { get } from 'lodash'
import { withLayout } from '../../../layout/Layout'
import { useTranslation } from 'next-i18next'
import i18n from '@/services/i18n'
import Seo from '@/components/seo'

export const getServerSideProps = async () => {
  const title = {
    uz: 'Tashkent INDEX | AVTOMOBIL BRENDLARI',
    ru: 'Tashkent INDEX | АВТОМОБИЛЬНЫЕ БРЕНДЫ'
  }

  const desc = {
    uz: "Tashkent INDEX - turli brendlar mavjud bo'lgan yangi zamonaviy avtomobil bozori",
    ru: 'Tashkent INDEX - новый автомобильный рынок где присутствует разные бренды'
  }

  return {
    props: {
      title: title,
      desc: desc,
      url: '/brands/'
    }
  }
}

const Brands = ({ title, desc, url }) => {
  const router = useRouter()
  const { t } = useTranslation('translation')
  return (
    <>
      <Seo
        title={title?.[i18n.language || 'uz']}
        description={desc?.[i18n.language || 'uz']}
        image={'/in.jpg'}
        url={url}
      />
      <ContainerAll url={'/brend/list/'} name='/brend/list/'>
        {({ items, isLoading }) => {
          return (
            <>
              {items?.length <= 0 && !isLoading ? <NoDataUI /> : ''}
              {isLoading && <PageLoader />}
              {items?.length > 0 && (
                <section className='brands brands-page'>
                  <div className='container'>
                    <h2 className='brands__title section-title'>{t('Brands')}</h2>
                    <ul className='brands-list'>
                      {(items || []).map((item, idx) => (
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
                </section>
              )}
            </>
          )
        }}
      </ContainerAll>
    </>
  )
}

export default withLayout(Brands)
