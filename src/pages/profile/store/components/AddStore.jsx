'use client'

import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Field } from 'formik'
import Image from 'next/image'
import { TimePicker } from 'antd'
import i18n from '@/services/i18n'
import Fields from '@/components/Fields'
import Main from '@/modules/FormFormik'
import helpers from '@/services/helpers'
import check from '@/img/icons/done.svg'
import { useTranslation } from 'next-i18next'
import OkSvg from '@/components/SvgFiles/OkSvg'
import VkSvg from '@/components/SvgFiles/VkSvg'
import { ContainerAll } from '@/modules/container'
import YouTube from '@/components/SvgFiles/YouTube'
import Telegram from '@/components/SvgFiles/Telegram'
import Facebook from '@/components/SvgFiles/Facebook'
import ErrorPopup from '@/components/Modals/ErrorPopup'
import Instagram from '@/components/SvgFiles/Instagram'

function AddStore({ data, getUrl, postUrl, method, tabHandler }) {
  const [category, setCategory] = useState(null)
  const [subCategory, setSubCategory] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [status, setStatus] = useState(false)
  const { t } = useTranslation('translation')
  
  const [times, setTimes] = useState([
    {
      time: {
        open: '09:00',
        close: '19:00'
      },
      title_uz: 'Du',
      title_ru: 'Пн',
    },
    {
      time: {
        open: '09:00',
        close: '19:00'
      },
      title_uz: 'Se',
      title_ru: 'Вт'
    },
    {
      time: {
        open: '09:00',
        close: '19:00'
      },
      title_uz: 'Ch',
      title_ru: 'Ср'
    },
    {
      time: {
        open: '09:00',
        close: '19:00'
      },
      title_uz: 'Pa',
      title_ru: 'Чт'
    },
    {
      time: {
        open: '09:00',
        close: '19:00'
      },
      title_uz: 'Ju',
      title_ru: 'Пт'
    },
    {
      time: {
        open: '09:00',
        close: '19:00'
      },
      title_uz: 'Sh',
      title_ru: 'Сб'
    },
    {
      time: {
        open: '09:00',
        close: '19:00'
      },
      title_uz: 'Ya',
      title_ru: 'Вс'
    }
  ])

  const countDown = () => {
    let secondsToGo = 3
    setStatus(true)

    const timer = setInterval(() => {
      secondsToGo -= 1
    }, 1000)

    setTimeout(() => {
      clearInterval(timer)
      setStatus(false)
    }, secondsToGo * 1000)
  }

  const uploadLogo = async (data, cb) => {
    const response = await helpers.uploadImage(data)
    if (response?.data) {
      cb('logo', response.data?.file_url)
    }
  }

  useEffect(() => {
    if (!!data) {
      setCategory(data?.category)
      setTimes(data?.schudale?.items)
    }
  }, [data])

  const uploadBanner = async (data, cb) => {
    const response = await helpers.uploadImage(data)
    if (response?.data) {
      cb('background_image', response.data?.file_url)
    }
  }

  return (
    <>
      {status && <ErrorPopup />}
      <Main
        method={method}
        url={postUrl}
        fields={[
          {
            name: 'store_name',
            required: false,
            value: data?.store_name || '',
            onSubmitValue: value => value
          },
          {
            name: 'category',
            required: true,
            value: data?.category?.id || '',
            onSubmitValue: value => value
          },
          {
            name: 'title',
            required: true,
            value: data?.title || '',
            onSubmitValue: value => value
          },
          {
            name: 'sub_title',
            required: true,
            value: data?.sub_title || '',
            onSubmitValue: value => value
          },
          {
            name: 'floor',
            required: true,
            value: data?.floor || '',
            onSubmitValue: value => value
          },
          {
            name: 'network',
            required: false,
            value: data?.network || '',
            onSubmitValue: value => value
          },
          {
            name: 'phone_number',
            required: true,
            value: data?.phone_number || '',
            onSubmitValue: value => value
          },
          {
            name: 'block',
            required: true,
            value: data?.block || '',
            onSubmitValue: value => value
          },
          {
            name: 'social_network',
            type: 'object',
            required: false,
            value: data?.social_network || {},
            onSubmitValue: value => value
          },
          {
            name: 'description',
            required: true,
            value: data?.description || '',
            onSubmitValue: value => value
          },
          {
            name: 'logo',
            value: data?.logo || '',
            required: 'banner is required',
            onSubmitValue: value => value
          },
          {
            name: 'background_image',
            value: data?.background_image || '',
            required: 'banner is required',
            //   value: banner,
            onSubmitValue: value => value
          },
          {
            name: 'schudale',
            type: 'object',
            value: data?.schudale || { items: times },
            onSubmitValue: value => value
          }
        ]}
        onSuccess={(data, resetForm) => {
          if (data) {
            setIsModalOpen(true)
          }
        }}
        onError={error => {
          countDown()
        }}
      >
        {({ errors, touched, values, handleSubmit, setFieldValue }) => {

          return (
            <div className='account-add account-shop'>
              <h2 className='account-main__title' suppressHydrationWarning={true}>
                {t('addStore')}
              </h2>
              <div className='account-form'>
                {!data ? (
                  <ContainerAll url={getUrl} name={getUrl} auth={true}>
                    {({ items }) => {
                      return items ? (
                        <>
                          <div className='account-form__name'>
                            {i18n.language == 'uz' ? 'Kategoriya tanlang' : 'Выберите категорию'}
                          </div>
                          <div className='account-form__choose'>
                            {items?.items?.map(item => (
                              <label htmlFor={item.slug} key={item.id}>
                                <input
                                  type='radio'
                                  name='choose'
                                  id={item.slug}
                                  onChange={() => {
                                    setCategory(item)
                                    setFieldValue('category', item.id)
                                    if (category?.id !== item?.id) {
                                      setSubCategory(null)
                                    }
                                  }}
                                />
                                <div>
                                  <Image src={item?.icon} width={100} height={100} alt='ico' />
                                  <span>{item.title[`title_${i18n.language}`]}</span>
                                </div>
                              </label>
                            ))}
                          </div>
                          {category?.children?.length > 0 && (
                            <>
                              <div className='account-form__name'>
                                {i18n.language == 'uz'
                                  ? 'Do’kon hizmat turini tanlang'
                                  : 'Выберите тип услуги магазина'}
                              </div>
                              <div className='account-form__choose'>
                                {category?.children?.map(item => (
                                  <label htmlFor={item.slug} key={item.id}>
                                    <input
                                      type='radio'
                                      name='choose2'
                                      id={item.slug}
                                      onChange={() => {
                                        setSubCategory(item)
                                        setFieldValue('category', item.id)
                                      }}
                                    />
                                    <div>
                                      <Image src={item?.icon} width={40} height={40} alt='ico' />
                                      <span>{item.title[`title_${i18n.language}`]}</span>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <div />
                      )
                    }}
                  </ContainerAll>
                ) : (
                  <>
                    <div className='account-form__name'>{i18n.language == 'uz' ? 'Kategoriya' : 'Категория'}</div>
                    <div className='account-form__choose'>
                      <label htmlFor={category?.icon}>
                        <input type='radio' name='choose' id={category?.icon} checked />
                        <div>
                          {category?.icon && <Image src={category?.icon} width={40} height={40} alt='ico' />}
                          <span>{category?.title[`title_${i18n.language}`]}</span>
                        </div>
                      </label>
                    </div>
                  </>
                )}

                <div className='account-form__choose'>
                  <div className='account-form__name'>
                    {i18n.language == 'uz'
                      ? 'Do’konga banner surat joylashtiring'
                      : 'Разместите фото баннера в магазине'}
                  </div>
                  <div className='account-form__big'>
                    <label
                      htmlFor='file5'
                      className='form-file__input'
                      style={{
                        borderColor: errors.background_image && touched.background_image ? 'red' : '#fff'
                      }}
                    >
                      {!!values?.background_image && (
                        <Image
                          src={values.background_image}
                          width={1000}
                          height={1000}
                          alt='logo'
                          style={{
                            height: '100%',
                            width: 'auto'
                          }}
                        />
                      )}

                      <input type='file' id='file5' onChange={e => uploadBanner(e.target.files[0], setFieldValue)} />
                      {!values?.background_image && (
                        <div>
                          <svg
                            width='24'
                            height='25'
                            viewBox='0 0 24 25'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M12 7.25V17.75'
                              stroke='currentColor'
                              strokeWidth='1.5'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                            <path
                              d='M17.25 12.5H6.75'
                              stroke='currentColor'
                              strokeWidth='1.5'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                          <span>
                            {i18n.language == 'uz'
                              ? 'Do’konga banner surat joylashtiring'
                              : 'Разместите фото баннера в магазине'}
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                  <div className='form-item'>
                    <div className='form-item__name'>{i18n.language == 'uz' ? 'Do`kon nomi' : 'Название магазина'}</div>
                    <div className='form-item__input'>
                      <Field 
                        name='store_name' 
                        type='text' 
                        placeholder={i18n.language == 'uz' ? 'Do`kon nomi' : 'Название магазина'}
                        size='large' 
                        style={
                          errors.store_name && touched.store_name
                            ? { border: '1px solid #FF4D4F' }
                            : { border: '1px solid #b7b7b7' }
                        }
                      />
                    </div>
                  </div>
                  <div className='form-item'>
                    <div className='form-item__name'>{i18n.language == 'uz' ? 'Do`kon raqami' : 'Номер магазина'}</div>
                    <div className='form-item__input'>
                      <Field 
                        name='title' 
                        type='text' 
                        placeholder='A-123' 
                        size='large' 
                        style={
                          errors.title && touched.title
                            ? { border: '1px solid #FF4D4F' }
                            : { border: '1px solid #b7b7b7' }
                        }
                      />
                    </div>
                  </div>
                  <div className='form-item form-item__subtitle'>
                    <div className='form-item__name'>{i18n.language == 'uz' ? 'Subtitle' : 'Субтитры'}</div>
                    <div className='form-item__input'>
                      <Field
                        name='sub_title'
                        type='text'
                        placeholder={i18n.language == 'uz' ? 'Subtitleni kiriting' : 'Введите субтитры'}
                        size='large'
                        style={
                          errors.sub_title && touched.sub_title
                            ? { border: '1px solid #FF4D4F' }
                            : { border: '1px solid #b7b7b7' }
                        }
                      />
                    </div>
                  </div>
                  <div className='form-item form-item__subtitle'>
                    <div className='form-item__name'>{i18n.language == 'uz' ? 'Qavat' : 'Этаж'}</div>
                    <div className='form-item__input'>
                      <Field
                        name='floor'
                        type='number'
                        placeholder={i18n.language == 'uz' ? 'Qavat raqamini kiriting' : 'Введите номер этажа'}
                        size='large'
                        style={
                          errors.floor && touched.floor
                            ? { border: '1px solid #FF4D4F' }
                            : { border: '1px solid #b7b7b7' }
                        }
                      />
                    </div>
                  </div>
                  <div className='form-item'>
                    <div className='form-item__name'>{i18n.language == 'uz' ? 'Blog' : 'Блог'}</div>
                    <div className='form-item__input'>
                      <select
                        placeholder={i18n.language == 'uz' ? 'Blogni tanlang' : 'Выберите блог'}
                        defaultValue={data ? data?.block : 0}
                        // style={formErrors?.[item.key] && touched?.[item.key] ? {border: '1px solid #FF4D4F'} : {border: '1px solid #B7B7B7'}}
                        onChange={elem => {
                          setFieldValue('block', elem.target.value)
                        }}
                        style={
                          errors.block && touched.block
                            ? { border: '1px solid #FF4D4F' }
                            : { border: '1px solid #b7b7b7' }
                        }
                      >
                        <option value={0}>{i18n.language == 'uz' ? 'Blogni tanlang' : 'Выберите блог'}</option>
                        {helpers.blockList.map((optionItem, idx) => (
                          <option value={optionItem.value} key={idx}>
                            {optionItem.value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className='form-item'>
                    <div className='form-item__name'>{i18n.language == 'uz' ? 'Telefon raqami' : 'Номер телефона'}</div>
                    <div className='form-item__input'>
                      <Field
                        type={'text'}
                        component={Fields.InputMaskField}
                        mask='+\9\9\8999999999'
                        maskChar={''}
                        name='phone_number'
                        customclass='form_tel'
                        placeholder='+998 _ _  _ _ _  _ _  _ _'
                        style={
                          errors.phone_number && touched.phone_number
                            ? { border: '1px solid #FF4D4F' }
                            : { border: '1px solid #b7b7b7' }
                        }
                      />
                    </div>
                  </div>
                  <div className='form-item'>
                    <div className='form-item__name'>{i18n.language == 'uz' ? 'Veb sayt' : 'Веб-сайт'}</div>
                    <div className='form-item__input'>
                      <Field
                        name='network'
                        type='text'
                        placeholder={i18n.language == 'uz' ? 'Tarmoq havolasini kiriting' : 'Введите сетевую ссылку'}
                        size='large'
                      />
                    </div>
                  </div>
                  <div className='form-item'>
                    <div className='form-item__name'>{i18n.language == 'uz' ? 'Facebook' : 'Facebook'}</div>
                    <div className='form-item__input form-item__box'>
                      <div className='social-svg-icon'>
                        <Facebook />
                      </div>
                      <Field
                        name='social_network.facebook'
                        defaultValue={data?.social_network.facebook || ''}
                        type='text'
                        placeholder={i18n.language == 'uz' ? 'Havolani kiriting' : 'Введите ссылку'}
                        size='large'
                      />
                    </div>
                  </div>
                  <div className='form-item'>
                    <div className='form-item__name'>{i18n.language == 'uz' ? 'Instagram' : 'Instagram'}</div>
                    <div className='form-item__input form-item__box'>
                      <div className='social-svg-icon'>
                        <Instagram />
                      </div>
                      <Field
                        name='social_network.instagram'
                        defaultValue={data?.social_network.instagram || ''}
                        type='text'
                        placeholder={i18n.language == 'uz' ? 'Havolani kiriting' : 'Введите ссылку'}
                        size='large'
                      />
                    </div>
                  </div>
                  <div className='social_network form-item'>
                    <div className='form-item__name'>{i18n.language == 'uz' ? 'OK' : 'OK'}</div>
                    <div className='form-item__input form-item__box'>
                      <div className='social-svg-icon'>
                        <OkSvg />
                      </div>
                      <Field
                        name='social_network.ok'
                        type='text'
                        defaultValue={data?.social_network.ok || ''}
                        // value={data?.social_network?.ok || ''}
                        // onChange={e => setFieldValue('social_network.ok')}
                        placeholder={i18n.language == 'uz' ? 'Havolani kiriting' : 'Введите ссылку'}
                        size='large'
                      />
                    </div>
                  </div>
                  <div className='form-item'>
                    <div className='form-item__name'>{i18n.language == 'uz' ? 'YouTube' : 'YouTube'}</div>
                    <div className='form-item__input form-item__box'>
                      <div className='social-svg-icon'>
                        <YouTube />
                      </div>
                      <Field
                        name='social_network.youtube'
                        defaultValue={data?.social_network.youtube || ''}
                        type='text'
                        placeholder={i18n.language == 'uz' ? 'Havolani kiriting' : 'Введите ссылку'}
                        size='large'
                      />
                    </div>
                  </div>
                  <div className='form-item'>
                    <div className='form-item__name'>{i18n.language == 'uz' ? 'Telegram' : 'Telegram'}</div>
                    <div className='form-item__input form-item__box'>
                      <div className='social-svg-icon'>
                        <Telegram />
                      </div>
                      <Field
                        name='social_network.telegram'
                        defaultValue={data?.social_network.telegram || ''}
                        type='text'
                        placeholder={i18n.language == 'uz' ? 'Havolani kiriting' : 'Введите ссылку'}
                        size='large'
                      />
                    </div>
                  </div>
                  <div className='form-item'>
                    <div className='form-item__name'>{i18n.language == 'uz' ? 'VK' : 'Vk'}</div>
                    <div className='form-item__input form-item__box'>
                      <div className='social-svg-icon'>
                        <VkSvg />
                      </div>
                      <Field
                        name='social_network.vk'
                        defaultValue={data?.social_network.vk || ''}
                        type='text'
                        placeholder={i18n.language == 'uz' ? 'Havolani kiriting' : 'Введите ссылку'}
                        size='large'
                      />
                    </div>
                  </div>
                  <div className='form-item form-item__desc'>
                    <div className='form-item__name'>{i18n.language == 'uz' ? 'Tavsif' : 'Описание'}</div>
                    <div className='form-item__input'>
                      <Field
                        as='textarea'
                        name='description'
                        type='text'
                        placeholder={i18n.language == 'uz' ? 'Tavsifni kiriting' : 'Введите описание'}
                        size='large'
                        style={
                          errors.description && touched.description
                            ? { border: '1px solid #FF4D4F' }
                            : { border: '1px solid #b7b7b7' }
                        }
                      />
                    </div>
                  </div>
                  <div className='account-form__name'>
                    {i18n.language == 'uz' ? 'Ish kunlarini kiriting' : 'Введите рабочие дни'}
                  </div>
                  <div className='account-form__days'>
                    {values?.schudale?.items?.map(time => (
                      <div className='account-form__day' key={time.title}>
                        <p>{time.title || time[`title_${i18n.language}`]}</p>
                        <div className='form-item__input'>
                          <TimePicker
                            // defaultValue={moment(time?.time?.open, 'HH:mm')}
                            value={moment(time?.time?.open, 'HH:mm')}
                            format={'HH:mm'}
                            // placeholder={'09:00'}
                            allowClear={false}
                            showNow={false}
                            onOk={val => {
                              setFieldValue('schudale', {
                                items: values?.schudale?.items?.map(el => {
                                  if (el.title === 'uz' || 'ru') {
                                      return (
                                        el.title === time.title
                                      ? { ...el, time: { ...el.time, open: moment(val).format('HH:mm') } }
                                      : el
                                      )
                                  }
                                  
                                  if (el[`title_${i18n.language}`] === time[`title_${i18n.language}`]) {
                                    return (
                                      el[`title_${i18n.language}`] === time[`title_${i18n.language}`]
                                    ? { ...el, time: { ...el.time, open: moment(val).format('HH:mm') } }
                                    : el
                                    )
                                  }
                                })
                              })
                            }}
                          />
                        </div>
                        <div className='form-item__input'>
                          <TimePicker
                            // defaultValue={moment(time?.time?.close, 'HH:mm')}
                            value={moment(time?.time?.close, 'HH:mm')}
                            format={'HH:mm'}
                            allowClear={false}
                            showNow={false}
                            // placeholder={'19:00'}
                            onOk={val => {
                              setFieldValue('schudale', {
                                items: values?.schudale?.items?.map(el => {
                                  if (el.title === 'uz' || 'ru') {
                                    return (
                                      el.title === time.title
                                      ? { ...el, time: { ...el.time, close: moment(val).format('HH:mm') } }
                                      : el
                                    )
                                  } 
                                  if (el[`title_${i18n.language}`] === time[`title_${i18n.language}`]) {
                                      return (
                                        el[`title_${i18n.language}`] === time[`title_${i18n.language}`]
                                        ? { ...el, time: { ...el.time, close: moment(val).format('HH:mm') } }
                                        : el
                                      )
                                  }
                                })
                              })
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className='form-file account-form__file'>
                    <label
                      htmlFor='file1'
                      className='form-file__input'
                      style={{
                        borderColor: errors.logo && touched.logo ? 'red' : '#fff'
                      }}
                    >
                      {!!values?.logo && (
                        <Image
                          src={values?.logo}
                          width={1000}
                          height={1000}
                          style={{
                            width: '100%',
                            height: '100%'
                          }}
                          alt='logo'
                        />
                      )}
                      <input type='file' id='file1' onChange={e => uploadLogo(e.target.files[0], setFieldValue)} />
                      {!values?.logo && (
                        <div>
                          <svg
                            width='24'
                            height='25'
                            viewBox='0 0 24 25'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M12 7.25V17.75'
                              stroke='currentColor'
                              strokeWidth='1.5'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                            <path
                              d='M17.25 12.5H6.75'
                              stroke='currentColor'
                              strokeWidth='1.5'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                          <span>{i18n.language == 'uz' ? 'Do’kon suratini yuklash' : 'Загрузите фото магазина'}</span>
                        </div>
                      )}
                    </label>
                  </div>
                  <div className='form-btn'>
                    <button type='button' className='btn btn-trans' onClick={handleSubmit}>
                      {t('save')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        }}
      </Main>
      <div
        className='account-popup account-popup__delete'
        style={{ display: isModalOpen ? 'block' : 'none', zindex: 1000 }}
      >
        <div className='account-popup__content'>
          <div className='account-popup__img'>
            <Image src={check} width={100} height={100} alt='ico' />
          </div>
          <div className='account-popup__text'>
            {i18n.language == 'uz' ? 'Do`kon muvaffaqiyatli yaratildi !' : 'Магазин успешно создан !'}
          </div>
          <div
            className='account-popup__btns'
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <button
              onClick={() => {
                setIsModalOpen(false)
                tabHandler()
              }}
              className='account-popup__btn btn '
              style={{
                alignSelf: 'center'
              }}
            >
              Ok
            </button>
            {/* <button className='account-popup__btn btn' onClick={() => mutate(url)}>
              Ha
            </button> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default AddStore
