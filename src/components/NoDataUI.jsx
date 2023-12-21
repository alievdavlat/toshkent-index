'use client'

import React from 'react'
import i18n from '@/services/i18n'

const NodataUI = () => {
    return (
        <div className='no-data'>
            <p className='no-data-title'>{ i18n.language === 'uz' ? 'Ma`lumot kiritilmagan' : 'Нет данных'}</p>
        </div>
    )
}

export default NodataUI;
