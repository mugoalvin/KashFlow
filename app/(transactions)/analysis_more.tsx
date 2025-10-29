import Body from "@/components/views/body";
import { getNavData, removeNavData } from '@/utils/navigationCache';
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";

export default function AnalysisMore() {
	const theme = useTheme()
	const navigation = useNavigation()
	const { id, title } = useLocalSearchParams()
	const [loading, setLoading] = useState(true)
	const [data, setData] = useState<any>(null)

	useLayoutEffect(() => {
		navigation.setOptions({ title: "Weekly Transactions" })
	}, [navigation])

	useEffect(() => {
		let mounted = true
			; (async () => {
				try {
					if (id) {
						const maybe = getNavData(id as string)
						if (maybe) {
							if (!mounted) return
							setData(maybe)
							removeNavData(id as string)
						}
					} else if (title) {
						// fallback: older navigation may have passed the whole payload as `title`
						try {
							const parsed = JSON.parse(title as string)
							if (mounted) setData(parsed)
						} catch {
							// ignore parse error
						}
					}
				} finally {
					if (mounted) setLoading(false)
				}
			})()
		return () => {
			mounted = false
		}
	}, [id, title])

	useEffect(() => {
		console.log(data)
	}, [data])

	if (loading) {
		return (
			<ActivityIndicator animating size={48} color={theme.colors.primary} />
		)
	}


	return (
		<Body>
			<Text>{Array.isArray(data) ? `Loaded ${data.length} day(s)` : 'Data loaded'}</Text>
		</Body>
	)
}