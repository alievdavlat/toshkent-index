import React from 'react'
import ProductImg from '../../../../../img/product/1.jpg'
import Image from 'next/image'
import Main from '@/modules/FormFormik'
import { ContainerAll } from '@/modules/container'
import i18n from '@/services/i18n'
import { Field } from 'formik'
import ControllerSelect from '@/components/Fields/Select'
import { useRouter } from 'next/router'
import { withAdminLayout } from '../../../../../adminLayout/AdminLayout'
import AddProduct from '@/pages/profile/cars/compponents/AddProduct'

const Cars = () => {
  const router = useRouter();

  return (
    <ContainerAll url={`/elon/info/${router.query.profileSlug}/`} name='ads-properties' auth={true}>
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

export default withAdminLayout(Cars);
