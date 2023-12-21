import React, { useState, useEffect } from 'react'
import Logo from '../../../../img/logo.svg'
import Link from 'next/link'
import Image from 'next/image'
import Main from "@/modules/FormFormik"
import Fields from "@/components/Fields"
import { Field } from "formik"
import { useRouter } from 'next/navigation'
import { useDispatch } from "react-redux"
import { userPhoneHandler } from "@/store/features/system"
import SuccessPopup from '@/components/Modals/SuccessPopup'
import ErrorPopup from '@/components/Modals/ErrorPopup'
import PageLoader from '@/components/PageLoader'
import { currentLangCode } from '@/services/storage'
import { useTranslation } from "next-i18next";

const SignUp = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const [status, setStatus] = useState(false);
    const [responseMessage, setResponseMessage] = useState({});
    const [errorStatus, setErrorStatus] = useState(false);
    const [loader, setLoader] = useState(true);
    const [errorMessage, setErrorMessage] = useState({});
    const {t} = useTranslation('translation');
    
    // useEffect(() => {
    //     let secondsToGo = 3;

    //     const timer = setInterval(() => {
    //         secondsToGo -= 1;
    //     }, 1000);

    //     setTimeout(() => {
    //         setLoader(false);
    //         clearInterval(timer);
    //       }, secondsToGo * 1000);
    // }, [])

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
            {errorStatus && <ErrorPopup errorMessage={errorMessage} />}
            {/* {loader && <PageLoader />} */}

            <section className="login">
                <div className="login-content login-content__enter">
                    <div className="login__logo">
                        <Image src={Logo} width={197} height={45} alt="Tashkent Index"/>
                    </div>
                    <h1 className="login__title">
                        {t('Register')}
                    </h1>
                    <Main
                        method={'post'}
                        url='/auth/sms/'
                        formid="signUpForm"
                        fields={[
                            {
                                name: "phone_number",
                                required: true,
                                onSubmitValue: value => value
                            },
                            {
                                name: "type",
                                value: 'register'
                            }
                        ]}
                        onSuccess={(data, resetForm) => {
                            dispatch(userPhoneHandler(data.phone_number))
                            countDown({
                                message: "Raqam muvaffaqiyatli yuborildi"
                            });
                            router.push('/profile/confirm');
                            resetForm();
                        }}
                        onError={error => {
                            setErrorStatus(true);
                            setErrorMessage({
                                message: currentLangCode === 'uz' ? error.response?.data?.error_uz : error.response?.data?.error_ru
                            })
                            countDown({});
                        }}
                    >
                        {({ errors, touched }) => {
                            return (
                                <div className="login-form">
                                    <div className="form-item">
                                        <div className="form-item__name">
                                            {t('phoneNumber')}
                                        </div>
                                        <div className="form-item__input">
                                            <Field
                                                type={"text"}
                                                component={Fields.InputMaskField}
                                                mask="+\9\9\8999999999"
                                                maskChar={""}
                                                showmask={true}
                                                name="phone_number"
                                                customclass='form_tel'
                                                placeholder="+998 _ _  _ _ _  _ _  _ _"
                                                style={errors.phone && touched.phone ? {border: '1px solid #FF4D4F'} : {border: '1px solid #b7b7b7'}}
                                            />
                                        </div>
                                    </div>
                                    <div className="login-form__text">
                                        {t('HaveAccount')} <Link href="/profile/login">{t('enterPassword')}</Link>
                                    </div>
                                    <button type='submit' className="login-form__btn btn">
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

export default SignUp;
