'use client'

import React, {useState, useEffect} from 'react'
import Logo from '@/img/logo.svg'
import Link from 'next/link'
import Image from 'next/image'
import Main from '@/modules/FormFormik'
import Fields from '@/components/Fields'
import { Field } from 'formik'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import SuccessPopup from '@/components/Modals/SuccessPopup'
import ErrorPopup from '@/components/Modals/ErrorPopup'
import PageLoader from '@/components/PageLoader'
import { useTranslation } from "next-i18next";
import i18n from '@/services/i18n'

const Confirm = () => {
  const phone = useSelector(state => state.system.phone)
  const router = useRouter()
  const [status, setStatus] = useState(false);
  const [responseMessage, setResponseMessage] = useState({});
  const [errorStatus, setErrorStatus] = useState(false);
  const [loader, setLoader] = useState(true);
  const {t} = useTranslation('translation');

  useEffect(() => {
    let secondsToGo = 3;

    const timer = setInterval(() => {
        secondsToGo -= 1;
    }, 1000);

    setTimeout(() => {
        setLoader(false);
        clearInterval(timer);
      }, secondsToGo * 1000);
}, [])

const countDown = (response) => {
  let secondsToGo = 3;
  setResponseMessage(response);
  setStatus(true);

  const timer = setInterval(() => {
    secondsToGo -= 1;
  }, 1000);

  setTimeout(() => {
    clearInterval(timer);
    setStatus(false);
    setErrorStatus(false);
    setResponseMessage({})
  }, secondsToGo * 1000);
};

  return (
    <>
      {status && responseMessage?.message ? <SuccessPopup responseMessage={responseMessage} /> : ""}
      {errorStatus && <ErrorPopup />}
      {/* {loader && <PageLoader />} */}
      <section className='login'>
        <div className='login-content login-content__enter'>
          <div className='login__logo'>
            <Image src={Logo} width={197} height={45} alt='Tashkent Index' />
          </div>
          <h1 className='login__title' suppressHydrationWarning={true}>{t('registration')}</h1>
          <Main
            method={'post'}
            url='/auth/sms/'
            formid="smsConfirmForm"
            fields={[
              {
                name: 'phone_number',
                value: phone
              },
              {
                name: 'verified_code',
                required: true,
                onSubmitValue: value => value
              }
            ]}
            onSuccess={(data, resetForm) => {
              countDown({
                message: "SMS muvaffaqiyatli yuborildi"
            });
              router.push('/profile/registration');
              resetForm();
            }}
            onError={error => {
              setErrorStatus(true);
              countDown({});
            }}
          >
            {({errors, touched}) => {
              return (
                <div className='login-form'>
                  <div className='form-item'>
                    <div className='form-item__name'>{t('SMScode')}</div>
                    <div className='form-item__input'>
                      <Field
                        type={'text'}
                        component={Fields.InputMaskField}
                        mask={'9999'}
                        maskChar={''}
                        name='verified_code'
                        customclass='form_tel'
                        placeholder='----'
                        style={errors.verified_code && touched.verified_code ? {border: '1px solid #FF4D4F'} : {border: '1px solid #b7b7b7'}}
                      />
                    </div>
                  </div>
                  <div className='login-form__text'>
                   {i18n.language == 'uz' ? 'Profil mavjud ?' : 'Профиль доступен ?'} <Link href='/profile/login'>{i18n.language == 'uz' ? 'kirish' : 'вход'}</Link>
                  </div>
                  <button type='submit' className='login-form__btn btn' suppressHydrationWarning={true}>
                    {t('enterPassword')}
                  </button>
                </div>
              )
            }}
          </Main>
        </div>
      </section>
    </>
  )
}

export default Confirm;
