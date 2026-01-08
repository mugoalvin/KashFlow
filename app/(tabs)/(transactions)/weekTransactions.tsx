import DailyTransactionInfo from "@/components/information/dailyTransactionInfo";
import Body from "@/components/views/body";
import ButtonGroup from "@/components/views/buttonGroup";
import { getNavData, removeNavData } from '@/utils/navigationCache';
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { transactionButtonType } from ".";

export default function AnalysisMore() {
	const navigation = useNavigation()
	const { id, dateRange } = useLocalSearchParams()
	const [loading, setLoading] = useState(true)
	const [data, setData] = useState<{ date: string; transactions: any[] }[]>([])
	const [selectedButton, setSelectedButton] = useState<transactionButtonType>('all')


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

	return (
		<Body>
			<ButtonGroup
				buttons={[
					{
						title: "All",
						type: "all"
					},
					{
						title: "Money In",
						type: "moneyIn"
					},
					{
						title: "Money Out",
						type: "moneyOut"
					}
				]}

				setButtonSelected={setSelectedButton}
			/>

			<FlashList
				data={data}
				renderItem={({ item }: { item: { date: string; transactions: any[] } }) =>
					<DailyTransactionInfo
						date={item.date}
						transactions={item.transactions}
						length={item.transactions.length}
						loading={loading}
						transactionType={selectedButton}
					/>
				}
			/>
		</Body>
	)
}