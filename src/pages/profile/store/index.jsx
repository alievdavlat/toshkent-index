import React, { useState } from 'react'
import AddStore from './components/AddStore'
// import MainStories from './components/MainStories'
import dynamic from 'next/dynamic'
import { withAdminLayout } from '@/adminLayout/AdminLayout'
import { useTranslation } from 'next-i18next'
import i18n from '@/services/i18n'

const MainStories = dynamic(() => import('./components/MainStories'), { ssr: false });

const Store = () => {
  const [activeTab, setActiveTab] = useState(1)
  const { t } = useTranslation('translation')

  const tabHandler = tab => {
    setActiveTab(tab)
  }

  return (
    <>
      <div className='account-choose'>
        <div className='login-choose'>
          <button className={`login-choose__btn ${activeTab === 1 ? 'current' : ''}`} onClick={() => tabHandler(1)}>
            {i18n.language == 'uz' ? 'Do’konlarim' : 'Мои магазины'}
          </button>
          <button className={`login-choose__btn ${activeTab === 2 ? 'current' : ''}`} onClick={() => tabHandler(2)}>
            {i18n.language == 'uz' ? 'Do’kon qo’shish' : 'Добавить магазин'}
          </button>
        </div>
      </div>
      {activeTab === 1 ? (
        <MainStories />
      ) : (
        <AddStore getUrl={'/eav/category/list/'} postUrl={'/market/create/'} method={'post'} tabHandler={()=>tabHandler(1)}/>
      )}
    </>
  )
}

export default withAdminLayout(Store);
