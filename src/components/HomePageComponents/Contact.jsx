import React, {useState} from 'react'
import Footer from './Footer'
import { Field } from "formik"
import Main from "@/modules/FormFormik"
import SuccessPopup from '@/components/Modals/SuccessPopup'
import InputMask from "react-input-mask";
import { useTranslation } from 'next-i18next';
import i18n from '@/services/i18n'

const Contact = () => {
    const {t} = useTranslation('translation');
    const [status, setStatus] = useState(false);
    const [responseMessage, setResponseMessage] = useState({});

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
          setResponseMessage({})
        }, secondsToGo * 1000);
    };

    return (
        <section className="section contact">
            <div className="container">
                <div className="contact-main">
                    <h2 className="contact__title section-title" suppressHydrationWarning={true}>
                        {t('ContactTitle')}
                    </h2>

                    {status && <SuccessPopup responseMessage={responseMessage} />}

                    <Main
                        method={'post'}
                        url={'/message/create/'}
                        formid="contactForm"
                        fields={[
                            {
                                name: "first_name",
                                required: true,
                                onSubmitValue: value => value
                            },
                            {
                                name: "phone_number",
                                required: true,
                                onSubmitValue: value => value
                            }
                        ]}
                        onSuccess={(data, resetForm) => {
                            countDown({
                                message: 'Habar muvafaqqiyatli yuborildi'
                            });
                            resetForm();
                        }}
                        
                        onError={error => {
                            return error
                        }}
                    >
                        {({ errors, touched }) => {
                            return (
                                <div className="contact__form">
                                    <Field 
                                        name='first_name'
                                        type="text"
                                        placeholder={i18n.language === 'uz' ? 'Ismingiz' : 'Имя'}
                                        style={errors.first_name && touched.first_name ? {border: '1px solid #FF4D4F'} : {border: '1px solid transparent'}}
                                    />
                                    <Field name="phone_number">
                                        {({field}) => (
                                            <InputMask
                                                {...field}
                                                formatChars={{
                                                    "0": "[0-9]",
                                                    a: "[0-9]",
                                                    b: "[0-2]",
                                                    c: "[0-5]",
                                                    A: "[A-Z]"
                                                }}
                                                mask={"+998 00 000 00 00"}  // This mask allows the user to input the two 99s after +998
                                                maskChar={null}
                                                type={"text"}
                                                customclass='form_tel'
                                                placeholder={i18n.language === 'uz' ? 'Telefon raqamingiz' : 'Номер телефона'}
                                                style={errors.phone_number && touched.phone_number ? {border: '1px solid #FF4D4F'} : {border: '1px solid transparent'}}
                                            />
                                        )}
                                    </Field>
                                    <button type='submit' className="btn btn-trans" suppressHydrationWarning={true}>
                                        {t('send')}
                                    </button>
                                </div>
                            )
                        }}
                    </Main>
                </div>
                <Footer />
            </div>
        </section>
    )
}

export default Contact;
