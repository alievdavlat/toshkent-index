'use client'

import { useQuery } from '@tanstack/react-query'
import { api, request, requestAuth } from '@/services/api'
import queryBuilder from '@/services/queryBuilder'
import { store } from '@/store'

// api call function
async function getAll({ queryKey }) {
  // const { url, params } = queryKey[1].args;
  const { url, params, auth } = queryKey[1].args
  console.log(params, 'params')
  const res = (await auth) ? requestAuth({ url, params }) : request({ url, params })
  return res.data ? res.data : res
}

const useGetAll = args => {
  const { name, onSuccess, onError } = args

  const { data, status, isLoading, isSuccess, isFetched, ...otherArgs } = useQuery({
    queryKey: [`${name}`, { args }],
    queryFn: getAll,
    onSuccess: onSuccess,
    onError: onError
  })

  return { data, status, isLoading, isSuccess, isFetched, ...otherArgs }
}

export default useGetAll
