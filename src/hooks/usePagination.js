import React, { useState } from 'react'

function usePagination({ page, perPage }) {
  const [pageNumber, setPageNumber] = useState(page)

  return {
    page: pageNumber,
    perPage: perPage,
    setPage: setPageNumber
  }
}

export default usePagination
