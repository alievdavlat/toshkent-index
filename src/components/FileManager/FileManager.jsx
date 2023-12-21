import React, { useState } from 'react'

import { Modal } from 'antd'

import FMList from './components/fmList'
import FMListMulti from './components/fmListMulti'
import FmUpload from './components/fmUpload'

const FileManager = ({
  addImage,
  visible = false,
  onCancel = () => {},
  isDocument,
  isMulti,
  useFileName,
  useFolderPath
}) => {
  const [isLoading, setLoading] = useState(false)
  const [size, setSize] = useState('low')

  const [selected, setSelected] = useState(null)
  const [selectedItems, setSelectedItems] = useState([])

  const [filterType, setFilterType] = useState(isDocument ? 'documents' : 'images')

  return <FmUpload {...{ setLoading, isLoading, filterType }} />
}

export default FileManager
