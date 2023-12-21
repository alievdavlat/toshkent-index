import axios from 'axios'
// import i18n from './i18n'

const production = false

export const API_URL = production ? process.env.NEXT_PUBLIC_DOMAIN || '' : 'https://apps.avtoindex.uz/api/v1'

export const api = axios.create({ baseURL: API_URL })

export const requestAuth = async ({ ...options }) => {
  const auth = window.localStorage.getItem('access-token') ? `JWT ` + window.localStorage.getItem('access-token') : ''
  api.defaults.headers.common.Authorization = auth
  //  client.defaults.headers.common.Accept = 'multipart/form-data'
  //  client.defaults.headers['Accept-language'] = i18n.language

  const onSuccess = response => {
    return response
  }
  const onError = error => {
    let status = (error.response && error.response.status) || 0
    if (status === 401) {
      window.location.href = '/profile/login'
    }
    return Promise.reject(error)
  }

  try {
    const response = await api(options)
    return onSuccess(response)
  } catch (error) {
    return onError(error)
  }
}

export const request = async ({ ...options }) => {
  const onSuccess = response => {
    return response
  }

  const onError = error => {
    return Promise.reject(error)
  }

  try {
    const response = await api(options)
    return onSuccess(response)
  } catch (error) {
    return onError(error)
  }
}
