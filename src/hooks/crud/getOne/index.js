'use client'

import { useQuery } from "@tanstack/react-query";
import {api} from '@/services/api';
import queryBuilder from '@/services/queryBuilder';
import { store } from '@/store';

// api call function
async function getOne({ queryKey }) {
	const { url, params } = queryKey[1].args;
	const res = await api.get(queryBuilder(url, params));
	return res.data;
}

const useGetOne = args => {
	const currLang = store.getState().system.currentLangCode;
	const { queryOption, propId } = args;
	const { name, onSuccess, onError } = args;
	const { data, status, isLoading, isSuccess, isFetched, refetch } = useQuery({
		queryKey: [`${name}-${currLang}`, { args }],
		
		queryFn: getOne,
		onSuccess: onSuccess,
		onError: onError,
		enabled: !!propId,
		...queryOption
	});

	return { data, status, isLoading, isSuccess, isFetched, refetch };
};

export default useGetOne;