import DailyTransactionInfo from "@/components/information/dailyTransactionInfo";
import Body from "@/components/views/body";
import { getNavData, removeNavData } from '@/utils/navigationCache';
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { FlatList } from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";

export default function AnalysisMore() {
	const theme = useTheme()
	const navigation = useNavigation()
	const { id, dateRange } = useLocalSearchParams()
	const [loading, setLoading] = useState(true)
	const [data, setData] = useState<any>(null)


	useLayoutEffect(() => {
		navigation.setOptions({ title: dateRange })
	}, [navigation, dateRange])

	useEffect(() => {
		let mounted = true
			; (async () => {
				try {
					const maybe = getNavData(id as string)
					if (maybe) {
						if (!mounted) return
						setData(maybe)
						removeNavData(id as string)
					}
				} finally {
					if (mounted) setLoading(false)
				}
			})()
		return () => {
			mounted = false
		}
	}, [id])


	if (loading) {
		return (
			<Body className="flex-1 items-center justify-center">
				<ActivityIndicator animating />
			</Body>
		)
	}


	return (
		<Body>
			<FlatList
				data={data}
				renderItem={({ item }) =>
					<DailyTransactionInfo date={item.date} transactions={item.transactions} length={item.transactions.length} />
				}
			/>
		</Body>
	)
}