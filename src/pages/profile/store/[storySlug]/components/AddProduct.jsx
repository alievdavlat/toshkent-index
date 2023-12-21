import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Main from '@/modules/FormFormik'
import { ContainerAll } from '@/modules/container'
import i18n from '@/services/i18n'
import { Field } from 'formik'
import helpers from '@/services/helpers'
import trash from '@/img/icons/close.svg'
import { useRouter } from 'next/router'
import check from '@/img/icons/done.svg'
import ErrorPopup from '@/components/Modals/ErrorPopup'
import { useTranslation } from 'next-i18next'

const AddProduct = ({ data, getUrl, postUrl, method, tabHandler }) => {
  const router = useRouter()
  const [images, setImages] = useState([])
  const [properties, setProperties] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [status, setStatus] = useState(false)
  const {t} = useTranslation('translation');

  const countDown = response => {
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

  const imageUpload = async data => {
    const response = await helpers.uploadImage(data)
    if (response?.data) {
      setImages(prev => [...prev, response?.data])
    }
  }
  const removeImage = key => {
    setImages(prev => prev.filter(item => item.file_url !== key))
  }

  useEffect(() => {
    if (!!data) {
      setProperties(data?.properties)
      setImages(
        data?.images?.map(item => {
          return {
            file_url: item
          }
        })
      )
    }
  }, [data])

  return (
    <>
      {status && <ErrorPopup />}
      <ContainerAll url={getUrl} name={getUrl} auth={true}>
        {({ items }) => {
          return items ? (
            <Main
              method={method}
              url={postUrl}
              fields={[
                {
                  name: 'title',
                  required: true,
                  value: data?.title || '',
                  onSubmitValue: value => value
                },
                {
                  name: 'description',
                  required: true,
                  value: data?.description || '',
                  onSubmitValue: value => value
                },
                {
                  name: 'price',
                  required: true,
                  value: data?.price || 0,
                  onSubmitValue: value => value
                },
                {
                  name: 'phone_number',
                  required: true,
                  value: data?.phone_number || '',
                  onSubmitValue: value => value
                },
                {
                  name: 'images',
                  required: !Boolean(images.length > 0),
                  onSubmitValue: () => images.map(image => image?.file_url)
                },

                {
                  name: 'properties',
                  onSubmitValue: () => properties
                },
                {
                  name: 'market',
                  onSubmitValue: () => router.query.storySlug
                }

                //   ...items?.fields?.map(field => {
                //     return {
                //       name: 'properties.' + field.slug,
                //       required: true,
                //       onSubmitValue: value => value
                //     }
                //   })
              ]}
              onSuccess={(data, resetForm) => {
                setIsModalOpen(true)
                resetForm()
              }}
              onError={error => {
                countDown();
              }}
            >
              {({
                handleSubmit,
                submitForm,
                values,
                isSubmitting,
                setFieldValue,
                setFieldError,
                setFieldTouched,
                isSuccess,
                isLoading,
                errors,
                touched
              }) => {
                return (
                  <div className='account-add'>
                    <h2 className='account-main__title' suppressHydrationWarning={true}>{t('addAdv')}</h2>
                    <div className='account-form'>
                      <div className='form-item'>
                        <div className='form-item__name' suppressHydrationWarning={true}>{t('title')}</div>
                        <div className='form-item__input'>
                          <Field 
                            type='string' 
                            placeholder={i18n.language == 'uz' ? "Title kiriting" : "Введите название"}
                            name={'title'}
                            style={errors.title && touched.title ? {border: '1px solid #FF4D4F'} : {border: '1px solid #B7B7B7'}}
                          />
                        </div>
                      </div>
                      <div className='form-item'>
                        <div className='form-item__name' suppressHydrationWarning={true}>{t('price')}</div>
                        <div className='form-item__input'>
                          <Field 
                            type='number' 
                            placeholder={i18n.language == 'uz' ? 'Narxini kiriting' : 'Введите цену'}
                            name='price'
                            style={errors.price && touched.price ? {border: '1px solid #FF4D4F'} : {border: '1px solid #B7B7B7'}}
                          />
                        </div>
                      </div>
                      <div className='form-item'>
                        <div className='form-item__name' suppressHydrationWarning={true}>{t('phoneNumber')}</div>
                        <div className='form-item__input'>
                          <Field 
                            type='string' 
                            placeholder={i18n.language == 'uz' ? 'Telefon nomerni kiriting' : 'Введите номер телефона'}
                            name='phone_number'
                            style={errors.phone_number && touched.phone_number ? {border: '1px solid #FF4D4F'} : {border: '1px solid #B7B7B7'}}
                          />
                        </div>
                      </div>
                      <div className='form-item'>
                        <div className='form-item__name' suppressHydrationWarning={true}>{t('information')}</div>
                        <div className='form-item__input'>
                          <Field 
                            as='textarea' 
                            placeholder={i18n.language == 'uz' ? 'Ma`lumot kiriting' : 'Введите информацию'}
                            name='description'
                            style={errors.description && touched.description ? {border: '1px solid #FF4D4F'} : {border: '1px solid #B7B7B7'}}
                          />
                        </div>
                      </div>
                      {items?.fields?.map(item =>
                        item?.input_type === 'Select' ? (
                          <div className='form-item' key={item.slug}>
                            <div className='form-item__name'>{item?.properties?.label[`label_${i18n.language}`]}</div>
                            <div className='form-item__input'>
                              <select
                                defaultValue={properties?.[item?.slug] || 0}
                                onChange={value => {
                                  // setFieldValue('properties.' + item.slug, +value.target.value)
                                  setProperties({ ...properties, [item.slug]: +value.target.value })
                                }}
                              >
                                <option value={0}>{item?.properties?.label[`label_${i18n.language}`]}</option>
                                {item?.properties.values?.map(value => (
                                  <option value={value.value} key={value.value}>
                                    {value?.label[`label_${i18n.language}`]}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ) : item?.input_type === 'textarea' ? (
                          <div className='form-item' key={item.slug}>
                            <div className='form-item__name'>{item?.properties?.label[`label_${i18n.language}`]}</div>
                            <div className='form-item__input'>
                              <textarea
                                value={properties[item.slug]}
                                onChange={value => setProperties({ ...properties, [item.slug]: value.target.value })}
                                placeholder={item?.properties?.label[`label_${i18n.language}`]}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className='form-item' key={item.slug}>
                            <div className='form-item__name'>{item?.properties?.label[`label_${i18n.language}`]}</div>
                            <div className='form-item__input'>
                              <input
                                type={item?.input_type}
                                placeholder={item?.properties?.label[`label_${i18n.language}`]}
                                value={properties?.[item?.slug]}
                                onChange={value => setProperties({ ...properties, [item?.slug]: value.target.value })}
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
                          style={errors.images && touched.images && !Boolean(images.length > 0) ? {position: 'relative', border: '1px solid #FF4D4F'} : {position: 'relative', border: '1px solid #B7B7B7'}}
                        >
                          <input type='file' id='file1' onChange={e => imageUpload(e.target.files[0])} />
                          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
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
                            <span suppressHydrationWarning={true} style={{textAlign: 'center'}}>{t('addImg')}</span>
                          </div>
                        </label>
                      </div>
                      <div className='form-btn'>
                        <button type='submit' className='btn btn-trans' suppressHydrationWarning={true}>
                          {t("save")}
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
          <div className='account-popup__text' suppressHydrationWarning={true}>{t('adSuccessTitle')}</div>
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
                setIsModalOpen(false), setImages([])
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

export default AddProduct
