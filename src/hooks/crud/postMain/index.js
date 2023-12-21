'use client'

import { useMutation } from "@tanstack/react-query";
import api, { request, requestAuth } from '@/services/api';
import queryBuilder from '@/services/queryBuilder';

async function postData({ url, data, params, method = "post", onSuccess = () => {}, onError = () => {}, auth = false }) {
	return await auth ? requestAuth ({
		url,
		data,
		params,
		method		
	})
	.then(data => {
		onSuccess(data);
	})
	.catch(error => {
		onError(error);
	}) 
	: request({
		url,
		data,
		params,
		method
	})
	.then(data => {
		onSuccess(data);
	})
	.catch(error => {
		onError(error);
	});
}

const usePostMain = () => {
	return useMutation(postData, 
		);
};

export default usePostMain;
