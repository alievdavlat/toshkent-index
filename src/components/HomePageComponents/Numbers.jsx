'use client'

import React from 'react';
import {get} from 'lodash';
import Image from 'next/image';
import i18n from '@/services/i18n';
import NoDataUI from '@/components/NoDataUI';
import PageLoader from '@/components/PageLoader';
import { ContainerAll } from '@/modules/container';
import { useTranslation } from "next-i18next";

const Numbers = () => {
	const lang = i18n.language;
	const {t} = useTranslation('translation');

    return (
		<section className='section numbers'>
			<ContainerAll
				url={'/company/list/'}
				name='/company/list/'
			>
				{({items, isLoading}) => {
					return (
						<>
							{items?.length <= 0 && !isLoading ? <NoDataUI /> : ""}
							{isLoading && <PageLoader />}
							{items?.length > 0 && (
								<>
									<div className="container section-container">
										<h2 className="section-title">
											{t("autoIndexNumbers")}
										</h2>
										<ul className="numbers-list">
											{(items || []).map((number, idx) => (
												<li className="numbers-item" key={idx}>
													<div className="numbers-item__ico">
														<Image src={get(number, 'image[0]')} width={80} height={80} alt="numbers" />
													</div>
													<div className="numbers-item__title">
														{get(number, `title.title_${lang}`)}
													</div>
													<div className="numbers-item__text">
														{get(number, `sub_title.title_${lang}`)}
													</div>
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

export default Numbers
