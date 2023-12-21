import AdsCard from '@/components/Cards/AdsCard'
import { ContainerAll } from '@/modules/container'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import ProductCard from './ProductCard'
import NodataUI from '@/components/NoDataUI'
import { useTranslation } from 'react-i18next'

function ProductsList() {
  const { t } = useTranslation('translation')
  const route = useRouter()
  const [activeTab, setActiveTab] = useState(1)

  const tabHandler = tab => {
    setActiveTab(tab)
  }

  return (
    <>
      {!!route?.query?.storySlug ? (
        <ContainerAll
          url={`/product/list/${route?.query?.storySlug}/`}
          name={`/product/list/${route?.query?.storySlug}/`}
          auth={true}
        >
          {({ items }) => {
            return (
              <>
                <div className='account-choose ad-option'>
                  <h2 className='account-main__title' suppressHydrationWarning={true}>
                    {t('myAnnouncements')}
                  </h2>
                  <div className='login-choose'>
                    <button
                      className={`login-choose__btn ${activeTab === 1 ? 'current' : ''}`}
                      onClick={() => tabHandler(1)}
                      suppressHydrationWarning={true}
                    >
                      {t('activeAds')}
                    </button>
                    <button
                      className={`login-choose__btn ${activeTab === 2 ? 'current' : ''}`}
                      onClick={() => tabHandler(2)}
                      suppressHydrationWarning={true}
                    >
                      {t('archive')}
                    </button>
                  </div>
                </div>
                {items?.products?.length === 0 && items?.ads?.length === 0 && <NodataUI />}
                {activeTab === 1 ? (
                  <div className='account-ad__products'>
                    {items?.products
                      ?.filter(el => el.status !== 6)
                      ?.map(item => (
                        <ProductCard item={item} key={item.id} />
                      ))}
                    {items?.ads
                      ?.filter(el => el.status !== 6)
                      ?.map(item => (
                        <AdsCard item={item} key={item.id} />
                      ))}
                  </div>
                ) : (
                  <div className='account-ad__products'>
                    {items?.products
                      ?.filter(el => el.status === 6)
                      ?.map(item => (
                        <ProductCard item={item} key={item.id} />
                      ))}
                    {items?.ads
                      ?.filter(el => el.status === 6)
                      ?.map(item => (
                        <AdsCard item={item} key={item.id} />
                      ))}
                  </div>
                )}
              </>
            )
          }}
        </ContainerAll>
      ) : (
        <NodataUI />
      )}
    </>
  )
}

export default ProductsList
