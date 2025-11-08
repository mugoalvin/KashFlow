import Body from "@/components/views/body";
import { useEffect, useRef, useState } from "react";

import MonthlyTransactionInfo from "@/components/information/monthlyTransactionInfo";
import ChipCustom from "@/components/ui/chip";
import ChipView from "@/components/views/chipView";
import { sqliteDB } from "@/db/config";
import { mpesaMessages } from "@/db/sqlite";
import { MpesaParced } from '@/interface/mpesa';
import { getYearsFrom } from "@/utils/functions";
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
	const currentTime = new Date()
	const currentMonthIndex = currentTime.getMonth()
	const currentYear = currentTime.getFullYear()
	const [activeIndex, setActiveIndex] = useState(currentMonthIndex)

	const [monthCache, setMonthCache] = useState<Record<string, MpesaParced[]>>({})
	const [year, setYear] = useState<number>(currentYear)

	const chipYears = useRef<number[]>([])
	const [firstMonth, setFirstMonth] = useState<number>(1)
	const [firstYear, setFirstYear] = useState<number>(1)


	async function getFirstTransactionInfo() {
		const val = await sqliteDB
			.select({ date: mpesaMessages.parsedDate })
			.from(mpesaMessages)
			.limit(1)

		const [year, month] = (val[0].date as string)?.split('-')

		setFirstYear(Number(year))
		chipYears.current = getYearsFrom(Number(year))
		setFirstMonth(Number(month))
	}


	useEffect(() => {
		getFirstTransactionInfo()
	}, [])

	return (
		<Body>
			<ChipView>
				{
					chipYears.current.map(chipYear =>
						<ChipCustom key={chipYear} selected={year === chipYear} chipText={chipYear.toString()} onPress={() => setYear(chipYear)} />
					)
				}
			</ChipView>

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
							disabled={index > currentMonthIndex || (year === firstYear && index + 1 < firstMonth)}
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

			<TabView value={activeIndex} onChange={setActiveIndex} animationType="spring" disableSwipe={false}>
				{
					months.map((month, idx) => (
						<TabView.Item
							key={idx}
							className="flex-1 items-center justify-center"
						>
							{activeIndex === idx ? (
								<MonthlyTransactionInfo
									month={`${year}-${(idx + 1).toString().padStart(2, '0')}`}
									initialData={monthCache[`${year}-${(idx + 1).toString().padStart(2, '0')}`] ?? null}
									onDataLoaded={(data) => setMonthCache(prev => ({ ...prev, [`${year}-${(idx + 1).toString().padStart(2, '0')}`]: data }))}
								/>
							) : null
							}
						</TabView.Item>
					))
				}
			</TabView>

		</Body>
	)
}