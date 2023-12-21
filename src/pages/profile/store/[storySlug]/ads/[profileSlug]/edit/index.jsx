import React from 'react'
import Image from 'next/image'
import Main from '@/modules/FormFormik'
import { ContainerAll } from '@/modules/container'
import i18n from '@/services/i18n'
import { Field } from 'formik'
import ControllerSelect from '@/components/Fields/Select'
import { useRouter } from 'next/router'
import AddProduct from '@/pages/profile/cars/compponents/AddProduct'
import { withAdminLayout } from '../../../../../../../adminLayout/AdminLayout'

const Cars = () => {
  const router = useRouter()

  return (
    <ContainerAll url={`/elon/info/${router.query.profileSlug}/`} name='elon-properties' auth={true}>
      {({ items: data }) => {
        return data ? (
          <AddProduct
            postUrl={`/elon/edit/${router.query.profileSlug}/`}
            method={'put'}
            getUrl={'/elon/properties/'}
            data={data?.items[0]}
          />
        ) : (
          <div />
        )
      }}
    </ContainerAll>
  )
}

export default withAdminLayout(Cars)
