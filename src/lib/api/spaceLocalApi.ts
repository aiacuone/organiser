const resource = 'space';

export async function getSpaces() {
	const response = await fetch(`/${resource}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const { spaces } = await response.json();

	return spaces;
}
