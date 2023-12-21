'use client'

import React from 'react'
import Image from 'next/image'
import MapImg from '@/../../img/map-1.jpg'
import Link from 'next/link'
import { useTranslation } from "next-i18next";

const Map = () => {
	const {t} = useTranslation('translation');

    return (
        <section className="section map">
			<div className="container section-container">
				<div className="map-main">
					<div className="map__img">
						<Image src={MapImg} width={1740} height={649} alt="map" />
					</div>
					<div className="map-content">
						<h2 className="main__title section-title">
							{t("getToKnowMap")}
						</h2>
						<Link href="/map" className="btn">
							{t("all")}
						</Link>
					</div>
				</div>
			</div>
		</section>
    )
}

export default Map;
