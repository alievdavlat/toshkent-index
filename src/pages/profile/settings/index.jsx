import React, {useState} from 'react'
import Image from 'next/image'
import { ContainerAll } from '@/modules/container'
import Main from '@/modules/FormFormik'
import { Field } from 'formik'
import helpers from '@/services/helpers'
import { requestAuth } from '@/services'
import { withAdminLayout } from '@/adminLayout/AdminLayout'
import SuccessPopup from '@/components/Modals/SuccessPopup'
import ErrorPopup from '@/components/Modals/ErrorPopup'
import { get } from 'lodash'
import { currentLangCode } from '@/services/storage'
import { useTranslation } from "next-i18next";

const Settings = () => {
  const {t} = useTranslation('translation');
  const [inputType, setInputType] = useState('password');
  const [confirmInputType, setConfirmInputType] = useState('password');
  const [status, setStatus] = useState(false);
  const [responseMessage, setResponseMessage] = useState({});
  const [errorStatus, setErrorStatus] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  const countDown = (response) => {
    let secondsToGo = 3;
    setResponseMessage(response);
    setStatus(true);

    const timer = setInterval(() => {
      secondsToGo -= 1;
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      setStatus(false);
      setErrorStatus(false);
      setResponseMessage({})
    }, secondsToGo * 1000);
};

  const passwordVisibleHandler = (type) => {
      setInputType(type)
  }

  const newPasswordVisibleHandler = (type) => {
    setConfirmInputType(type)
  }

  const imageUpload = async (data, cb) => {
    const response = await helpers.uploadImage(data)
    if (response?.data) {
      cb('image', response?.data?.file_url)
    }
  }

  const sendCode = async phone => {
    const response = await requestAuth({
      url: '/auth/sms/',
      method: 'POST',
      data: {
        phone_number: phone
      }
    })
      .then(response => {
        if (response?.data) {
          countDown({
            message: currentLangCode ? 'Kod yuborildi.' : 'Код отправлен.'
          })
        }
      })
      .catch(err => {
        setErrorStatus(true);
        countDown();
      })
    return response?.data
  }

  const editPhone = async phone => {
    const response = await requestAuth({
      url: '/users/edit/',
      method: 'PUT',
      data: {
        phone_number: phone
      }
    })
      .then(response => {
        if (response?.data) {
          countDown({
            message: currentLangCode == 'uz' ? "Telefon raqami muvaffaqiyatli o'zgartirildi" : "Номер телефона успешно изменен"
          })
        }
      })
      .catch(err => {
        setErrorStatus(true);
        countDown();
      })
    return response?.data
  }

  return (
    <>
      <ContainerAll 
        url={'/users/info/'} 
        name='/users/info/' 
        auth={true}
        onSuccess={data => {
          setUserInfo(data?.data);
        }}
        >
        {({ items: data, refetch }) => {
          return (
            <>
              { status && responseMessage?.message ? <SuccessPopup responseMessage={responseMessage} /> : ''}
              { errorStatus && <ErrorPopup />}
              <Main
                method={'PUT'}
                url={'/users/edit/'}
                fields={[
                  {
                    name: 'firstname',
                    required: true,
                    value: get(userInfo, 'firstname') || '',
                    onSubmitValue: value => value
                  },
                  {
                    name: 'lastname',
                    required: true,
                    value: get(userInfo, 'lastname') || '',
                    onSubmitValue: value => value
                  },
                  {
                    name: 'image',
                    required: true,
                    value: get(userInfo, 'image') || '',
                    onSubmitValue: value => value
                  },
                  {
                    name: 'is_juridical',
                    required: true,
                    value: get(userInfo, 'is_juridical') || false,
                    onSubmitValue: value => value
                  },
                  {
                    name: 'company_name',
                    required: false,
                    value: get(userInfo, 'company_name') || '',
                    onSubmitValue: value => value
                  },
                  {
                    name: 'inn',
                    required: false,
                    value: get(userInfo, 'inn') || '',
                    onSubmitValue: value => value
                  }
                ]}
                onSuccess={(data, resetForm) => {
                  if (data) {
                    setUserInfo({
                      ...userInfo,
                      firstname: get(data, 'firstname'),
                      lastname: get(data, 'lastname')
                    })

                    countDown({
                      message: currentLangCode == 'uz' ? "Muvaffaqiyatli o'zgartirildi" : "Изменено успешно"
                    })
                    refetch();
                    resetForm();
                  }
                }}
                onError={error => {
                  setErrorStatus(true);
                  countDown();
                }}
              >
                {({ errors, touched, values, handleSubmit, setFieldValue }) => {
                  return (
                    <div className='account-add'>
                      <h2 className='account-main__title'>{t('changeProfile')}</h2>
                      <div className='account-form'>
                        <div className='form-item'>
                          <div className='form-item__name'>{t('name')}</div>
                          <div className='form-item__input'>
                            <Field 
                              name='firstname' 
                              type='text' 
                              placeholder={t('enterYourName')} 
                              size='large' 
                            />
                          </div>
                        </div>
                        <div className='form-item'>
                          <div className='form-item__name'>{t('lastName')}</div>
                          <div className='form-item__input'>
                            <Field 
                              name='lastname' 
                              type='text' 
                              placeholder={t('enterLastName')} 
                              size='large' 
                            />
                          </div>
                        </div>
                        {!!data?.is_juridical ? (
                          <>
                            <div className='form-item'>
                              <div className='form-item__name'>{t('companyName')}</div>
                              <div className='form-item__input'>
                                <Field name='company_name' type='text' placeholder='A-123' size='large' />
                              </div>
                            </div>
                            <div className='form-item'>
                              <div className='form-item__name'>{currentLangCode == 'uz' ? "INN" : "ИНН"}</div>
                              <div className='form-item__input'>
                                <Field name='inn' type='number' placeholder={currentLangCode == 'uz' ? "INN" : "ИНН"} size='large' />
                              </div>
                            </div>
                          </>
                        ) : (
                          <div />
                        )}

                        <div className='form-file form-file__profile'>
                          <div className='form-file__img'>
                            <Image src={values.image || '/userIcon.jpg'} width={166} height={112} alt='img' />
                          </div>
                          <label htmlFor='file1' className='form-file__img'>
                            <input type='file' id='file1' onChange={e => imageUpload(e.target.files[0], setFieldValue)} />
                            <div>
                              <span>{t('changeImg')}</span>
                            </div>
                          </label>
                        </div>
                        <div className='form-btn'>
                          <button type='submit' className='btn btn-trans'>{t('save')}</button>
                        </div>
                      </div>
                    </div>
                  )
                }}
              </Main>
              <br />
              <Main
                method={'post'}
                url={'/auth/sms/'}
                fields={[
                  {
                    name: 'phone_number',
                    required: true,
                    value: data?.phone_number || '',
                    onSubmitValue: value => value
                  },
                  {
                    name: 'verified_code',
                    required: true,
                    onSubmitValue: value => value
                  }
                ]}
                onSuccess={async (data, resetForm) => {
                  if (data) {
                    await editPhone(data?.phone_number)
                    resetForm()
                  }
                }}
                onError={error => {
                  setErrorStatus(true);
                  countDown();
                }}
              >
                {({values }) => {
                  return (
                    <div className='account-add'>
                      <h2 className='account-main__title'>{t('changePhoneNumber')}</h2>
                      <div className='account-form'>
                        <div className='form-item'>
                          <div className='form-item__name' suppressHydrationWarning={true}>{t('phoneNumber')}</div>
                          <div className='form-item__input'>
                            <Field name='phone_number' type='text' placeholder={t('phoneNumber')} size='large' suppressHydrationWarning={true}/>
                          </div>
                        </div>
                        <div className='form-item'>
                          <div className='form-item__name'>{currentLangCode == 'uz' ? "Kodni yuborish uchun tugmachani bosing" : "Нажмите кнопку, чтобы отправить код"}</div>
                          <div className='form-item__input'>
                            <button onClick={() => sendCode(values.phone_number)} className='btn btn-trans'>
                              {t('getCode')}
                            </button>
                          </div>
                        </div>
                        <div className='form-item'>
                          <div className='form-item__name'>{currentLangCode == 'uz' ? 'Kodni kiriting' : 'Введите код'}</div>
                          <div className='form-item__input'>
                            <Field name='verified_code' type='text' placeholder={currentLangCode == 'uz' ? 'Kodni kiriting' : 'Введите код'} size='large' />
                          </div>
                        </div>
                        <div className='form-btn'>
                          <button className='btn btn-trans'>{t('send')}</button>
                        </div>
                      </div>
                    </div>
                  )
                }}
              </Main>
              <br />
              <Main
                method={'post'}
                url={'/users/change-password/'}
                fields={[
                  {
                    name: 'old_password',
                    required: true,
                    onSubmitValue: value => value
                  },
                  {
                    name: 'new_password',
                    required: true,
                    onSubmitValue: value => value
                  }
                ]}
                onSuccess={(data, resetForm) => {
                  countDown({
                    message: currentLangCode == 'uz' ? "Kod muvaffaqiyatli o'zgartirildi" : "Код успешно изменен"
                  })
                  resetForm()
                }}
                onError={error => {
                  setErrorStatus(true);
                  countDown();
                }}
              >
                {({ errors, touched, values, handleSubmit, setFieldValue }) => {
                  return (
                    <div className='account-add'>
                      <h2 className='account-main__title'>{t('changePassword')}</h2>
                      <div className='account-form'>
                        <div className='form-item'>
                          <div className='form-item__name'>{t('password')}</div>
                          <div className='form-item__input eye-control'>
                            <Field name='old_password' type={inputType} placeholder={t('password')} size='large' />
                              { inputType === 'text' ? 
                                  <div className='eye' onClick={() => passwordVisibleHandler('password')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                                    </svg>
                                  </div>
                                  :
                                  <div className='slash-eye' onClick={() => passwordVisibleHandler('text')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                                        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                                        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                                        <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                                    </svg>
                                </div> 
                              } 
                          </div>
                        </div>
                        <div className='form-item'>
                          <div className='form-item__name'>{t('newPassword')}</div>
                          <div className='form-item__input eye-control'>
                            <Field name='new_password' type={confirmInputType} placeholder={t('newPassword')} size='large' />
                            { confirmInputType === 'text' ? 
                                  <div className='eye' onClick={() => newPasswordVisibleHandler('password')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                                    </svg>
                                  </div>
                                  :
                                  <div className='slash-eye' onClick={() => newPasswordVisibleHandler('text')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                                        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                                        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                                        <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                                    </svg>
                                </div> 
                              }  
                          </div>
                        </div>
                        <div className='form-btn'>
                          <button className='btn btn-trans'>{t('save')}</button>
                        </div>
                      </div>
                    </div>
                  )
                }}
              </Main>
              <br />
            </>
          )
        }}
      </ContainerAll>
    </>
  )
}

export default withAdminLayout(Settings);
