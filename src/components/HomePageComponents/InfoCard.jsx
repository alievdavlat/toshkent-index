import React from 'react'
import Image from 'next/image'
import {get} from 'lodash'
import i18n from '@/services/i18n'
import { useDispatch } from 'react-redux'
import { infoItemHandler, infoItemCancelHandler } from '@/store/features/system'

const InfoCard = ({ item }) => {
    const lang = i18n.language
    const dispatch = useDispatch()

    return (
        <div className="info-wrap">
            {(item || []).map((infoItem, idx) => (
                <div className="info-item" key={idx} onClick={() => dispatch(infoItemHandler(infoItem))}>
                    <div className="info-item__content">
                        <div className="info-item__title">
                            {get(infoItem, `title.title_${lang}`)}
                        </div>
                        <div className="info-item__desc">
                            {get(infoItem, `sub_title.title_${lang}`)}
                        </div>
                    </div>
                    <div className="info-item__img">
                        <Image src={get(infoItem, 'image[0]')} width={620} height={220} alt="img" />
                    </div>
                </div>
            ))}
        </div>
    )
}



export default InfoCard
