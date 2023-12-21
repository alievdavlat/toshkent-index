import React from 'react'
import Image from 'next/image'
import { get } from 'lodash'
import moment from 'moment'
import helpers from '@/services/helpers'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import i18n from '@/services/i18n'

const AutoShopCard = ({ item, type = '' }) => {
  const { t } = useTranslation('translation')
  const router = useRouter()
  const lang = i18n.language

  return (
    <div className='product-item' onClick={() => router.push(`/product/${item?.slug}`)} style={{ cursor: 'pointer' }}>
      <div className='product-item__img'>
        <a href={null}>
          <Image
            src={get(item, 'images[0]')}
            width={413}
            height={309}
            alt={get(item, 'title')}
            title={get(item, 'title')}
          />
        </a>
      </div>
      <div className='product-item__wrap'>
        <div className='product-item__name'>
          <a href={null}>{get(item, 'title')}</a>
        </div>
        <ul className='product-item__info'>
          <li suppressHydrationWarning={true}>
            {t('price')} :{' '}
            <strong>{`${helpers.convertToReadable(get(item, 'price'))} ${get(item, `currency[0].label.label_${lang}`) ||
              t('sum')} `}</strong>{' '}
          </li>
          <li suppressHydrationWarning={true}>
            {t('locationDate')} : {moment(get(item, 'year')).format('DD.MM.YYYY')}
          </li>
        </ul>
      </div>
    </div>
  )
}

export default AutoShopCard
