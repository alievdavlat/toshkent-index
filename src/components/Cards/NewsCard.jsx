import React from 'react'
import { get } from 'lodash'
import Image from 'next/image'
import i18n from '@/services/i18n'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

const NewsCard = ({ item }) => {
  const lang = i18n.language
  const router = useRouter()
  const { t } = useTranslation('translation')

  return (
    <div className='product-item product-item__news' style={{ cursor: 'pointer' }}>
      <div className='product-item__img'>
        <a href={null} onClick={() => router.push(`/news/${item?.id}`)}>
          <Image
            src={get(item, 'image[0]')}
            width={413}
            height={309}
            alt={get(item, `title.title_${lang}`)}
            title={get(item, `title.title_${lang}`)}
          />
        </a>
      </div>
      <div className='product-item__wrap'>
        <div className='product-item__name'>
          <a href={null} onClick={() => router.push(`/news/${item?.id}`)}>
            {get(item, `title.title_${lang}`)}
          </a>
        </div>
        <a href={null} onClick={() => router.push(`/news/${item?.id}`)} className='product-item__link'>
          {t('more')}
        </a>
      </div>
    </div>
  )
}

export default NewsCard
