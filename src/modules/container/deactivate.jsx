import React, { useState } from 'react'
import { requestAuth } from '@/services'
import { useMutation } from '@tanstack/react-query'
import Trash from '@/img/icons/trash.svg'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { t } from 'i18next'
import i18n from '@/services/i18n'
import { Radio } from 'antd';

function DeActivate({ url, className, title, type, onSuccess, onError }) {
  const router = useRouter()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [text, setText] = useState('')
  const [value, setValue] = useState(1);
  const [reasonTxt, setReasonTxt] = useState('Shu yerda sotdim');

  const deleteFunction = async data => {
    
    const response = await requestAuth({
      url: data?.url,
      data: data?.data,
      method: 'DELETE'
    })
    return response
  }

  const { mutate, isLoading } = useMutation(deleteFunction, {
    onSuccess: data => {
      setIsModalOpen(false)
      router.back()
    },
    onError: () => onError
  })

  const radioChangeHandler = e => {
    if (value === 3) {
      setReasonTxt('');  
    }
    setValue(e.target.value)
    setReasonTxt(e.target.id);
  }

  const radioStyle = {
    display: 'flex',
    height: '30px',
    lineHeight: '30px',
    color: '#fff'
  };

  return (
    <>
      <button disabled={isLoading} type={type} className={className} onClick={() => setIsModalOpen(true)}>
        {isLoading ? 'Loading' : title}
      </button>

      <>
        <div
          className='account-popup account-popup__delete'
          style={{ display: isModalOpen ? 'block' : 'none', zIndex: 999999 }}
        >
          <div className='account-popup__content'>
            <div className='account-popup__img'>
              <Image src={Trash} width={100} height={100} alt='ico' />
            </div>
            <div className='account-popup__text' suppressHydrationWarning={true}>{t('removalWarning')}</div>
            <div className='form-item'>
              <div className='form-item__input' style={{display: 'flex', justifyContent: 'flex-start'}}>
              <Radio.Group onChange={radioChangeHandler} value={value}>
                <Radio style={radioStyle} value={1} id={i18n.language === 'uz' ? 'Shu yerda sotdim' : 'Я продал это здесь'}>
                  {i18n.language === 'uz' ? 'Shu yerda sotdim' : 'Я продал это здесь'}
                </Radio>
                <Radio style={radioStyle} value={2} id={i18n.language === 'uz' ? 'Fikrimdan qaytdim' : 'Я передумал'}>
                    {i18n.language === 'uz' ? 'Fikrimdan qaytdim' : 'Я передумал'}
                </Radio>
                <Radio style={radioStyle} value={3} id={i18n.language === 'uz' ? 'Boshqa' : 'Другой'}>
                    {i18n.language === 'uz' ? 'Boshqa' : 'Другой'}
                </Radio>
              </Radio.Group>
              </div>
            </div>
            {value === 3 && (
              <div className='form-item'>
                <div className='form-item__input'>
                  <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder={i18n.language === 'uz' ? 'Iltimos sababini kiriting' : 'Пожалуйста, укажите причину'}
                  />
                </div>
              </div>
            )}
            <div className='account-popup__btns'>
              <button onClick={() => setIsModalOpen(false)} className='account-popup__btn btn btn-grey' suppressHydrationWarning={true}>
                {t('cancel')}
              </button>
              <button
                className='account-popup__btn btn'
                suppressHydrationWarning={true}
                onClick={() => {
                  if (!!value) {
                    mutate({
                      url: url,
                      data: {
                        reason: value === 3 ? text : reasonTxt
                      }
                    })
                  }
                }}
              >
                {t('send')}
              </button>
            </div>
          </div>
        </div>
      </>
    </>
  )
}

export default DeActivate