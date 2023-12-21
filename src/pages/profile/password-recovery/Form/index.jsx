import React, {useState, useEffect} from 'react'
import * as Yup from 'yup'
import SuccessPopup from '@/components/Modals/SuccessPopup'
import ErrorPopup from '@/components/Modals/ErrorPopup'
import { usePostMain } from "@/hooks/crud"
import { Formik, Form, Field } from 'formik'
import Logo from '../../../../img/logo.svg'
import Image from 'next/image'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useTranslation } from "next-i18next";
import { currentLangCode } from '@/services/storage'

const PassswordRecoveryForm = ({ formid }) => {
    const phone = useSelector(state => state.system.phone) 
    const router = useRouter();
    const { mutate } = usePostMain();
    const [status, setStatus] = useState(false);
    const [inputType, setInputType] = useState('password');
    const [confirmInputType, setConfirmInputType] = useState('password');
    const [responseMessage, setResponseMessage] = useState({});
    const [errorStatus, setErrorStatus] = useState(false);
    const {t} = useTranslation('translate');

    useEffect(() => {
        const trackFormSubmission = () => {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            'event': 'form_send',
            'formid': formid
          });
        };
    
        const form = document.getElementById(formid);
    
        if (form) {
          form.addEventListener('submit', trackFormSubmission);
        }
    
        return () => {
          if (form) {
            form.removeEventListener('submit', trackFormSubmission);
          };
        };
    }, [formid]);

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

    const passwordVisibleHandler = (type) => {
        setInputType(type)
    }
  
    const newPasswordVisibleHandler = (type) => {
      setConfirmInputType(type)
    }

    const registrationSchema = Yup.object().shape({
        password: Yup.string()
          .required("Password is required"),
        confirm_password: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Password must match')
        .required("Required")
    });

    return (
        <>
            {status && responseMessage?.message ? <SuccessPopup responseMessage={responseMessage} /> : ""}
            {errorStatus && <ErrorPopup />}
            <Formik
                initialValues={{
                    password: '',
                    confirm_password: '',
                }}
                validationSchema={registrationSchema}
                onSubmit={(values, { resetForm }) => {
                    const _result = {
                        phone_number: phone,
                        password: values.password,
                    }
                    mutate({
                        url: '/auth/password-recovery/',
                        data: _result,
                        method: 'post',
                        onSuccess: data => {
                            countDown({
                                message: "Muvaffaqiyatli yaratildi"
                            })
                            router.push('/profile/login')
                            resetForm();
                        },
                        onError: error => {
                            setErrorMessage({
                                message: "Xatolik yuz berdi !"
                            });
                            countDown({})
                        }
                    })
                }}
            >
                {({ errors, touched }) => {
                    return (
                        <Form id={formid}>
                             <section className="login">
                                <div className="login-content login-content__enter">
                                    <div className="login__logo">
                                        <Image src={Logo} width={197} height={45} alt="Tashkent Index"/>
                                    </div>
                                    <h1 className="login__title">
                                        {t('passwordRecovery')}
                                    </h1>
                                    <div className="login-form">
                                        <div className="form-item">
                                            <div className="form-item__name">
                                                {t('createPassword')}
                                            </div>
                                            <div className="form-item__input eye-control">
                                                <Field 
                                                    type={inputType}
                                                    name="password"
                                                    customclass="form_tel"
                                                    placeholder="Parolni kiriting"
                                                    style={errors.password && touched.password ? {border: '1px solid #FF4D4F'} : {border: '1px solid #b7b7b7'}}
                                                />
                                                { inputType === 'text' ? 
                                                    <div className='eye' onClick={() => passwordVisibleHandler('password')}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                                                        </svg>
                                                    </div>
                                                    :
                                                    <div className='slash-eye' onClick={() => passwordVisibleHandler('text')}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                                                            <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                                                            <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                                                            <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                                                        </svg>
                                                    </div> 
                                                }
                                            </div>
                                        </div>
                                        <div className="form-item">
                                            <div className="form-item__name">
                                                {t('repeatPassword')}
                                            </div>
                                            <div className="form-item__input eye-control">
                                                <Field 
                                                    type={confirmInputType}
                                                    name="confirm_password"
                                                    customclass="form_tel"
                                                    placeholder="Parolni kiriting"
                                                    style={errors.confirm_password && touched.confirm_password ? {border: '1px solid #FF4D4F'} : {border: '1px solid #b7b7b7'}}
                                                />
                                                {errors.confirm_password && touched.confirm_password ? (
                                                        <div style={{color: '#FF4D4F', fontSize: '10px', position: 'absolute', bottom: '-20px'}}>{errors.confirm_password}</div>
                                                    ) : null}
                                                { confirmInputType === 'text' ? 
                                                    <div className='eye' onClick={() => newPasswordVisibleHandler('password')}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                                                        </svg>
                                                    </div>
                                                    :
                                                    <div className='slash-eye' onClick={() => newPasswordVisibleHandler('text')}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                                                            <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                                                            <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                                                            <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                                                        </svg>
                                                    </div> 
                                                }
                                            </div>
                                        </div>
                                        <div className="login-form__text">
                                            {currentLangCode == 'uz' ? 'Profil mavjud ?' : 'Профиль доступен ?'} <Link href="/profile/login">{currentLangCode == 'uz' ? 'kirish' : 'вход'}</Link>
                                        </div>
                                        <button type='submit' className="login-form__btn btn" suppressHydrationWarning={true}>
                                            {t("enterPassword")}
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </Form>
                    )
                }}
            </Formik>
        </>
    )
}

export default PassswordRecoveryForm;
