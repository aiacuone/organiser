export function clickOutside(node: HTMLElement) {
	const handleClick = (event: MouseEvent) => {
		if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
			node.dispatchEvent(
				new CustomEvent('clickOutside', {
					detail: { node, event }
				})
			)
		}
	}

	// Use an immediately invoked effect
	$effect(() => {
		document.addEventListener('mousedown', handleClick, true)

		return () => {
			document.removeEventListener('mousedown', handleClick, true)
		}
	})

	return {
		destroy() {
			// Additional cleanup if needed
		}
	}
}
