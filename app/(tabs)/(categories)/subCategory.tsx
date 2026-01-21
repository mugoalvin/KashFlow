import SubCategoryCard from '@/components/category/subCategoryCard'
import Body from '@/components/views/body'
import { sqliteDB } from '@/db/config'
import { fetchMpesaMessagesByCategory } from '@/db/db_functions'
import { MpesaParced } from '@/interface/mpesa'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { RefreshControl } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useTheme } from 'react-native-paper'
import Animated, { FadeInDown, FadeOutRight } from 'react-native-reanimated'

export default function SubCategory() {
	const theme = useTheme()
	const navigation = useNavigation()
	const { id, subCategory } = useLocalSearchParams()
	const [counterParties, setCounterParties] = useState<MpesaParced[]>()
	const [isRefreshing, setIsRefreshing] = useState<boolean>(false)

	async function syncPage() {
		const res = await fetchMpesaMessagesByCategory(sqliteDB, Number(id))
		setCounterParties(res as MpesaParced[])
	}

	useEffect(() => {
		navigation.setOptions({
			title: subCategory
		})

		syncPage()
	}, [])


	return (
		<Body>
			<ScrollView
				className='flex-1'
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						progressBackgroundColor={theme.colors.primaryContainer}
						colors={[theme.colors.primary]}
						onRefresh={async () => {
							setIsRefreshing(true)
							await syncPage()
							setIsRefreshing(false)
						}}
					/>
				}
			>
				{
					counterParties?.map((tx, i) =>
						<Animated.View
							key={tx.counterparty}
							entering={FadeInDown.duration(500).delay(i * 50)}
							exiting={FadeOutRight.duration(500)}
							className='mb-2'
						>
							<SubCategoryCard counterParty={tx.counterparty} />
						</Animated.View>
					)
				}
			</ScrollView>
		</Body>
	)
}