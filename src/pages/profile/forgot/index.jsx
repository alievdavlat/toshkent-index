'use client'

import React, {useState, useEffect} from 'react'
import Logo from '../../../../img/logo.svg'
import Link from 'next/link'
import Image from 'next/image'
import Fields from "@/components/Fields"
import { Field } from "formik"
import Main from "@/modules/FormFormik"
import { useRouter } from 'next/navigation'
import SuccessPopup from '@/components/Modals/SuccessPopup'
import ErrorPopup from '@/components/Modals/ErrorPopup'
import PageLoader from '@/components/PageLoader'
import { useDispatch } from 'react-redux'
import { userPhoneHandler } from '@/store/features/system'
import { useTranslation } from "next-i18next";
import i18n from '@/services/i18n'

const Forgot = () => {
    const router = useRouter()
    const [status, setStatus] = useState(false);
    const [responseMessage, setResponseMessage] = useState({});
    const [errorStatus, setErrorStatus] = useState(false);
    const [loader, setLoader] = useState(true);
    const dispatch = useDispatch()
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
            { status && responseMessage?.message ? <SuccessPopup responseMessage={responseMessage} /> : ''}
            { errorStatus && <ErrorPopup />}
            {/* { loader && <PageLoader />} */}

            <section className="login">
                <div className="login-content login-content__enter">
                    <div className="login__logo">
                        <Image src={Logo} width={197} height={45} alt="Tashkent Index"/>
                    </div>
                    <h1 className="login__title">
                        {t('passwordRecovery')}
                    </h1>
                    <Main
                        method={'post'}
                        url='/auth/sms/'
                        formid="forgotForm"
                        fields={[
                            {
                                name: "phone_number",
                                required: false,
                                onSubmitValue: value => value
                            },  
                        ]}
                        onSuccess={(data, resetForm) => {
                            dispatch(userPhoneHandler(data?.phone_number))
                            countDown({
                                message: i18n.language == 'uz' ? "Raqam muvaffaqiyatli yuborildi" : "Номер успешно отправлен"
                            });
                            router.push('/profile/forgot-confirm');
                            resetForm();
                        }}
                        onError={error => {
                            setErrorStatus(true);
                            countDown({});
                        }}
                    >
                        {({ errors, touched }) => {
                            return (
                                <div className="login-form">
                                    <div className="form-item">
                                        <div className="form-item__name" suppressHydrationWarning={true}>
                                            {t('phoneNumber')}
                                        </div>
                                        <div className="form-item__input">
                                            <Field
                                                type={"text"}
                                                component={Fields.InputMaskField}
                                                mask={"+999999999999"}
                                                maskChar={""}
                                                name="phone_number"
                                                customclass='form_tel'
                                                placeholder="+998 _ _  _ _ _  _ _  _ _"
                                                style={errors.phone_number && touched.phone_number ? {border: '1px solid #FF4D4F'} : {border: '1px solid #b7b7b7'}}
                                            />
                                        </div>
                                    </div>
                                    <div className="login-form__text">
                                    {i18n.language == 'uz' ? 'Profil mavjud ?' : 'Профиль доступен ?'} <Link href="/profile/login">{i18n.language == 'uz' ? 'kirish' : 'вход'}</Link>
                                    </div>
                                    <button className="login-form__btn btn">
                                        {t('send')}
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

export default Forgot;
