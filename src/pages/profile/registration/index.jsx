import React, { useState, useEffect } from 'react'
import Logo from '../../../../img/logo.svg'
import Image from 'next/image'
import JuridicalPerson from './JuridicalPerson'
import PhysicalPerson from './PhysicalPerson'
import PageLoader from '@/components/PageLoader'
import { useTranslation } from 'next-i18next'
import Seo from '@/components/seo'

export const getServerSideProps = async () => {
  const title = {
    uz: 'Tashkent INDEX | PROFIL',
    ru: 'Tashkent INDEX | ПРОФИЛЬ'
  }

  const desc = {
    uz: `Tashkent INDEX - PROFILGA KIRISH`,
    ru: `Tashkent INDEX - ВХОД В ПРОФИЛЬ`
  }

  return {
    props: {
      title: title,
      desc: desc,
      url: '/profile/registration'
    }
  }
}

const Registration = ({ url, title, desc }) => {
  const [mode, setMode] = useState('physical')
  const [loader, setLoader] = useState(true)
  const { t } = useTranslation('translation')

  useEffect(() => {
    let secondsToGo = 3

    const timer = setInterval(() => {
      secondsToGo -= 1
    }, 1000)

    setTimeout(() => {
      setLoader(false)
      clearInterval(timer)
    }, secondsToGo * 1000)
  }, [])

  const tabPaneHandler = value => {
    setMode(value)
  }

  return (
    <>
      <Seo
        title={title?.[i18n.language || 'uz']}
        description={desc?.[i18n.language || 'uz']}
        image={'/in.jpg'}
        url={url}
      />
      {loader && <PageLoader />}
      <section className='login'>
        <div className='login-content'>
          <div className='login__logo'>
            <Image src={Logo} width={197} height={45} alt='Tashkent Index' />
          </div>
          <h1 className='login__title' suppressHydrationWarning={true}>
            {t('registration')}
          </h1>
          <div className='login-choose'>
            <button
              className={`login-choose__btn ${mode === 'physical' ? 'current' : ''}`}
              onClick={() => tabPaneHandler('physical')}
              suppressHydrationWarning={true}
            >
              {t('physicalPerson')}
            </button>
            <button
              className={`login-choose__btn ${mode === 'juridical' ? 'current' : ''}`}
              onClick={() => tabPaneHandler('juridical')}
              suppressHydrationWarning={true}
            >
              {t('juridicalPerson')}
            </button>
          </div>
          {mode === 'physical' ? (
            <PhysicalPerson formid='physicalPersonRegistration' />
          ) : (
            <JuridicalPerson formid='juridicalPersonRegistration' />
          )}
        </div>
      </section>
    </>
  )
}

export default Registration
