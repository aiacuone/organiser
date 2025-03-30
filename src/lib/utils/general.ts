let timer: any

export const debounce = (fn: () => any, delay = 500) => {
	const timeout = () => {
		clearTimeout(timer)
		timer = setTimeout(() => {
			fn()
		}, delay)
	}
	timeout()
}

export const copyToClipboard = (text: string) => {
	const clipboardItem = new ClipboardItem({
		'text/plain': new Blob([text], { type: 'text/plain' })
	})

	navigator.clipboard.write([clipboardItem])
}

export const addToEndOfRaceCondition = (callback: () => void) => {
	setTimeout(() => {
		callback()
	}, 0)
}

export const onKeydown = (event: KeyboardEvent, keyData: Record<string, () => void>) =>
	event.key in keyData && keyData[event.key]()
