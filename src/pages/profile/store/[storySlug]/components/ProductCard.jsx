import React from 'react'
import moment from 'moment'
import { get } from 'lodash'
import Image from 'next/image'
import Eye from '@/img/icons/eye.svg'
import { useRouter } from 'next/router'
import helpers from '@/services/helpers'
import Phone from '@/img/icons/call.svg'
import { useTranslation } from "next-i18next"

const ProductCard = ({ item, navigation }) => {
  const router = useRouter()
  const { t } = useTranslation('translation')

  return (
    <div className='product-item' onClick={() => router?.push(`${router?.asPath}/${item?.slug}`)}>
      <div className='product-item__img' style={{cursor: 'pointer'}}>
        <a href={null}>
          <Image src={item?.images?.[0]|| '/no-image.png'} width={413} height={309} alt={get(item, 'title')} title={get(item, 'title')} />
        </a>
      </div>
      <div className={'product-item__status ' + helpers.createStatus(get(item, 'status'))?.class}>
        <Image src={helpers.createStatus(get(item, 'status'))?.icon} width={24} height={24} alt='ico' />
        <span>{helpers.createStatus(get(item, 'status'))?.text}</span>
      </div>
      <div className='product-item__wrap'>
        <div className='product-item__name' style={{cursor: 'pointer'}}>
          <a href={null}>{get(item, 'title')}</a>
        </div>
        <ul className='product-item__info'>
          <li suppressHydrationWarning={true}>
            {t('price')} : <strong>{get(item, 'price')}</strong>{' '}
          </li>
          <li suppressHydrationWarning={true}>{t('locationDate')} : {moment(new Date(item?.created_at)).format('YYYY-MM-DD')} </li>
          <li className='product-item__counts'>
            <div className='product-item__count'>
              <Image src={Eye} width={24} height={24} alt='ico' />
              <span>{get(item, 'views_count')||0}</span>
            </div>
            <div className='product-item__count'>
              <Image src={Phone} width={24} height={24} alt='ico' />
              <span>{get(item, 'call_count')}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ProductCard
