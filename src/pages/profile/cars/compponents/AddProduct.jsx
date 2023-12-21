'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Main from '@/modules/FormFormik'
import { ContainerAll } from '@/modules/container'
import i18n from '@/services/i18n'
import { Field } from 'formik'
import helpers from '@/services/helpers'
import trash from '../../../../img/icons/close.svg'
import { isArray } from 'lodash'
import { useRouter } from 'next/router'
import check from '@/img/icons/done.svg'
import SuccessPopup from '@/components/Modals/SuccessPopup'
import { useTranslation } from 'next-i18next'
import { Select } from 'antd'
import { useGetOne } from '@/hooks/crud'

const AddProduct = ({ data, getUrl, postUrl, method, tabHandler }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [status, setStatus] = useState(false)
  const [responseMessage, setResponseMessage] = useState({})
  const [errors, setErrors] = useState({})

  const { t } = useTranslation('translation')

  const countDown = response => {
    let secondsToGo = 3
    setResponseMessage(response)
    setStatus(true)

    const timer = setInterval(() => {
      secondsToGo -= 1
    }, 1000)

    setTimeout(() => {
      clearInterval(timer)
      setStatus(false)
      setResponseMessage({})
    }, secondsToGo * 1000)
  }

  const [images, setImages] = useState(
    data?.images?.map(item => {
      return { file_url: item }
    }) || []
  )

  const router = useRouter()

  const imageUpload = async data => {
    const response = await helpers.uploadImage(data)
    if (response?.data) {
      setImages([...images, response.data])
    }
  }

  const removeImage = key => {
    setImages(prev => prev.filter(item => item.file_url !== key))
  }

  const succesModalHandler = () => {
    setIsModalOpen(false)
    setImages([])
    router.push('/profile')
  }

  return (
    <>
      {status && <SuccessPopup responseMessage={responseMessage} />}
      <ContainerAll url={getUrl} name={getUrl} auth={true}>
        {({ items }) => {
          return items ? (
            <Main
              method={method}
              url={postUrl}
              fields={[
                ...items?.items?.map(field => {
                  return !data
                    ? {
                        name: field.key,
                        type: field.input_type === 'checkbox' ? 'array' : 'string',
                        required: field.key=== 'model' ? false : true,
                        onSubmitValue: value => (field.key === 'year' ? value + '-01-01' : value)
                      }
                    : {
                        name: field.key,
                        type: field.input_type === 'checkbox' ? 'array' : 'string',
                        required: field.key=== 'model' ? false : true,
                        value: isArray(data?.[field?.key])
                          ? field?.input_type === 'checkbox'
                            ? data?.[field.key]?.map(el => el.id)
                            : data?.[field.key]?.[0]?.id
                          : field.key === 'year'
                          ? data?.[field.key]?.split('-')?.[0]
                          : data?.[field.key],
                        onSubmitValue: value =>
                          field.key === 'year' ? (value.length > 4 ? value : value + '-01-01') : value
                      }
                }),
                {
                  name: 'images',
                  //   required: !Boolean(images.length > 0),
                  onSubmitValue: () => images.map(image => image.file_url)
                },
                {
                  name: 'reduced_images',
                  // required: true,
                  onSubmitValue: () => images.map(image => image.versatil_url)
                },
                {
                  name: 'market',
                  onSubmitValue: () => router.query.storySlug || null
                }
              ]}
              onSuccess={(data, resetForm) => {
                setIsModalOpen(true)
                resetForm()
              }}
              onError={error => {
                setErrors(error.response.data)
                countDown({
                  message: 'Xatolik yuz berdi !'
                })
              }}
            >
              {({ setFieldValue, errors: formErrors, touched, values }) => {
                console.log(formErrors)
                return (
                  <div className='account-add'>
                    <h2 className='account-main__title'>{t('addAdv')}</h2>
                    <div className='account-form'>
                      {items?.items?.map(item =>
                        item?.input_type === 'select' ? (
                          item.key !== 'model' ? (
                            <div className='form-item' key={item.key}>
                              <div className='form-item__name'>{item?.name[i18n.language]}</div>
                              <div className='form-item__input'>
                                <select
                                  defaultValue={data ? data[item.key]?.[0]?.id : 0}
                                  style={
                                    formErrors?.[item.key] && touched?.[item.key]
                                      ? { border: '1px solid #FF4D4F' }
                                      : { border: '1px solid #4e5059' }
                                  }
                                  onChange={value => {
                                    setFieldValue(item.key, +value.target.value)
                                  }}
                                >
                                  <option value={0}>{item?.name[i18n.language]}</option>
                                  {item?.values?.map(value => (
                                    <option value={String(value.id)} key={value.id}>
                                      {value?.label[`label_${i18n.language}`]}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          ) : (
                            values.marka && (
                              <ContainerAll url={`/brend/model/${values.marka}/list/`}>
                                {({ data: modelData }) => {
                                  return (
                                    !!modelData?.data?.length && (
                                      <div className='form-item' key={item.key}>
                                        <div className='form-item__name'>{item?.name[i18n.language]}</div>
                                        <div className='form-item__input'>
                                          <select
                                            defaultValue={data ? data[item.key]?.[0]?.id : 0}
                                            style={
                                              formErrors?.[item.key] && touched?.[item.key]
                                                ? { border: '1px solid #FF4D4F' }
                                                : { border: '1px solid #4e5059' }
                                            }
                                            onChange={value => {
                                              setFieldValue(item.key, +value.target.value)
                                            }}
                                          >
                                            <option value={0}>{item?.name[i18n.language]}</option>
                                            {modelData?.data?.map(value => (
                                              <option value={String(value.id)} key={value.id}>
                                                {value?.label[`label_${i18n.language}`]}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>
                                    )
                                  )
                                }}
                              </ContainerAll>
                            )
                          )
                        ) : item?.input_type === 'textarea' ? (
                          <div
                            className='form-item'
                            style={{
                              width: '100%'
                            }}
                            key={item.key}
                          >
                            <div className='form-item__name'>{item?.name[i18n.language]}</div>
                            <div className='form-item__input'>
                              <Field
                                as={item?.input_type}
                                placeholder={item?.name[i18n.language]}
                                name={item.key}
                                style={
                                  formErrors?.[item.key] && touched?.[item.key]
                                    ? { border: '1px solid #FF4D4F' }
                                    : { border: '1px solid #4e5059' }
                                }
                              />
                            </div>
                          </div>
                        ) : item?.input_type === 'checkbox' ? (
                          <div className={formErrors?.[item.key] && touched?.[item.key] ? 'ant-select-required' : 'ant-select-default'} style={
                            formErrors?.[item.key] && touched?.[item.key]
                              ? { border: '1.6px solid #FF4D4F' }
                              : { border: 'transparent' }
                          }>
                            <Select
                              mode='multiple'
                              allowClear
                              title={item?.name[i18n.language]}
                              placeholder={item?.name[i18n.language]}
                              defaultValue={data ? data[item.key]?.map(item => item?.id) : []}
                              bordered={true}
                              onChange={e => setFieldValue(item?.key, e)}
                              style={{marginTop: 0}}
                              options={item?.values?.map(item => {
                                return {
                                  label: item.label?.[`label_${i18n.language}`],
                                  value: item.id
                                }
                              })}
                            />
                          </div>
                        ) : (
                          <div className='form-item' key={item.key}>
                            <div className='form-item__name'>{item?.name[i18n.language]}</div>
                            <div className='form-item__input'>
                              <Field
                                type={item?.key === 'year' ? 'number' : item?.input_type}
                                placeholder={item?.name[i18n.language]}
                                name={item.key}
                                style={
                                  formErrors?.[item.key] && touched?.[item.key]
                                    ? { border: '1px solid #FF4D4F' }
                                    : { border: '1px solid #4e5059' }
                                }
                              />
                            </div>
                          </div>
                        )
                      )}
                      <div className='form-file'>
                        {images?.map((image, i) => (
                          <div
                            className='form-file__img'
                            style={{
                              display: 'flex',
                              flexDirection: 'row'
                            }}
                            key={i}
                          >
                            <Image
                              src={trash}
                              alt='img'
                              style={{
                                width: 10,
                                height: 10
                              }}
                              onClick={() => removeImage(image.file_url)}
                            />
                            <Image src={image.file_url} width={166} height={112} alt='img' key={image.file_url} />
                          </div>
                        ))}

                        <label
                          htmlFor='file1'
                          className='form-file__input'
                          style={
                            formErrors.images && touched.images && !Boolean(images.length > 0)
                              ? { position: 'relative', border: '1px solid #FF4D4F' }
                              : { position: 'relative', border: '1px solid #4e5059' }
                          }
                        >
                          <input type='file' id='file1' onChange={e => imageUpload(e.target.files[0])} />
                          <div style={{ flexDirection: 'column' }}>
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
                            <span style={{ textAlign: 'center' }}>{t('addImg')}</span>
                          </div>
                        </label>
                      </div>
                      <div className='form-btn'>
                        <button type='submit' className='btn btn-trans' suppressHydrationWarning={true}>
                          {t('save')}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              }}
            </Main>
          ) : (
            <div />
          )
        }}
      </ContainerAll>
      <div
        className='account-popup account-popup__delete'
        style={{ display: isModalOpen ? 'block' : 'none', zindex: 1000 }}
      >
        <div className='account-popup__content'>
          <div className='account-popup__img'>
            <Image src={check} width={100} height={100} alt='ico' />
          </div>
          <div className='account-popup__text' suppressHydrationWarning={true}>
            {t('adSuccessTitle')}
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
              onClick={succesModalHandler}
              className='account-popup__btn btn '
              style={{
                alignSelf: 'center'
              }}
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddProduct
