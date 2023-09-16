import _axios from 'axios';
import { PUBLIC_BASE_URL } from '$env/static/public';

export const axios = _axios.create({
	baseURL: PUBLIC_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'Content-Type'
	}
});
