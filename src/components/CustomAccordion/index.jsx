import React, { useState } from 'react'
import {get} from 'lodash'
import { currentLangCode } from '@/services/storage';
import Image from 'next/image';
import i18n from '@/services/i18n'

const CustomAccordion = ({ items }) => {

	const [isActive, setIsActive] = useState(0);

	const accordionHandler = questionIdx => {
		setIsActive(questionIdx === isActive ? null : questionIdx);
	};

	return (
		<div className="accordion">
			{(items || []).map((question, questionIdx) => {
				const result = (get(question, `answer.${currentLangCode}`) || '').split(/\r?\n/);
				return (
					<div className='accordion_item' key={questionIdx}>
						<div className={isActive === questionIdx ? "accordion_top accordion-active" : "accordion_top"} role="button" onClick={() => accordionHandler(questionIdx)}>
							<p className='question_title'>{get(question, `question.${currentLangCode}`)}</p>
							<Image src={'/arrow-up.png'} width={30} height={30} className={isActive === questionIdx ? "icon active-item" : "icon"} alt="icon" />
						</div>
						{get(question, `answer.${currentLangCode}`) ? (
							<div
								onClick={e => e.stopPropagation()}
								className={`${isActive === questionIdx ? "accordion_content content-show" : "accordion_content"}`}
							>
								{(result || []).map((res, idx) => (
									<p className='answer_title' key={idx}>{res}</p>
								))}
							</div>
						) : (
							<div
								className={`${isActive === questionIdx ? "accordion_content content-show" : "accordion_content"}`}
							>
								<p className='answer_title'>{i18n.language == 'uz' ? 'Ma`lumot kiritilmagan' : 'Нет данных'}</p>
							</div>
						)}
					</div>
				)
			})}
		</div>
	);
}

export default CustomAccordion;