import MonthlyTransactionInfo from "@/components/information/monthlyTransactionInfo";
import SelectYearDropDown from "@/components/userInput/selectYearDropDown";
import Body from "@/components/views/body";
import { sqliteDB } from "@/db/config";
import { mpesaMessages } from "@/db/sqlite";
import { MpesaParced } from '@/interface/mpesa';
import { getYearsFrom } from "@/utils/functions";
import { months } from "@/utils/variable";
import { Tab, TabView } from '@rneui/themed';
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { useMMKVBoolean, useMMKVString } from "react-native-mmkv";
import { useTheme } from "react-native-paper";

export type transactionButtonType = 'all' | 'moneyOut' | 'moneyIn'

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

	const [tabViewAnimationType] = useMMKVString('tabViewAnimationType')
	const [disableSwipe] = useMMKVBoolean('isSwipeDisabled')



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
			<View className="flex-row">
				<Tab
					className="w-9/12"
					value={activeIndex}
					onChange={setActiveIndex}
					scrollable
					indicatorStyle={{
						backgroundColor: theme.colors.onSecondaryContainer,
					}}
				>
					{
						months.map((month, index) => {
							const isDisabled =
								(year === currentYear && index > currentMonthIndex) ||
								(year === firstYear && (index + 1) < firstMonth) ||
								(year > currentYear);
							return (
								<Tab.Item
									key={month.identifier}
									disabled={isDisabled}
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
							)
						})
					}
				</Tab>
				<View className="w-4/12 h-full">
					<SelectYearDropDown chipYears={chipYears.current} selectedYear={year} setYear={setYear} />
				</View>
			</View>

			<TabView value={activeIndex} onChange={setActiveIndex} animationType={tabViewAnimationType as 'spring' | 'timing' | undefined || "spring"} disableSwipe={disableSwipe}>
				{
					months.map((_, idx) => (
						<TabView.Item
							key={idx}
							className="flex-1 items-center justify-center"
						>
							{
								activeIndex === idx ? (
									<MonthlyTransactionInfo
										monthDateString={`${year}-${(idx + 1).toString().padStart(2, '0')}`}
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