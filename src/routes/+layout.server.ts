import { getAllLogNotifications, getSpaces } from '$lib';

export const load = async (req: Request, res: Response) => {
	const spaces = await getSpaces();

	const space = req.url.pathname.split('/')[1];

	const initialLogNotifications = getAllLogNotifications(spaces)
		.then((res) => res)
		.catch((err) => console.log(err));

	return {
		spaces,
		initialLogNotifications,
		// times,
		space
	};
};
