import React from 'react'
import AddProduct from '../../components/AddProduct'
import { ContainerAll } from '@/modules/container'
import { useRouter } from 'next/router'

function ProductEditPage() {
  const router = useRouter()
  return (
    <ContainerAll
      url={`/product/info/${router?.query?.productSlug}/`}
      name={`/product/info/${router?.query?.productSlug}/`}
      auth={true}
    >
      {({ items }) => {
        return items ? (
          <AddProduct
            data={items}
            getUrl={`eav/category/steps/${router.query.storySlug}/`}
            postUrl={`/product/edit/${router?.query?.productSlug}/`}
            method={'put'}
          />
        ) : (
          <div />
        )
      }}
    </ContainerAll>
  )
}

export default ProductEditPage
