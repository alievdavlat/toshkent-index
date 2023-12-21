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
import NewsCard from "@/components/Cards/NewsCard";

export const getServerSideProps = async () => {
  const title = {
    uz: 'Tashkent INDEX | YANGILIKLAR',
    ru: 'Tashkent INDEX | НОВОСТИ'
  }

  const desc = {
    uz: "Tashkent INDEX - barcha yangiliklari",
    ru: 'Tashkent INDEX - все новости'
  }

  return {
    props: {
      title: title,
      desc: desc,
      url: '/news/'
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
            image={'/favicon.ico'}
            url={url}
        />
        <ContainerAll url={'/news/list/'} name='/news/list/'>
          {({ items, isLoading }) => {
            return (
                <>
                  {items?.length <= 0 && !isLoading ? <NoDataUI /> : ''}
                  {isLoading && <PageLoader />}
                  {items?.length > 0 && (
                      <section className='brands brands-page'>
                        <div className='container'>
                          <h2 className='brands__title section-title'>{t('newsPromotions')}</h2>
                          <ul className='brands-list news-list'>
                            {(items || []).map((item, idx) => (
                                <NewsCard item={item} key={idx}/>
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
