import React from 'react'
import Image from 'next/image'
import {get} from 'lodash'
import moment from 'moment'
import { auctionItemHandler } from '@/store/features/system'
import { useDispatch } from 'react-redux'
import { useTranslation } from "next-i18next";

const AuctionCard = ({item}) => {
	const dispatch = useDispatch();
	const {t} = useTranslation('translation');

	return (
		<div className="product-item" onClick={() => dispatch(auctionItemHandler(item))} style={{cursor: 'pointer'}}>
			<div className="product-item__img">
				<a href={null}>
					<Image src={get(item, 'images[0]')} width={413} height={309} alt={get(item, 'title')} title={get(item, 'title')} />
				</a>
			</div>
			<div className="product-item__wrap">
				<div className="product-item__name">
					<a href={null}>{get(item, 'title')}</a>
				</div>
				<ul className="product-item__info">
					<li>{t("initialPrice")} : <strong>$ {get(item, 'price')}</strong> </li>
					<li>{t("auctionDate")} : {moment(get(item, 'auction.start_date')).format('DD.MM.YYYY')}</li>
					<li>{t("lotNumber")}: {get(item, 'lot')}</li>
				</ul>
			</div>
		</div>
	)
}

export default AuctionCard;