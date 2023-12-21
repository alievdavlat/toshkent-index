import React from 'react'
import Image from 'next/image'
import { get } from 'lodash'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'next-i18next'

const MarkedListCard = ({ item, marketId }) => {
  const router = useRouter()
  const { t } = useTranslation('translate')

  return (
    <div
      className='product-item'
      onClick={() => router.push(`/product/?slg=${item?.slug}&id=${item?.id}&markedID=${marketId}`)}
      style={{ cursor: 'pointer' }}
    >
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
          <li>
            {t('price')} : <strong>{`${get(item, 'price')}`}</strong>{' '}
          </li>
          <li>
            {t('locationDate')} : {moment(get(item, 'year')).format('DD.MM.YYYY')}
          </li>
        </ul>
      </div>
    </div>
  )
}

export default MarkedListCard
