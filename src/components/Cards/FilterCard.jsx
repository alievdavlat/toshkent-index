import React from 'react'
import Image from 'next/image'
import { get } from 'lodash'
import { useRouter } from 'next/router'
import Marker from '@/../../img/icons/marker.svg'
import helpers from '@/services/helpers'
import moment from 'moment'
import i18n from '@/services/i18n'
import { useTranslation } from 'next-i18next'

const FilterCard = ({ item }) => {
  const router = useRouter()
  const lang = i18n.language
  const { t } = useTranslation('translation')

  return (
    <div className='catalog-item' onClick={() => router.push(`/product/${item?.slug}`)}>
      <div className='catalog-item__img'>
        <a href={null} onClick={() => router.push(`/product/${item?.slug}`)} style={{ cursor: 'pointer' }}>
          <Image
            src={get(item, 'images[0]')}
            width={390}
            height={230}
            alt={get(item, 'title')}
            title={get(item, 'title')}
          />
        </a>
      </div>
      <div className='catalog-item__wrap'>
        <div className='catalog-item__name'>
          <a href={null} onClick={() => router.push(`/product/${item?.slug}`)} style={{ cursor: 'pointer' }}>
            {get(item, 'title')}
          </a>
        </div>
        <div className='catalog-item__price'>
          {helpers.convertToReadable(get(item, 'price'))} {get(item, `currency[0].label.label_${lang}`) || t('sum')}
        </div>
        <ul className='catalog-item__info'>
          {get(item, 'market[0].title') ? (
            <li suppressHydrationWarning={true}>
              {t('shop')}: {get(item, 'market[0].title')}
            </li>
          ) : (
            ''
          )}
          <li>
            <Image src={Marker} width={25} height={25} alt='ico' />
            <span suppressHydrationWarning={true}>
              {t('address')}: {get(item, `address`)}
            </span>
          </li>
          <li className='catalog-item__date'>{moment(get(item, 'created_at')).format('D MMMM, HH:MM')}</li>
        </ul>
      </div>
    </div>
  )
}

export default FilterCard
