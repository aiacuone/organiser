let timer: any;

export const debounce = (fn: () => any, delay = 500) => {
	const timeout = () => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			fn();
		}, delay);
	};
	timeout();
};
