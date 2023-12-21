import React, {useEffect} from 'react'
import { withLayout } from '../../../layout/Layout';
import MapImg from '@/../../img/indexmap-1.jpg'
import Image from "next/image";

const MapSingle = () => {
	
	useEffect(() => {
		let rootBody = document.getElementsByTagName( 'body' )[0];

		if (rootBody) {
			rootBody.style='position: unset'
		}
		return () => {
			rootBody.style='position: relative'
		}
	}, [])

    return (
        <section className="map auction">
			<div className="container section-container">
				<div className="map-main">
					<div className="map-content map-content__wrap">
						<Image src={MapImg} width={1740 + '%'} height={100 + '%'} alt="map" />
					</div>
				</div>
			</div>
		</section>
    )
}

export default withLayout(MapSingle);
