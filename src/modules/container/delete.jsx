import React, { useState } from 'react'
import { requestAuth } from '@/services'
import { useMutation } from '@tanstack/react-query'
import Trash from '@/img/icons/trash.svg'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

function Delete({ url, className, title, type, onSuccess, onError, warningTitle='' }) {
  const router = useRouter();
  const {t} = useTranslation('translation');

  const [isModalOpen, setIsModalOpen] = useState(false)

  const deleteFunction = async url => {
    const response = await requestAuth({
      url: url,
      method: 'DELETE'
    })
    return response
  }
  const { mutate, isLoading } = useMutation(deleteFunction, {
    onSuccess: data => {
      setIsModalOpen(false)
      router.back()
    },
    onError: () => onError
  })
  return (
    <>
      <button disabled={isLoading} type={type} className={className} onClick={() => setIsModalOpen(true)}>
        {isLoading ? 'Loading' : title}
      </button>

      <>
        <div
          className='account-popup account-popup__delete'
          style={{ display: isModalOpen ? 'block' : 'none', zIndex: 9993 }}
        >
          <div className='account-popup__content'>
            <div className='account-popup__img'>
              <Image src={Trash} width={100} height={100} alt='ico' />
            </div>
            <div className='account-popup__text' suppressHydrationWarning={true}>{warningTitle ? t('Delete store title') : t('deleteWarning')}</div>
            <div className='account-popup__btns'>
              <button onClick={() => setIsModalOpen(false)} className='account-popup__btn btn btn-grey' suppressHydrationWarning={true}>
                {t('no')}
              </button>
              <button className='account-popup__btn btn' onClick={() => mutate(url)} suppressHydrationWarning={true}>
                {t('yes')}
              </button>
            </div>
          </div>
        </div>
      </>
    </>
  )
}

export default Delete;