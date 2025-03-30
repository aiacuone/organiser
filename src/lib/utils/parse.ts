export const getObjectWithParsedValues = (object: Record<any, any>) =>
	Object.entries(object).reduce(
		(obj, [key, value]) => {
			if (value === 'true') {
				obj[key] = true
			} else if (value === 'false') {
				obj[key] = false
			} else {
				obj[key] = value
			}
			return obj
		},
		{} as Record<any, any>
	)
