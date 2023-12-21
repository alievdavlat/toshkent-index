import { request } from '../api'
import ProcessImg from '@/img/icons/process.svg'
import Check from '@/img/icons/check-black.svg'
import Close from '@/img/icons/close.svg'

const chunk = (arr, _start, _amount) => {
  let result = []

  const chunkMap = {
    start: _start || 0,
    amount: _amount || 500,
    len: arr.length
  }

  do {
    result.push(arr.slice(chunkMap['start'], chunkMap['start'] + chunkMap['amount']))
    chunkMap['start'] += chunkMap['amount']
  } while (chunkMap['start'] < chunkMap['len'])

  return result
}

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

const formatDate = (date, format) => {
  let dt = new Date(date)
  let month = ('00' + (dt.getMonth() + 1)).slice(-2)
  let day = ('00' + dt.getDate()).slice(-2)
  let year = dt.getFullYear()
  let hours = ('00' + dt.getHours()).slice(-2)
  let minutes = ('00' + dt.getMinutes()).slice(-2)
  let seconds = ('00' + dt.getSeconds()).slice(-2)

  switch (format) {
    case 'DD-MM-YYYY':
      return day + '-' + month + '-' + year
    case 'DD.MM.YYYY / HH:mm:ss':
      return day + '.' + month + '.' + year + ' / ' + hours + ':' + minutes + ':' + seconds
    case 'DD.MM.YYYY / HH:mm':
      return day + '.' + month + '.' + year + ' / ' + hours + ':' + minutes
    case 'HH:mm / DD.MM.YYYY':
      return hours + ':' + minutes + ' / ' + day + '.' + month + '.' + year
    default:
      return day + '.' + month + '.' + year
  }
}

const convertToReadable = number => {
  if (number !== 0 && !number) return null

  function isFloat(n) {
    return Number(n) === n && n % 1 !== 0
  }

  let newValue
  if (isFloat(Number(number))) {
    newValue = number.toString().split('.')
    newValue[0] = newValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    newValue = newValue.join('.')
  } else {
    newValue = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  return newValue
}

const uploadImage = async file => {
  if (!file) {
    window.alert('File not found')
    return
  }
  let data = new FormData()
  data.append('file', file)
  const response = await request({
    url: 'file/upload/',
    method: 'POST',
    data: data,
    headers: {
      'content-type': file.type
    }
  })
  return response.data
}

const createStatus = status => {
  if (status === 1) {
    return {
      icon: ProcessImg,
      text: 'Protsesda',
      class: 'process'
    }
  } else if (status === 2) {
    return {
      icon: Close,
      text: 'Xatolik',
      class: 'error'
    }
  } else if (status === 4) {
    return {
      icon: Check,
      text: 'Faol',
      class: 'active'
    }
  } else if (status === 6) {
    return {
      icon: Close,
      text: 'Faol emas',
      class: 'error'
    }
  }
}

const blockList = [
  {
    value: 'A1',
    label: 'A1'
  },
  {
    value: 'A2',
    label: 'A2'
  },
  {
    value: 'A3',
    label: 'A3'
  },
  {
    value: 'A4',
    label: 'A4'
  },
  {
    value: 'B1',
    label: 'B1'
  },
  {
    value: 'B2',
    label: 'B2'
  },
  {
    value: 'B3',
    label: 'B3'
  },
  {
    value: 'B4',
    label: 'B4'
  },
  {
    value: 'C1',
    label: 'C1'
  },
  {
    value: 'C2',
    label: 'C2'
  },
  {
    value: 'D1',
    label: 'D1'
  },
  {
    value: 'D2',
    label: 'D2'
  },
  {
    value: 'E1',
    label: 'E1'
  },
  {
    value: 'E2',
    label: 'E2'
  },
  {
    value: 'E3',
    label: 'E3'
  },
  {
    value: 'F1',
    label: 'F1'
  },
  {
    value: 'F2',
    label: 'F2'
  },
  {
    value: 'F3',
    label: 'F3'
  },
  {
    value: 'G1',
    label: 'G1'
  },
  {
    value: 'G2',
    label: 'G2'
  },
  {
    value: 'H1',
    label: 'H1'
  },
  {
    value: 'H2',
    label: 'H2'
  },
  {
    value: 'H3',
    label: 'H3'
  },
  {
    value: 'H4',
    label: 'H4'
  },
  {
    value: 'H5',
    label: 'H5'
  },
  {
    value: 'H6',
    label: 'H6'
  },
  {
    value: 'H7',
    label: 'H7'
  },
  {
    value: 'H8',
    label: 'H8'
  }
]

const clearObject = object => {
  let newObject = {}
  Object.keys(object).forEach(key => {
    if (object[key]) {
      newObject = { ...newObject, [key]: object[key] }
    }
  })
  return newObject
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  chunk,
  formatBytes,
  formatDate,
  convertToReadable,
  uploadImage,
  createStatus,
  blockList,
  clearObject
}
