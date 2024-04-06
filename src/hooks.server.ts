import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { PUBLIC_AUTH0_DOMAIN, PUBLIC_AUTH0_CLIENT_ID } from '$env/static/public';
import { createAuth0Client } from '@auth0/auth0-spa-js';
import { dbCollection, setCollection } from '$lib/server';

export const authConfig = {
	domain: PUBLIC_AUTH0_DOMAIN,
	clientId: PUBLIC_AUTH0_CLIENT_ID
};

export const createClient = async () => {
	const auth0Client = await createAuth0Client({
		domain: authConfig.domain,
		clientId: authConfig.clientId,
		useRefreshTokens: true,
		cacheLocation: 'localstorage'
	});

	return auth0Client;
};

export const handle: Handle = async ({ resolve, event }) => {
	const { request } = event;
	const token = event.request.headers.get('Authorization')?.substring(7) ?? null;

	const requestWithNoBody = new Request(request.url, {
		...request,
		body: null
	});

	if (!token) {
		event.request = requestWithNoBody;
		return resolve(event);
	}

	if (!dbCollection) {
		const decodedToken = token && jwt.decode(token);
		const _collectionName = decodedToken?.sub as string;
		if (!_collectionName) {
			event.request = requestWithNoBody;
			resolve(event);
		}
		setCollection(_collectionName);
		event.request = requestWithNoBody;
		return resolve(event);
	}

	// Apply CORS header for API routes
	if (event.url.pathname.startsWith('/api')) {
		// Required for CORS to work
		if (event.request.method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Headers': '*'
				}
			});
		}
	}

	const response = await resolve(event);
	if (event.url.pathname.startsWith('/api')) {
		response.headers.append('Access-Control-Allow-Origin', `*`);
	}
	return response;
};
