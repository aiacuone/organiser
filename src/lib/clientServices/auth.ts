import { authConfig } from '$lib/config';
import { Auth0Client, createAuth0Client } from '@auth0/auth0-spa-js';

export const createClient = async () => {
	const auth0Client = await createAuth0Client({
		domain: authConfig.domain,
		clientId: authConfig.clientId,
		useRefreshTokens: true,
		cacheLocation: 'localstorage'
	});

	return auth0Client;
};

export const loginWithRedirect = async (client: Auth0Client) => {
	try {
		await client.loginWithRedirect({
			authorizationParams: {
				redirect_uri: 'http://localhost:5173/'
			}
		});
	} catch (e) {
		console.error(e);
	}
};

export const logout = (client: Auth0Client) => {
	return client.logout();
};
