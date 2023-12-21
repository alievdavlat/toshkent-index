import React, { useState, useEffect, useRef } from 'react'
import {get} from 'lodash'
import i18n from '@/services/i18n'
import { useSelector, useDispatch } from 'react-redux'
import { auctionItemCancelHandler } from '@/store/features/system'
import { useGetOne } from '@/hooks/crud'
import helpers from '@/services/helpers'
import { Field } from "formik"
import Main from "@/modules/FormFormik"
import Fields from "@/components/Fields"
import AuctionSwiper from './components/AuctionSwiper'
import { useTranslation } from "next-i18next";

const AuctionSingleModal = ({setFormSucces, setResponseMessage, setErrorStatus}) => {
    const [isChecked, setChecked] = useState(false);
    const [_, setItem] = useState(null);
    const lang = i18n.language;
    const dispatch = useDispatch();
    const {auctionItemDetailVisible, auctionItem} = useSelector(state => state.system);
    const {t} = useTranslation('translation');

    const countDown = (response) => {
        let secondsToGo = 3;
        setResponseMessage(response);
        setFormSucces(true);

        const timer = setInterval(() => {
          secondsToGo -= 1;
        }, 1000);

        setTimeout(() => {
          clearInterval(timer);
          setFormSucces(false);
          setResponseMessage({});
          setErrorStatus(false);
        }, secondsToGo * 1000);
    };

    const checkedHandler = () => {
        setChecked(prev => !prev)
    }

    const {data} = useGetOne({
        url: `/auction/ad/info/${auctionItem?.id}/`,
        name: `/auction/ad/info/${auctionItem?.id}/`,
        propId: auctionItem?.id
    })

    return (
        <div className="auction-popup" style={{display:auctionItemDetailVisible ? "block" : "none" }}>
            <div className="auction-popup__content">
                <div className="auction-popup__carousel">
                    {auctionItemDetailVisible && <AuctionSwiper data={data} auctionItemDetailVisible={auctionItemDetailVisible} />}
                </div>
                <div className="auction-popup__wrap">
                    <div className="auction-popup__close" onClick={() => dispatch(auctionItemCancelHandler({}))}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 4L20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M20 4L4 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <div className="auction-popup__title">
                        {get(data, 'title')}
                    </div>
                    <ul className="auction-popup__info">
                        <li suppressHydrationWarning={true}>{t("lotNumber")}: <strong>{get(data, 'lot')}</strong></li>
                        <li suppressHydrationWarning={true}>{t("year")}: <strong>{get(data, 'year')}</strong></li>
                        <li suppressHydrationWarning={true}>{t("color")}: <strong>{get(data, `color.label.label_${lang}`)}</strong></li>
                        <li suppressHydrationWarning={true}>{t("mark")}: <strong>{get(data, `marka.label.label_${lang}`)}</strong></li>
                        <li suppressHydrationWarning={true}>{t("mileage")}: <strong>{get(data, 'probeg')}</strong></li>
                        <li suppressHydrationWarning={true}>{t("engineType")}: <strong>{get(data, 'engine_type')}</strong></li>
                        <li suppressHydrationWarning={true}>{t("automaticCurtain")}: <strong>{get(data, 'type')}</strong></li>
                        <li suppressHydrationWarning={true}>{t("stateNumber")}: <strong>{get(data, 'country_number')}</strong></li>
                        <li suppressHydrationWarning={true}>{t("initialPrice")}: <strong>$ {helpers.convertToReadable(get(data, 'price'))}</strong></li>
                    </ul>
                    <Main
                        method={'post'}
                        url={'/auction-form/create/'}
                        formid="auctionForm"
                        fields={[
                            {
                                name: "full_name",
                                required: true,
                                onSubmitValue: value => value
                            },
                            {
                                name: "seria_number",
                                required: true,
                                onSubmitValue: value => value
                            },
                            {
                                name: "phone_number",
                                required: true,
                                onSubmitValue: value => value
                            },
                            {
                                name: "ad",
                                value: auctionItem?.id,
                            }
                        ]}
                        onSuccess={(data, resetForm) => {
                            dispatch(auctionItemCancelHandler({}))
                            countDown({
                                message: 'Habar muvafaqqiyatli yuborildi'
                            });
                            resetForm();
                        }}
                        onError={error => {
                            setErrorStatus(true);
                            countDown({})
                        }}
                    >
                        {({errors, touched}) => {
                            return (
                                <div className="auction-popup__form">
                                    <div className="auction-popup__input">
                                        <Field 
                                            type="text"
                                            name='full_name'
                                            placeholder="FISh"
                                            style={errors.full_name && touched.full_name ? {border: '1px solid #FF4D4F'} : {border: '1px solid #00cd69'}}
                                        />
                                    </div>
                                    <div className="auction-popup__input">
                                        <Field 
                                            type="text"
                                            name='seria_number'
                                            placeholder="Seriya/Pasport Nomeri"
                                            style={errors.seria_number && touched.seria_number ? {border: '1px solid #FF4D4F'} : {border: '1px solid #00cd69'}}
                                        />
                                    </div>
                                    <div className="auction-popup__input">
                                        <Field
                                            type={"text"}
                                            component={Fields.InputMaskField}
                                            mask={"+999999999999"}
                                            maskChar={""}
                                            name="phone_number"
                                            placeholder="Telefon raqami"
                                            style={errors.phone_number && touched.phone_number ? {border: '1px solid #FF4D4F'} : {border: '1px solid #00cd69'}}
                                        />
                                    </div>
                                    <label id="check1" className="auction-popup__check" onClick={checkedHandler}>
                                        <input type="checkbox" id="check1"/>
                                        <span><a href={null} onClick={checkedHandler}>{t("termAndConditions")}</a></span>
                                    </label>
                                    <button type='submit' className={`btn ${!isChecked ? 'btn-disabled' : ''}`}>{t("sendRequest")}</button>
                                </div>
                            )
                        }}
                    </Main>
                </div>
            </div>
        </div>
    )
}

export default AuctionSingleModal;
