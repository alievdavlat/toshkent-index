import React, { useState } from 'react'
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
      url: `/news/html/uz/${slug}/`
    })
    return response?.data
  }
}

const getTitle = async slug => {
  if (slug) {
    const response = await request({
      method: 'GET',
      url: `/news/info/${slug}/`
    })
    return response?.data
  }
}

export const getServerSideProps = async ({ params }) => {
  const { newsSlug } = params
  const data = await getProduct(newsSlug)
  const title = await getTitle(newsSlug)

  const desc = data || ''
  return {
    props: {
      title: title?.title,
      desc: desc,
      url: '/news/' + newsSlug,
      image: title?.image?.[0]
    }
  }
}

const NewsSingle = ({ title, desc, url, image }) => {
  const searchParams = useSearchParams()
  const newsId = searchParams.get('id')
  const { t, i18n } = useTranslation('translation')
  const lang = i18n.language

  const router = useRouter()
  const { newsSlug } = router?.query
  const [newsInfo, setNewsInfo] = useState([])

  useGetOne({
    url: `/news/info/${newsSlug}/`,
    name: `/news/info/${newsSlug}/`,
    propId: newsSlug,
    onSuccess: data => {
      setNewsInfo(data)
    }
  })
  return (
    <section className='news-single'>
      <Seo
        title={`Tashkent INDEX | ${title?.[`title_${i18n.language || 'uz'}`]}`}
        description={desc}
        image={image}
        url={url}
      />
      <div className='container'>
        <h1 className='news-single__title news-single__title-desc section-title' suppressHydrationWarning={true}>
          {t('newsPromotionsAll')}
        </h1>
        <div className='news-single__content'>
          <ContainerAll
            url={'/news/list/'}
            name={'/news/list/'}
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
                        {t('newsPromotionsAll')}
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
                            onClick={() => router.push(`/news/${news?.id}`)}
                          >
                            <div className='news-single__img'>
                              <Image src={get(news, 'image[0]')} width={150} height={108} alt='news' />
                            </div>
                            <div className='news-single__info'>
                              <p>{get(news, `title.title_${lang}`)}</p>
                              <a
                                href={null}
                                onClick={() => router.push(`/news/${news?.id}`)}
                                suppressHydrationWarning={true}
                              >
                                {t('more')}
                              </a>
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
            url={`/news/html/${lang}/${newsSlug}/`}
            name={`/news/html/${lang}/${newsSlug}/`}
            propId={newsSlug}
          >
            {({ item, isLoading }) => {
              return (
                <>
                  {isLoading && <PageLoader />}
                  <div className='news-single__main'>
                    <h2 className='news-single__name' suppressHydrationWarning={true}>
                      {get(newsInfo, `title.title_${lang}`)}
                    </h2>
                    <div className='news-single__card'>
                      <div className='news-single__banner'>
                        <Image src={get(newsInfo, `image[0]`) || '/no-image.png'} width={500} height={500} />
                      </div>
                      <div className='news-single__wrap' dangerouslySetInnerHTML={{ __html: item }} />
                    </div>

                    <div className='news-single__container'>
                      {get(newsInfo, 'market') && (
                        <div
                          className='news-single__product'
                          onClick={() => router.push(`/shop/${newsInfo?.market?.slug}/?id=${newsInfo?.market?.id}`)}
                        >
                          <Image src={newsInfo?.market.logo || '/no-image.png'} width={500} height={500} />
                          <div className='news-single__box'>
                            <h3>{get(newsInfo, 'market.title')}</h3>
                            <p>{t('go over')}</p>
                          </div>
                        </div>
                      )}
                    </div>
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
