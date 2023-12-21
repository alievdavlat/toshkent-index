import React from 'react'
import Image from 'next/image'
import styles from './CSelect.module.scss'

const CSelect = (props) => {
	return (
		<div className={styles.custom_select}>
			<div className={styles.custom_select_value}>
				<input type='text' placeholder='Machine type' readOnly className={styles.custom_select_input} />
				<span className={styles.icon}>
					<Image src='/arrowDown.svg' width={10} height={10} alt='arrow'/>
				</span>
			</div>
			<div className={styles.custom_select_options}>
				{props.options.map((item, idx) => {
					return (
						<div className={styles.options_item} key={idx}>
							<Image src={item.src} width={108} height={43} alt='arrow'/>
							<p>{item.name}</p>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default CSelect;