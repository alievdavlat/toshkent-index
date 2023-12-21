import React, {useState} from 'react';
import { Htag } from '@/components';
import { Skeleton } from 'antd';
import styles from './BannerSkeleton.module.scss';

const BannerSkeleton = () => {
	return (
		<div className='container'>
			<div className={styles.banner}>
				<div className={styles.banner_info}>
					<div>
						<Htag tag='h1'>
							<Skeleton active />
						</Htag>
						<Skeleton active />
					</div>

					<div className={styles.info_btn}>
						<Skeleton active />
					</div>
				</div>
				<div className={styles.banner_swiper}>
					<div className={styles.banner_swiper_slide}>
						<Skeleton active />
					</div>
				</div>
			</div>
		</div>
	)
}

export default BannerSkeleton;