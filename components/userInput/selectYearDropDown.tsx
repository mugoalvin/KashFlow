import { View } from 'react-native'
import { Icon, Text, useTheme } from 'react-native-paper'

import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'

interface SelectYearDropDownProps {
	chipYears: number[]
	selectedYear: number
	setYear: (year: number) => void
}

export default function SelectYearDropDown({ chipYears, selectedYear, setYear }: SelectYearDropDownProps) {
	const theme = useTheme()
	const insets = useSafeAreaInsets();
	const contentInsets = {
		top: insets.top,
		bottom: insets.bottom,
		left: 4,
		right: 4,
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className='justify-center pe-5 h-11'>
				<View className='flex-row justify-center items-center gap-5 p-3 rounded me-4' style={{ backgroundColor: theme.colors.elevation.level4 }}>
					<Text>{selectedYear}</Text>
					<Icon
						source={() =>
							<Ionicons name='chevron-down' color={theme.colors.onBackground} />
						}
						size={16}
					/>
				</View>
			</DropdownMenuTrigger>

			<DropdownMenuContent style={{ backgroundColor: theme.colors.secondaryContainer }} insets={contentInsets} sideOffset={2} className="w-56" align="start">
				<DropdownMenuLabel>Select Year</DropdownMenuLabel>
				<DropdownMenuSeparator style={{ backgroundColor: theme.colors.secondary }} />
				<DropdownMenuGroup>
					{
						chipYears.reverse().map(year => [
							<DropdownMenuItem key={year} onPress={() => setYear(year)}>
								<Text>{year}</Text>
							</DropdownMenuItem>
						])
					}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}