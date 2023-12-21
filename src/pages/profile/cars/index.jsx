import React from 'react'
import AddProduct from './compponents/AddProduct'
import { withAdminLayout } from '@/adminLayout/AdminLayout'

const Cars = () => {
  return <AddProduct getUrl={'/elon/properties/'} postUrl={'/elon/create/'} method={'post'} />
}

export default withAdminLayout(Cars);
