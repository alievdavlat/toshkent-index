import React, { useEffect, useState } from 'react'
import { get } from 'lodash'
import Image from 'next/image'
import i18n from '@/services/i18n'
import { useRouter } from 'next/router'
import NoDataUI from '@/components/NoDataUI'
import PageLoader from '@/components/PageLoader'
import { useSearchParams } from 'next/navigation'
import { ContainerAll } from '@/modules/container'
import { ContainerOne } from '@/modules/container'
import { useTranslation } from 'next-i18next'
import { useGetOne } from '@/hooks/crud'
import { withLayout } from '../../../../layout/Layout'
import { request } from '@/services'
import Seo from '@/components/seo'

const getProduct = async slug => {
  if (slug) {
    const response = await request({
      method: 'GET',
      url: `/brend/html/uz/${slug}/`
    })
    return response?.data
  }
}

export const getServerSideProps = async ({ params }) => {
  const { slug } = params
  const data = await getProduct(slug)
  const title = slug.toUpperCase() || ''

  const desc = data || ''
  return {
    props: {
      title: title,
      desc: desc,
      url: '/brands/' + slug
    }
  }
}

const NewsSingle = ({ title, desc, url }) => {
  console.log(title, desc, url)
  const searchParams = useSearchParams()
  const newsId = searchParams.get('id')
  const lang = i18n.language
  const { t } = useTranslation('translation')
  const router = useRouter()
  const { slug } = router.query
  const [newsInfo, setNewsInfo] = useState([])

  useGetOne({
    url: `/news/info/${newsId}/`,
    name: `/news/info/${newsId}/`,
    propId: newsId,
    onSuccess: data => {
      setNewsInfo(data)
    }
  })
  return (
    <section className='news-single'>
      <Seo title={`Tashkent INDEX | ${title}`} description={desc} image={'/favicon.ico'} url={url} />
      <div className='container'>
        <h1 className='news-single__title news-single__title-desc section-title' suppressHydrationWarning={true}>
          {t('Brands')}
        </h1>
        <div className='news-single__content brands-container'>
          <ContainerAll
            url={'/brend/list/'}
            name={'/brend/list/'}
            params={{
              limit: 4
            }}
          >
            {({ items, isLoading }) => {
              return (
                <>
                  {items?.length <= 0 && !isLoading ? <NoDataUI /> : ''}
                  {isLoading && <PageLoader />}
                  {items?.length > 0 && (
                    <div className='news-single__side'>
                      <h1
                        className='news-single__title news-single__title-mob section-title'
                        suppressHydrationWarning={true}
                      >
                        {t('Brands')}
                      </h1>
                      {/* <div className="shop-side__search">
                                                <Image src={IconSearch} width={20} height={20} alt="ico"/>
                                                <input type="text" placeholder="Qidirish"/>
                                            </div> */}
                      <div className='news-single__other'>
                        {(items || []).map((news, idx) => (
                          <div
                            className='news-single__item'
                            key={idx}
                            role='button'
                            style={{ cursor: 'pointer' }}
                            onClick={() => router.push(`/brands/${news?.slug}`)}
                          >
                            <div className='news-single__img' onClick={() => router.push(`/brands/${news?.slug}`)}>
                              <Image src={get(news, 'image[0]')} width={150} height={108} alt='news' />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )
            }}
          </ContainerAll>
          <ContainerOne
            url={`/brend/html/${lang}/${slug}/`}
            name={`/brend/html/${lang}/${slug}/`}
            propId={!!slug && !!lang}
          >
            {({ item, isLoading }) => {
              return (
                <>
                  {isLoading && <PageLoader />}
                  <div className='news-single__main'>
                    <h2 className='news-single__name' suppressHydrationWarning={true}>
                      {get(newsInfo, `title.title_${lang}`)}
                    </h2>
                    <div className='news-single__card' dangerouslySetInnerHTML={{ __html: item }} />
                  </div>
                </>
              )
            }}
          </ContainerOne>
        </div>
      </div>
    </section>
  )
}

export default withLayout(NewsSingle)
