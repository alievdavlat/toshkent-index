import React, { useState } from 'react'

import FileManager from '../FileManager'
import GridElements from '../GridElements'
import get from 'lodash/get'
import uniqBy from 'lodash/uniqBy'

import { ReactComponent as DeleteIcon } from './icons/delete.svg'
import cx from 'classnames'
import { helpers } from '@/services'
import Image from 'next/image'

const UploadImageManager = ({
  successCb = () => {},
  useFileName = 0,
  useFolderPath,
  columns = 12,
  isMulti,
  isDocument = false,
  limit = 1,
  label,
  field,
  form: { touched, errors, setFieldValue, values },
  className
}) => {
  const [visible, setVisible] = useState(false)
  const removeHandler = selected => {
    setFieldValue(
      field.name,
      values[field.name].filter(item => item.id !== selected.id)
    )
  }

  const classNames = cx('upload-photos', touched[field.name] && errors[field.name] && 'has-error', className)
  return (
    <>
      <FileManager
        addImage={data => {
          if (isMulti) {
            setFieldValue(field.name, uniqBy([...values[field.name], ...data], 'id'))
          } else {
            setFieldValue(field.name, [data])
          }
          successCb(data)
        }}
        onCancel={() => {
          setVisible(false)
        }}
        useFileName={useFileName}
        useFolderPath={useFolderPath}
        isMulti={isMulti}
        visible={visible}
        isDocument={isDocument}
      />
      <div className={classNames}>
        {label && <div className='ant-label'>{label}</div>}
        <div className='preview-list'>
          {values[field.name]?.map((item, i) => (
            <div className='preview-item' key={get(item, 'id', `${i}`)}>
              <div className='delete-btn' onClick={() => removeHandler(item)}>
                <DeleteIcon height={22} width={22} />
              </div>
              <Image src={get(item, 'path')} width={200} height={200} alt='' />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default UploadImageManager
