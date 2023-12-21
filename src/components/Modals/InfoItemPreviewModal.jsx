import React from 'react'
import Image from 'next/image';
import {get} from 'lodash'
import i18n from '@/services/i18n'
import { useSelector, useDispatch } from 'react-redux'
import { infoItemCancelHandler } from '@/store/features/system'
import CloseIcon from '@/img/icons/close.svg'
import { useTranslation } from "next-i18next";

const InfoItemPreviewModal = () => {
    const lang = i18n.language
    const dispatch = useDispatch()
    const {infoItemDetailVisible, infoItem} = useSelector(state => state.system);
    const {t} = useTranslation('translation');

    return (
        <>
            <div className="info-popup" style={{display:infoItemDetailVisible ? "block" : "none" }}>
                <div className="info-popup__content">
                    <div className="info-popup__close" onClick={() => dispatch(infoItemCancelHandler({}))}>
                        <Image src={CloseIcon} width={20} height={20} alt="ico"/>
                        <span suppressHydrationWarning={true}>{t("close")}</span>
                    </div>
                    <div className="info-popup__img">
                        <Image src={get(infoItem, 'image[0]') || '/no-image.png'} width={638} height={323} alt="ico"/>
                    </div>
                    <div className="info-popup__wrap">
                        <div className="info-popup__title">
                            {get(infoItem, `title.title_${lang}`)}
                        </div>
                        <div className="info-popup__text">
                            {get(infoItem, `description.description_${lang}`)}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default InfoItemPreviewModal;
