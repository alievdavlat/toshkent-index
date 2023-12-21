'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Language from './language'
import Menu from './components/Menu'
import { useTranslation } from "next-i18next";
import { useDispatch } from 'react-redux'
import { homeSearchVisibleHandler } from '@/store/features/system'
import Search from './components/Search'
import { useSelector } from 'react-redux'
import {usePathname} from "next/navigation";

const Header = ({ extraClass, searchShowHandler }) => {
  const pathname = usePathname()
  const [token, setToken] = useState('')
  const [active, setActive] = useState(false)
  const { t } = useTranslation('translation')
  const dispatch = useDispatch()
  const { homeSearchVisible } = useSelector(state => state.system)

  const menuActiveHandler = () => {
    setActive(prev => !prev)
  }

  useEffect(() => {
    setToken(localStorage.getItem('access-token'))
  }, [token])

  return (
    <>
      {/* <div className='test-mode'>
        <marquee direction='right' loop=''>
          Cайт работает в тестовом режиме
        </marquee>
      </div> */}
      <Menu active={active} menuActiveHandler={menuActiveHandler} extraClass={pathname !== '/' ? '' : 'menu-fixed'}/>
      <header className={extraClass ? `header ${extraClass}` : 'header'}>
        <div className='container'>
          <div className='header-left'>
            <div className={active ? 'header__menu active' : 'header__menu'} onClick={menuActiveHandler}>
              <span></span>
              <span></span>
            </div>
            {/*<div className='header__soon' suppressHydrationWarning={true}>{t('soon')}</div>*/}
            <div className='header-btns'>
              <Link href='/catalog' className='btn btn-trans'>
                <Image src='/auto.svg' width={20} height={20} alt='ico' />
                <span suppressHydrationWarning={true}>{t('autoshop')}</span>
              </Link>
              <Link href='/auction' className='btn btn-trans'>
                <Image src='/auk.svg' width={20} height={20} alt='ico' />
                <span suppressHydrationWarning={true}>{t('auksion')}</span>
              </Link>
            </div>
          </div>

          <Link href='/' className='header__logo'>
            <Image src='/logo.svg' width={20} height={20} alt='Tashkent Index' />
          </Link>
          
          <div className='header-right'>
            <div className='header-icons'>
              <Link href={token ? `/profile` : '/profile/login'}>
                <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M14.4749 4.52513C15.8417 5.89197 15.8417 8.10804 14.4749 9.47488C13.108 10.8417 10.892 10.8417 9.52513 9.47488C8.15829 8.10804 8.15829 5.89197 9.52513 4.52513C10.892 3.15829 13.108 3.15829 14.4749 4.52513'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M4 18.4998V19.4998C4 20.0518 4.448 20.4998 5 20.4998H19C19.552 20.4998 20 20.0518 20 19.4998V18.4998C20 15.4738 16.048 13.5078 12 13.5078C7.952 13.5078 4 15.4738 4 18.4998Z'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </Link>
              <a
                href={null}
                style={{ cursor: 'pointer' }}
                onClick={e => {
                  e.stopPropagation()
                  dispatch(homeSearchVisibleHandler(true))
                }}
              >
                <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M19.9987 19.9987L16.375 16.375'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M4 11.25C4 15.2541 7.24594 18.5 11.25 18.5C15.2541 18.5 18.5 15.2541 18.5 11.25C18.5 7.24594 15.2541 4 11.25 4V4C7.24606 4.00029 4.00029 7.24606 4 11.25'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </a>
            </div>
            <a href={`tel: ${t('+998(55)-515-33-33')}`} className='header__tel'>
              <span>{t('+998(55)-515-33-33')}</span>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M18.9645 16.61L17.7915 15.437C17.2055 14.851 16.2555 14.851 15.6705 15.437L14.7485 16.359C14.5425 16.565 14.2305 16.634 13.9645 16.517C12.6285 15.932 11.3085 15.045 10.1315 13.868C8.95954 12.696 8.07554 11.382 7.48954 10.051C7.36754 9.77597 7.43854 9.45297 7.65154 9.23997L8.47754 8.41397C9.14854 7.74297 9.14854 6.79397 8.56254 6.20797L7.38954 5.03497C6.60854 4.25397 5.34254 4.25397 4.56154 5.03497L3.90954 5.68597C3.16854 6.42697 2.85954 7.49597 3.05954 8.55597C3.55354 11.169 5.07154 14.03 7.52054 16.479C9.96954 18.928 12.8305 20.446 15.4435 20.94C16.5035 21.14 17.5725 20.831 18.3135 20.09L18.9645 19.439C19.7455 18.658 19.7455 17.392 18.9645 16.61V16.61Z'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M13 6.99256C14.031 6.97856 15.067 7.36056 15.854 8.14756'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M18.682 5.31884C17.113 3.74984 15.056 2.96484 13 2.96484'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M17.0066 11.0024C17.0206 9.97144 16.6386 8.93544 15.8516 8.14844'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M18.6797 5.32031C20.2487 6.88931 21.0337 8.94631 21.0337 11.0023'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </a>
            <Language />
          </div>
        </div>
      </header>
      <Search />
    </>
  )
}

export default Header
