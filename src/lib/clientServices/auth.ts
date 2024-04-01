import { authConfig } from '$lib/config';
import { isAuthenticated, popupOpen, user } from '$lib/stores/auth';
import { Auth0Client, createAuth0Client, type Auth0ClientOptions } from '@auth0/auth0-spa-js';

export const createClient = async () => {
	const auth0Client = await createAuth0Client({
		domain: authConfig.domain,
		clientId: authConfig.clientId
	});

	return auth0Client;
};

export const loginWithPopup = async (client: Auth0Client, options: Auth0ClientOptions) => {
	popupOpen.set(true);
	try {
		await client.loginWithPopup(options);
		const _user = await client.getUser();
		_user && user.set(_user);
		isAuthenticated.set(true);
	} catch (e) {
		console.error(e);
	} finally {
		popupOpen.set(false);
	}
};

export const logout = (client: Auth0Client) => {
	return client.logout();
};
