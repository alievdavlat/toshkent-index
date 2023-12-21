'use client'

import React from 'react'
import Eye from '../../../img/icons/eye.svg'
import Phone from '../../../img/icons/call.svg'
import Image from 'next/image'
import { get } from 'lodash'
import { useRouter } from 'next/router'
import helpers from '@/services/helpers'
import moment from 'moment'
import { useTranslation } from "next-i18next";
import i18n from '@/services/i18n'

const AdsCard = ({ item }) => {
  const router = useRouter();
  const {t} = useTranslation('translation');
  const lang = i18n.language;

  return (
    <div className='product-item' onClick={() => router.push(`${router.asPath}/ads/${item.slug}`)}>
      <div className='product-item__img'>
        <a href={null} style={{cursor: 'pointer'}}>
          <Image src={item.images[0] || '/no-image.png'} width={413} height={309} alt={get(item, 'title')} title={get(item, 'title')} />
        </a>
      </div>
      <div className={'product-item__status ' + helpers.createStatus(get(item, 'status'))?.class}>
        <Image src={helpers.createStatus(get(item, 'status'))?.icon} width={24} height={24} alt='ico' />
        <span>{helpers.createStatus(get(item, 'status'))?.text}</span>
      </div>
      <div className='product-item__wrap'>
        <div className='product-item__name'>
          <a href={null} style={{cursor: 'pointer'}}>{get(item, 'title')}</a>
        </div>
        <ul className='product-item__info'>
          <li>
            {t("price")} : <strong>{helpers.convertToReadable(get(item, 'price'))} {item?.currency?.[0]?.label?.[`label_${i18n.language}`] || t('sum')}</strong>{' '}
          </li>
          <li>{t("locationDate")} : {moment(new Date(item.created_at)).format('YYYY-MM-DD')} </li>
          <li>{t("mark")}: {get(item, `marka[0].label.label_${lang}`)}</li>
          <li className='product-item__counts'>
            <div className='product-item__count'>
              <Image src={Eye} width={24} height={24} alt='ico' />
              <span>{get(item, 'views_count')}</span>
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

export default AdsCard;
