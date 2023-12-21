import React, { useEffect, useState } from 'react'
import Logo from '../../../../img/logo.svg'
import Image from 'next/image'
import LoginForm from './Form'
import PageLoader from '@/components/PageLoader'
import i18n from '@/services/i18n'
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
      url: '/profile/login'
    }
  }
}

const Login = ({ url, title, desc }) => {
  const [loader, setLoader] = useState(true)

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
        <div className='login-content login-content__enter'>
          <div className='login__logo'>
            <Image src={Logo} width={197} height={45} alt='Tashkent Index' />
          </div>
          <h1 className='login__title'>{i18n.language == 'uz' ? 'Kirish' : 'Вход'}</h1>
          <LoginForm formid={'loginForm'} />
        </div>
      </section>
    </>
  )
}

export default Login
