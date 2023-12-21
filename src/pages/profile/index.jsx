import React, { useState } from 'react'
import { withAdminLayout } from '@/adminLayout/AdminLayout'
import AdsCard from '@/components/Cards/AdsCard'
import { ContainerAll } from '@/modules/container'
import { useTranslation } from 'next-i18next'
import NodataUI from '@/components/NoDataUI'

const Dashboard = () => {
  const { t } = useTranslation('translation')
  const [activeTab, setActiveTab] = useState(1)

  const tabHandler = tab => {
    setActiveTab(tab)
  }

  return (
    <ContainerAll url={'/elon/user/list/'} name='ads-users-list' auth={true}>
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
            {activeTab === 1 ? (
              <div className='account-products'>
                {items?.items?.filter(el => el.status !== 6)?.length == 0 && <NodataUI />}
                {items?.items
                  ?.filter(el => el.status !== 6)
                  ?.map((item, idx) => (
                    <AdsCard key={idx} item={item} />
                  ))}
              </div>
            ) : (
              <div className='account-products'>
                {items?.items?.filter(el => el.status === 6)?.length == 0 && <NodataUI />}
                {items?.items
                  ?.filter(el => el.status === 6)
                  ?.map((item, idx) => (
                    <AdsCard key={idx} item={item} />
                  ))}
              </div>
            )}
          </>
        )
      }}
    </ContainerAll>
  )
}

export default withAdminLayout(Dashboard)
