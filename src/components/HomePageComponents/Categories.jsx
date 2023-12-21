'use client'

import React from 'react'
import {get} from 'lodash';
import Link from 'next/link';
import Image from 'next/image';
import i18n from '@/services/i18n';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import NoDataUI from '@/components/NoDataUI';
import PageLoader from '@/components/PageLoader';
import { ContainerAll } from '@/modules/container';
import { categoryModeHandler } from '@/store/features/system';
import { useTranslation } from "next-i18next";

const Categories = () => {
    const lang = i18n.language;
    const router = useRouter();
	const dispatch = useDispatch();
	const {t} = useTranslation('translation');

    return (
		<section className='section types'>
			<ContainerAll
				url={'/eav/category/list/'}
				name='/eav/category/list/'
				params={{
					limit: 6
				}}
			>
				{({items, isLoading}) => {
					return (
						<>
							{items?.items?.length === 0 && !isLoading ? <NoDataUI /> : ""}
							{isLoading && <PageLoader />}
							{items?.items?.length > 0 && (
								<>
									<div className="container section-container">
										<div className="section-head">
											<h2 className="section-title">
												{t("autoIndexSets")}
											</h2>
											<div className="section-wrap">
												<Link href={`/shop/?all=${Date.now()}`} className="section-link" onClick={() => dispatch(categoryModeHandler('all'))}>
													{t("all")}
												</Link>
											</div>
										</div>
										<ul className="types-list">
											{(get(items, 'items') || []).map((item, idx) => (
												<li className="types-list__item" key={idx} onClick={() => router.push(`/shop/?id=${item?.id}`)}>
													<a className='img' style={{cursor: 'pointer'}}>
														<Image src={get(item, 'image')} width={107} height={107} alt="types" />
														<span>{get(item, `title.title_${lang}`)}</span>
													</a>
												</li>
											))}
										</ul>
									</div>
								</>
							)}
						</>
					)
				}}
			</ContainerAll>
		</section>
    )
}

export default Categories;
