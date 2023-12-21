'use client'

import React from 'react';
import { withLayout } from '../../../layout/Layout';
import styles from './NoteFound.module.scss';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'next-i18next';

const NotFound = () => {
	const router = useRouter();
	const {t} = useTranslation('translation');

  return (
	<div className='container'>
		<div className={styles.no_data}>
			<div className={styles.no_data_title_box}>
				<h2 className={styles.title} suppressHydrationWarning={true}>{t('notFoundPageTitle')}</h2>
				<button className='btn btn-primary' onClick={() => router.push('/')} suppressHydrationWarning={true}>
					<span>{t('Back to main page')}</span>
				</button>
			</div>
		</div>
	</div>
  )
}

export default withLayout(NotFound);

