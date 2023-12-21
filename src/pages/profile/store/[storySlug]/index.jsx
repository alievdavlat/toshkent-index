'use client'

import React, { useState } from 'react'
import ProductsList from './components/ProductsList'
import AddProduct from './components/AddProduct'
import AddCar from '../../cars/compponents/AddProduct'
import { useRouter } from 'next/router'
import { ContainerAll } from '@/modules/container'
import AddStore from '../components/AddStore'
import Header from '../../../../../layout/Header'
import { useSelector } from 'react-redux'
import {get} from 'lodash'
import i18n from '@/services/i18n'
import { useTranslation } from 'next-i18next'

function StorySlug() {
  const {storeDetail} = useSelector(state => state.system);
  const [activeTab, setActiveTab] = useState(1);
  const router = useRouter();
  const {t} = useTranslation('translation');

  const tabHandler = tab => {
    setActiveTab(tab)
  }

  return (
    <>
      <Header/>
      <section className='account account-ad'>
        <div className='container'>
          <a href='./' className='section-back'>
            <svg width={16} height={16} viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M12 1L5 8L12 15'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <span suppressHydrationWarning={true}>{t('personalCabinet')}</span>
          </a>
          <h1 className='accout__title section-title' suppressHydrationWarning={true}>{get(storeDetail, 'title')}</h1>
          <div className='account-choose edit-option'>
            <div className='login-choose'>
              <button className={`login-choose__btn ${activeTab === 1 ? 'current' : ''}`} onClick={() => tabHandler(1)}>
                {i18n.language == 'uz' ? 'Do’konlarim' : 'Мои магазины'}
              </button>
              <button className={`login-choose__btn ${activeTab === 2 ? 'current' : ''}`} onClick={() => tabHandler(2)}>
                {i18n.language == 'uz' ? 'E’lon qo’shish' : 'Добавить объявление'}
              </button>
              <button className={`login-choose__btn ${activeTab === 3 ? 'current' : ''}`} onClick={() => tabHandler(3)}>
                {i18n.language == 'uz' ? 'Do’konni o’zgartirish' : 'Изменить магазин'}
              </button>
            </div>
          </div>
          {activeTab === 1 && <ProductsList />}
          {/* {activeTab === 2 && (
            <AddProduct
              getUrl={`eav/category/steps/${router.query.storySlug}/`}
              postUrl={'/product/create/'}
              method={'post'}
            />
          )} */}
          {(activeTab === 3 || activeTab === 2) && (
            <ContainerAll
              url={`/market/info/${router.query.storySlug}/`}
              name={`/market/info/${router.query.storySlug}/`}
              auth={true}
            >
              {({ items, refetch }) => {
                return items ? (
                  activeTab === 3 ? (
                    <AddStore
                      getUrl={`/eav/category/list/`}
                      postUrl={`/market/edit/${router.query.storySlug}/`}
                      method={'PUT'}
                      data={items}
                      tabHandler={()=>{tabHandler(1); refetch()}}
                    />
                  ) : items?.category?.is_avto === true ? (
                    <AddCar getUrl={'/elon/properties/'} postUrl={'/elon/create/'} method={'post'} />
                  ) : (
                    <AddProduct
                      tabHandler={() => tabHandler(1)}
                      getUrl={`eav/category/steps/${router.query.storySlug}/`}
                      postUrl={'/product/create/'}
                      method={'post'}
                    />
                  )
                ) : (
                  <div />
                )
              }}
            </ContainerAll>
          )}
        </div>
      </section>
    </>
  )
}

export default StorySlug
