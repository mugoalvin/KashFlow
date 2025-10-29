const navCache = new Map<string, any>()

export function storeNavData(key: string, data: any) {
	try {
		navCache.set(key, data)
	} catch {
		// no-op: safeguard (avoid throwing from cache)
	}
}

export function getNavData(key: string) {
	return navCache.get(key)
}

export function removeNavData(key: string) {
	navCache.delete(key)
}

export default {
	storeNavData,
	getNavData,
	removeNavData,
}
