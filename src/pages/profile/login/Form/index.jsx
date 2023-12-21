import React, { useState, useEffect } from 'react'
import { Formik, Form, Field } from 'formik'
import Fields from '@/components/Fields'
import Link from 'next/link'
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'
import SuccessPopup from '@/components/Modals/SuccessPopup'
import ErrorPopup from '@/components/Modals/ErrorPopup'
import { usePostMain } from '@/hooks/crud'
import { useTranslation } from 'next-i18next'
import i18n from '@/services/i18n'

const LoginForm = ({ formid }) => {
  const router = useRouter()
  const { mutate } = usePostMain()
  const [status, setStatus] = useState(false)
  const [responseMessage, setResponseMessage] = useState({})
  const [errorStatus, setErrorStatus] = useState(false)
  const { t } = useTranslation('translation')

  useEffect(() => {
    const trackFormSubmission = () => {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        event: 'form_send',
        formid: formid
      })
    }

    const form = document.getElementById(formid)

    if (form) {
      form.addEventListener('submit', trackFormSubmission)
    }

    return () => {
      if (form) {
        form.removeEventListener('submit', trackFormSubmission)
      }
    }
  }, [formid])

  const countDown = response => {
    let secondsToGo = 3
    setResponseMessage(response)
    setStatus(true)

    const timer = setInterval(() => {
      secondsToGo -= 1
    }, 1000)

    setTimeout(() => {
      clearInterval(timer)
      setStatus(false)
      setErrorStatus(false)
      setResponseMessage({})
    }, secondsToGo * 1000)
  }

  const loginSchema = Yup.object().shape({
    phone_number: Yup.string().required('Required'),
    password: Yup.string().required('Required')
  })

  return (
    <>
      {status && responseMessage?.message ? <SuccessPopup responseMessage={responseMessage} /> : ''}
      {errorStatus && <ErrorPopup />}

      <Formik
        initialValues={{
          phone_number: '',
          password: ''
        }}
        validationSchema={loginSchema}
        onSubmit={(values, { resetForm }) => {
          mutate({
            url: '/auth/login/',
            data: values,
            method: 'post',
            onSuccess: data => {
              localStorage.setItem('access-token', data.data.access)
              localStorage.setItem('user', JSON.stringify(data.data))
              countDown({
                message: i18n.language == 'uz' ? 'Tizimga muvaffaqiyatli kirildi' : 'Вы успешно вошли в систему'
              })
              router.push('/profile')
              resetForm()
            },
            onError: error => {
              countDown({})
              setErrorStatus(true)
            }
          })
        }}
      >
        {({ errors, touched }) => {
          return (
            <Form className='login-form' id={formid}>
              <div className='form-item'>
                <div className='form-item__name' suppressHydrationWarning={true}>{t('phoneNumber')}</div>
                <div className='form-item__input'>
                  <Field
                    type={'text'}
                    component={Fields.InputMaskField}
                    mask="+\9\9\8999999999"
                    maskChar={''}
                    name='phone_number'
                    customclass='form_tel'
                    placeholder='+998 _ _  _ _ _  _ _  _ _'
                  />
                </div>
              </div>
              <div className='form-item'>
                <div className='form-item__name'>{i18n.language == 'uz' ? 'Parol' : 'Пароль'}</div>
                <div className='form-item__input'>
                  <Field
                    type={'password'}
                    name='password'
                    customclass='form_tel'
                    placeholder={i18n.language == 'uz' ? 'Parol' : 'Пароль'}
                    style={
                      errors.password && touched.password
                        ? { border: '1px solid #FF4D4F' }
                        : { border: '1px solid #b7b7b7' }
                    }
                  />
                </div>
              </div>
              <div className='login-form__text'>
                {i18n.language == 'uz' ? 'Profil mavjud emas ?' : 'Профиль недоступен ?'}{' '}
                <Link href='/profile/sign-up'>{i18n.language == 'uz' ? 'Yaratish' : 'Создать'}</Link>
              </div>
              <div className='login-form__text'>
                <Link href='/profile/forgot' suppressHydrationWarning={true}>{t('forgotPassword')}</Link>
              </div>
              <button type='submit' className='login-form__btn btn' suppressHydrationWarning={true}>
                {t('enterPassword')}
              </button>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

export default LoginForm
