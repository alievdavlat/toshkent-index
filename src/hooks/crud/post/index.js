'use client'

import { useMutation } from "@tanstack/react-query";
import {api} from '@/services/api';
import queryBuilder from '@/services/queryBuilder';

async function postData({ url, data, params, method = "post" }) {
	return await api[method](queryBuilder(url, params), data);
}

const usePost = ({ ...args }) => {
	return useMutation(postData, {
		...args
	});
};

export default usePost;
