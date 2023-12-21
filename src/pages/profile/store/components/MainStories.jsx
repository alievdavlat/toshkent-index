import { ContainerAll } from '@/modules/container'
import helpers from '@/services/helpers'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import NodataUI from '@/components/NoDataUI'
import { setStoreDetailHandler } from '@/store/features/system'
import { useDispatch } from 'react-redux'
import i18n from '@/services/i18n'
import Delete from '@/modules/container/delete'

function MainStories() {
  const dispatch = useDispatch();

  return (
    <ContainerAll url={'/market/user/list/'} name='market-user-list' auth={true}>
      {({ items }) => {

        return items?.length > 0 ? (
          <>
            <div className='account-shops' style={{ display: 'block' }}>
              <h2 className='account-main__title'>{i18n.language == 'uz' ? 'Do’konlarim' : 'Мои магазины'}</h2>
              <div className='account-shops__list'>
                {items?.map(item => (
                  <>
                    <div className='account-shops__item' key={item.slug}>
                      <div className='account-shops__img'>
                        <Link href={`/profile/store/${item.slug}`}>
                          <Image width={150} height={150} src={item.logo} alt='shop' />
                        </Link>
                      </div>
                      <div className='account-shops__wrap'>
                        <div className='account-shops__info' onClick={() => dispatch(setStoreDetailHandler(item))}>
                          <div className='account-shops__name'>
                            <Link href={`/profile/store/${item.slug}`}>{item.title}</Link>
                          </div>
                          <div className='account-shops__text'>{item.sub_title}</div>
                        </div>
                        <div className='store-actions-box'>
                          <Delete
                              url={`/market/delete/${item?.id}/`}
                              className={'store-delete-btn'}
                              type={'button'}
                              title={i18n.language === 'uz' ? "Do'konni o'chirish" : "Удалить магазин"}
                              warningTitle={'Store'}
                          />
                          <button className={'product-item__status ' + helpers.createStatus(item.status).class}>
                            <Image src={helpers.createStatus(item.status)?.icon} alt='ico' width={10} height={10} />
                            <span>{helpers.createStatus(item.status).text}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </>
        ) : (
          <NodataUI />
        )
      }}
    </ContainerAll>
  )
}

export default MainStories
