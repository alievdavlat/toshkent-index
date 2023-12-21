import React, { useState, useEffect } from 'react'

import get from 'lodash/get'
import { Icon, notification } from 'antd'
import Fields from '@/components/Fields'
import UploadImage from '@/components/Fields/UploadImage'
// import Actions from "modules/entity/actions";
import { useDispatch } from 'react-redux'
import { API_URL } from '@/services'

const FmUpload = ({ isLoading, setLoading, filterType, activeFolder, useFolderPath }) => {
  const [files, setValue] = useState([])
  const [progress, setProgress] = useState('')
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (progress === 100)
      setTimeout(() => {
        setVisible(false)
        setProgress('')
        setVisible(true)
      }, 1000)
  }, [progress])

  const dispatch = useDispatch()
  return (
    <div className='fm-upload'>
      <UploadImage
        action={`${API_URL}/file/upload/`}
        listType={'picture-card'}
        activeFolderId={activeFolder ? activeFolder.id : ''}
        showUploadList={false}
        defaultFileList={files}
        useFolderPath={useFolderPath}
        multiple
        acceptAll
        setProgress={setProgress}
        errorCb={err => {
          setLoading(false)
          notification.error({
            message: get(err, 'message', 'Что-то пошло не так'),
            duration: 2
          })
          setTimeout(() => {
            setVisible(false)
            setProgress('')
            setVisible(true)
          }, 1000)
        }}
        disabled={isLoading}
        onChange={({ file }) => {
          setLoading(true)
          let fileList = []
          ;[get(file, 'response', {})].forEach(f => {
            if (file.status === 'done') {
              setLoading(false)
              fileList = [
                {
                  ...f,
                  uid: f.id,
                  url: get(f, 'link'),
                  name: f.title
                }
              ]
            }
          })
          setValue([...fileList])
        }}
        onRemove={file => {
          const keys = Object.keys(get(file, 'response', {}))
          setValue([...files].filter(f => f.uid !== keys[0]))
        }}
      >
        <div>
          {isLoading ? (
            <div className='fm-loading'>
              <div
                className='fm-loading__indicator'
                style={{ width: visible && progress > 0 ? `${progress}%` : `${0}` }}
              />
              {visible && progress > 0 ? <span>{progress}%</span> : null}
            </div>
          ) : (
            <>
              <div className='ant-upload-text'>
                <p>+</p>
                {'Zagruzka qilish'}
              </div>
            </>
          )}
        </div>
      </UploadImage>
    </div>
  )
}

export default FmUpload
