import Head from 'next/head'
import React from 'react'

function Seo({ title, description, image, url }) {
  return (
    <Head>
      <title>{title}</title>
      <meta name='description' content={description} />
      {/* <!-- Facebook --> */}
      <meta property='og:title' content={title} />
      <meta property='og:site_name' content='Tashkent INDEX' />
      <meta property='og:description' content={description} />
      <meta property='og:url' content={'https://avtoindex.uz' + url} />
      <meta property='og:image' content={image} />
      <meta property='og:type' content='website' />
      <meta property='og:image:width' content='1200' />
      <meta property='og:image:height' content='630' />
      {/* <!-- Google Plus --> */}
      <meta itemprop='name' content='Tashkent INDEX' />
      <meta itemprop='description' content={description} />
      <meta itemprop='image' content={image} />
      {/* <!-- Twitter --> */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />
      <meta property='twitter:image:width' content='1200' />
      <meta property='twitter:image:height' content='630' />
    </Head>
  )
}

export default Seo
