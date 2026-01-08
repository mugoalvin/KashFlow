import React from 'react'
import { View } from 'react-native'
import { useMMKVBoolean } from 'react-native-mmkv'
import { useTheme } from 'react-native-paper'
import { Skeleton } from '../ui/skeleton'
import { getSkeletonStyle } from './skeletonColors'

interface TransInfoSkeletonProps {
	index: number
	length: number
}

export default function TransInfoSkeleton({ index, length }: TransInfoSkeletonProps) {
	const theme = useTheme()
	const [useCard] = useMMKVBoolean('useCard')
	const [useMinTransInfo] = useMMKVBoolean('isTransInfoMin')


	return (
		<>
			<View
				className={
					`flex-row justify-between ${useCard ? 'px-4' : 'px-1'} ${useCard ? 'py-4' : 'py-3'}
						${length === 1
						? 'rounded-3xl'
						: index === 0
							? 'rounded-s-3xl rounded-e-md'
							: index + 1 === length
								? 'rounded-e-3xl rounded-t-md'
								: 'rounded-md'
					}`
				}
				style={{
					backgroundColor: useCard ? theme.colors.elevation.level1 : theme.colors.background
				}}
			>
				<View className='flex-1 pe-2 gap-1'>
					<Skeleton className='w-56 h-5' style={getSkeletonStyle(theme).backGround} />
					{
						!useMinTransInfo &&
						<Skeleton className='w-24 h-5' style={getSkeletonStyle(theme).backGround} />
					}
				</View>
				<View className={`flex-row justify-between ${!useMinTransInfo && 'min-w-24'}`}>
					{
						!useMinTransInfo &&
						<Skeleton className='w-5 aspect-square rounded-full' style={getSkeletonStyle(theme).backGround} />
					}
					<View className='gap-1 items-end'>
						<Skeleton className='w-16 h-5' style={getSkeletonStyle(theme).backGround} />
						{
							useMinTransInfo &&
							<Skeleton className='w-12 h-4' style={getSkeletonStyle(theme).backGround} />
						}
					</View>
				</View>
			</View>
		</>
	)
}