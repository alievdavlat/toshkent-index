import React, { useState } from 'react';
import { Modal} from "antd";
import Image from 'next/image';
import { Field } from "formik";
import ErrorPopup from './ErrorPopup';
import Main from "@/modules/FormFormik";
import Fields from "@/components/Fields";
import check from '@/img/icons/done.svg';
import { useSelector, useDispatch } from "react-redux";
import { applicationModalVisibleHide } from '@/store/features/system';
import { useTranslation } from 'next-i18next';
import i18n from '@/services/i18n';

const ApplicationModal = () => {
    const [modal, setModal] = useState(false);
    const [errorStatus, setErrorStatus] = useState(false);

    const dispatch = useDispatch();
    const { applicationModalVisible, applicationSubmitLink } = useSelector(state => state.system);
    const {t} = useTranslation('translation');

    const countDown = () => {
        let secondsToGo = 2;

        const timer = setInterval(() => {
          secondsToGo -= 1;
        }, 1000);

        setTimeout(() => {
            clearInterval(timer);
            setErrorStatus(false);
            setModal(false);
        }, secondsToGo * 1000);
    };

    return (
        <>
            {errorStatus && <ErrorPopup />}
            <div className="feedback" role='button'>
                <div className='account-popup account-popup__delete' style={{ display: modal ? 'block' : 'none', zindex: 1000 }}>
                    <div className='account-popup__content'>
                        <div className='account-popup__img'>    
                            <Image src={check} width={100} height={100} alt='ico' />
                        </div>
                        <div className='account-popup__text' suppressHydrationWarning={true}>{t('contactSuccessModaltitle')}</div>
                    </div>
                </div>
                <Modal open={applicationModalVisible} footer={false} onCancel={() => dispatch(applicationModalVisibleHide({}))} closeIcon={() => null} className='ant-modal'>
                    <div className="feedback-content">
                        <div className="feedback-content-title" suppressHydrationWarning={true}>
                            {t('contactModaltitle')}
                        </div>
                        <Main
                            method={'post'}
                            url={'/message/create/'}
                            formid="feedbackForm"
                            fields={[
                                {
                                    name: "first_name",
                                    required: true,
                                    onSubmitValue: value => value
                                },
                                {
                                    name: "last_name",
                                    value: ''
                                },
                                {
                                    name: "phone_number",
                                    required: true,
                                    onSubmitValue: value => value
                                },
                                {
                                    name: 'link',
                                    value: applicationSubmitLink
                                },
                                {
                                    name: 'type',
                                    value: 'application'
                                }
                            ]}
                            onSuccess={(data, resetForm) => {
                                dispatch(applicationModalVisibleHide({}));
                                setModal(true);
                                countDown();
                                resetForm();
                            }}
                            onError={error => {
                                if (error) {
                                    setErrorStatus(true);
                                    countDown();
                                }
                            }}
                        >
                            {({ errors, touched }) => {
                                return (
                                    <div className="feedback-wrap">
                                        <div className="feedback-form form">
                                            <div className="form-item">
                                                <div className="form-item__name" style={{color: '#FFF'}} suppressHydrationWarning={true}>
                                                    {t('name')}
                                                </div>
                                                <div className="form-item__input">
                                                    <Field 
                                                        type="text"
                                                        name='first_name'
                                                        className='form_tel'
                                                        placeholder={i18n.language == 'uz' ? 'Ismingiz' : 'Ваше имя'}
                                                        style={errors.first_name && touched.first_name ? {border: '1px solid #FF4D4F'} : {border: '1px solid #b7b7b7'}}
                                                    />
                                                </div>
                                            </div>
                                            {/*<div className="form-item">*/}
                                            {/*    <div className="form-item__name" style={{color: '#FFF'}} suppressHydrationWarning={true}>*/}
                                            {/*        {t('lastName')}*/}
                                            {/*    </div>*/}
                                            {/*    <div className="form-item__input">*/}
                                            {/*        <Field */}
                                            {/*            type="text" */}
                                            {/*            name='last_name'*/}
                                            {/*            className='form_tel'*/}
                                            {/*            placeholder={i18n.language == 'uz' ? 'Familiyangiz' : 'Ваша фамилия'}*/}
                                            {/*            style={errors.last_name && touched.last_name ? {border: '1px solid #FF4D4F'} : {border: '1px solid #b7b7b7'}}*/}
                                            {/*        />*/}
                                            {/*    </div>*/}
                                            {/*</div>*/}
                                            <div className="form-item">
                                                <div className="form-item__name" style={{color: '#FFF'}} suppressHydrationWarning={true}>
                                                    {t('phoneNumber')}
                                                </div>
                                                <div className="form-item__input">
                                                    <Field
                                                        type={"text"}
                                                        component={Fields.InputMaskField}
                                                        mask="+\9\9\8999999999"
                                                        maskChar={""}
                                                        name="phone_number"
                                                        customclass='form_tel'
                                                        placeholder={i18n.language == 'uz' ? 'Telefon raqamingiz' : 'Ваш номер телефона'}
                                                        style={errors.phone_number && touched.phone_number ? {border: '1px solid #FF4D4F'} : {border: '1px solid #b7b7b7'}}
                                                    />
                                                </div>
                                            </div>
                                            <button type='submit' className="btn" suppressHydrationWarning={true}>
                                                {t('order')}
                                            </button>
                                        </div>
                                    </div>
                                )
                            }}
                        </Main>
                    </div>
                </Modal>
            </div>
        </>
    )
}

export default ApplicationModal;
