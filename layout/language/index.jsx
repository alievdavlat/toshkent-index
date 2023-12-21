'use client'
import React, {useEffect, useState} from 'react'
import i18n from '@/services/i18n';
import { currentLangCode } from '@/services/storage';

const Language = () => {
    const [key, setKey] = useState(0);

    useEffect(() => {
        i18n.changeLanguage(currentLangCode);
        setKey(prev => prev + 1)
    }, [currentLangCode])

    const changeLangCode = key => {
        i18n.changeLanguage(key)
        localStorage.setItem("language", key);
        window.location.reload();
	};

    const languages = [
		{ id: 1, code: "uz", title: "UZ" },
		{ id: 2, code: "ru", title: "RU" },
	]

    return (
        <div className="header-lang" key={key}>
            {languages.map((item, idx) => (
                <p onClick={() => changeLangCode(item.code)} key={idx} style={{cursor: 'pointer'}} className={item.code == currentLangCode ? 'lang_active' : 'lang'} suppressHydrationWarning={true}>
                    {item.title}
                    <span className={`separator${idx}`}> / </span>
                </p>    
            ))}
            {/* <p onClick={() => changeLangCode('uz')} style={{cursor: 'pointer'}} className={i18n.language == 'uz' ? 'lang_active' : 'lang-uz'}>UZ</p>
                <span> / </span>
            <p onClick={() => changeLangCode('ru')} style={{cursor: 'pointer'}} className={i18n.language == 'ru' ? 'lang_active' : 'lang-ru'}>RU</p> */}
        </div>
    )
}

export default Language;
