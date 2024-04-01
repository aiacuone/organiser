import _axios from 'axios';
import { PUBLIC_BASE_URL } from '$env/static/public';
import { createClient } from '$lib/services';

export const axios = _axios.create({
	baseURL: PUBLIC_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'Content-Type'
	}
});

axios.interceptors.request.use(async (config) => {
	const sessionStorageToken = sessionStorage.getItem('token');
	const doesSessionTokenExist = sessionStorageToken !== null;

	let token;

	if (doesSessionTokenExist) {
		token = JSON.parse(sessionStorageToken as string);
	} else {
		const client = await createClient();
		const response = await client.getIdTokenClaims();
		const _token = response?.__raw;

		sessionStorage.setItem('token', JSON.stringify(_token));
		token = _token;
	}

	return {
		...config,
		headers: {
			...config.headers,
			Authorization: `Bearer ${token}`
		}
	};
});
