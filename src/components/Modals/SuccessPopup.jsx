import React from 'react'
import { get } from 'lodash'

const SuccessPopup = ({ responseMessage }) => {
    return (
        <div className='contact-popup'>
            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                <circle cx="17.4996" cy="17.5074" r="13.1305" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12.3105 18.0014L15.4721 21.163L15.4516 21.1425L22.5844 14.0098" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p>{get(responseMessage, 'message')}</p>
            <span className='status-progress'/>
        </div>
    )
}

export default SuccessPopup
