import _axios from 'axios'
// import _axios, { type InternalAxiosRequestConfig } from 'axios'
import { PUBLIC_BASE_URL } from '$env/static/public'

export const axios = _axios.create({
	baseURL: PUBLIC_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'Content-Type'
	}
})

// todo: Restore this
// axios.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
// 	const sessionStorageToken = sessionStorage.getItem('token')
// 	const doesSessionTokenExist = sessionStorageToken !== null && sessionStorageToken !== 'undefined'

// 	let token

// 	if (doesSessionTokenExist) {
// 		token = JSON.parse(sessionStorageToken as string)
// 	} else {
// 		const client = await createClient()
// 		const response = await client.getIdTokenClaims()
// 		const _token = response?.__raw

// 		sessionStorage.setItem('token', JSON.stringify(_token))
// 		token = _token
// 	}

// 	config.headers.set('Authorization', `Bearer ${token}`)

// 	return config
// })
