import React, { useState } from 'react'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { logoutModalVisibleHandler } from '@/store/features/system'
import check from '@/img/icons/done.svg'
import { useTranslation } from 'next-i18next'
import i18n from '@/services/i18n'

const Logout = () => {
  const logoutModalVisible = useSelector(state => state.system.logoutModalVisible)
  const dispatch = useDispatch()
  const router = useRouter()
  const [status, setStatus] = useState(false)
  const { t } = useTranslation('translation')

  const logoutHandler = async () => {
    if (Boolean(typeof window !== 'undefined' && window.document && window.document.createElement)) {
      localStorage.removeItem('access-token')
      localStorage.removeItem('user')
      countDown()
    }
  }

  const countDown = () => {
    let secondsToGo = 1
    setStatus(true)

    const timer = setInterval(() => {
      secondsToGo -= 1
    }, 1000)

    setTimeout(() => {
      clearInterval(timer)
      router.push('/')
      setStatus(false)
      dispatch(logoutModalVisibleHandler(false))
    }, secondsToGo * 1000)
  }

  return (
    <div
      className='account-popup account-popup__delete'
      style={{ display: logoutModalVisible ? 'block' : 'none', zindex: 1000 }}
    >
      <div className='account-popup__content'>
        <div className='account-popup__img'>
          <Image src={'/logout2.svg'} width={100} height={100} alt='ico' />
        </div>
        <div className='account-popup__text'>{t('logoutConfirm')}</div>
        <div className='account-popup__btns'>
          <button
            onClick={() => dispatch(logoutModalVisibleHandler(false))}
            className='account-popup__btn btn btn-grey'
          >
            {i18n.language == 'uz' ? 'Yo’q' : 'Нет'}
          </button>
          <button className='account-popup__btn btn' onClick={logoutHandler}>
            {i18n.language == 'uz' ? 'Ha' : 'Да'}
          </button>
        </div>
      </div>
      {status && (
        <div className='account-popup__content'>
          <div className='account-popup__img'>
            <Image src={check} width={100} height={100} alt='ico' />
          </div>
          <div className='account-popup__text'>{t('logoutSuccess')}</div>
          {/* <span className='logout-progress'/> */}
        </div>
      )}
    </div>
  )
}

export default Logout
