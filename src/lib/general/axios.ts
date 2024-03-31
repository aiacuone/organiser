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
	const getAccessToken = async () => {
		const client = await createClient();
		const token = await client.getTokenSilently();
		return token;
	};

	const token = await getAccessToken();
	return {
		...config,
		headers: {
			...config.headers,
			Authorization: `Bearer ${token}`
		}
	};
});
