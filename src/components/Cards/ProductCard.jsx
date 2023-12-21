import React from 'react'
import Image from 'next/image'
import { get } from 'lodash'
import { useRouter } from 'next/navigation'
import moment from 'moment'
import { useTranslation } from 'next-i18next'
import i18n from '@/services/i18n'

const ProductCard = ({ item, type = '', slug }) => {
  const router = useRouter()
  const { t } = useTranslation('translation')
  const lang = i18n.language

  return (
    <div
      className='product-item'
      onClick={() => router.push(`/product/${item?.slug}?slg=${slug?.category?.slug || ''}`)} //
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
          <a href={null} onClick={() => router.push(`/product/${item?.slug}?slg=${slug?.category?.slug || ''}`)}>
            {/* //?slg=${slug?.category?.slug} */}
            {get(item, 'title')}
          </a>
        </div>
        <ul className='product-item__info'>
          <li>
            {t('price')} :{' '}
            <strong>
              {`${get(item, 'price')}`} {get(item, `currency[0].label.label_${lang}`) || t('sum')}
            </strong>
          </li>
          <li>
            {t('locationDate')} : {moment(get(item, 'created_at')).format('DD.MM.YYYY')}
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ProductCard
