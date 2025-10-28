import Body from "@/components/views/body";
import { useEffect, useState } from "react";

import MonthlyTransactionInfo from "@/components/information/monthlyTransactionInfo";
import { MpesaParced } from '@/interface/mpesa';
import { months } from "@/utils/variable";
import { Tab, TabView } from '@rneui/themed';
import { useTheme } from "react-native-paper";

export type transactionButtonType = 'all' | 'moneyOut' | 'moneyIn'

const buttons = [
	{ title: "All", type: 'all' },
	{ title: "Money Out", type: 'moneyOut' },
	{ title: "Money In", type: 'moneyIn' },
];



export default function Transactions() {
	const theme = useTheme()
	const currentMonthIndex = new Date().getMonth()
	const [activeIndex, setActiveIndex] = useState(currentMonthIndex)

	// simple in-memory cache for fetched months so switching tabs doesn't refetch
	const [monthCache, setMonthCache] = useState<Record<string, MpesaParced[]>>({})


	return (
		<Body>
			<Tab
				value={activeIndex}
				onChange={setActiveIndex}
				scrollable
				indicatorStyle={{
					backgroundColor: theme.colors.onSecondaryContainer,
				}}
			>
				{
					months.map((month, index) => (
						<Tab.Item
							key={month.identifier}
							disabled={index > currentMonthIndex}
							title={month.title}
							titleStyle={{
								fontSize: theme.fonts.bodySmall.fontSize,
								color: theme.colors.onBackground
							}}
							containerStyle={(active: boolean) => ({
								backgroundColor: active ? theme.colors.elevation.level1 : theme.colors.elevation.level0
							})}
							disabledStyle={{
								backgroundColor: theme.colors.background,
							}}
						/>
					))
				}
			</Tab>

			<TabView value={activeIndex} onChange={setActiveIndex} animationType="spring">
				{
					months.map((month, idx) => (
						<TabView.Item
							key={idx}
							className="flex-1 items-center justify-center"
						>
							{activeIndex === idx ? (
								<MonthlyTransactionInfo
									month={`2025-${(idx + 1).toString().padStart(2, '0')}`}
									initialData={monthCache[`2025-${(idx + 1).toString().padStart(2, '0')}`] ?? null}
									onDataLoaded={(data) => setMonthCache(prev => ({ ...prev, [`2025-${(idx + 1).toString().padStart(2, '0')}`]: data }))}
								/>
							) : null}
						</TabView.Item>
					))
				}
			</TabView>

		</Body>
	)
}