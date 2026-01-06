import { getDropDownMenuItemAndroidRipple, getDropDownStyles } from '@/utils/styles'
import { MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { IconButton, Text, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '../ui/dropdown-menu'

interface SummaryDropDownProps {
	setNoTransactions: (count: number) => void
}

export default function SummaryDropDown({ setNoTransactions }: SummaryDropDownProps) {
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
			<DropdownMenuTrigger asChild>
				<IconButton icon={() => <MaterialIcons name="sort" color={theme.colors.primary} size={16} />} />
			</DropdownMenuTrigger>

			<DropdownMenuContent insets={contentInsets} sideOffset={2} className="w-56" align="start" style={getDropDownStyles(theme).menuContent}>

				<DropdownMenuGroup>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger className="bg-transparent">
							<Text>Number Of Transactions</Text>
						</DropdownMenuSubTrigger>

						<DropdownMenuSubContent
							style={{
								backgroundColor: theme.colors.background,
								outlineWidth: 1,
								outlineColor: theme.colors.outlineVariant,
								outlineStyle: 'dashed'
							}}>
							{
								[1, 2, 3, 4, 5].map(number =>
									<DropdownMenuItem key={number}
										className="active:bg-transparent"
										android_ripple={getDropDownMenuItemAndroidRipple(theme)}
										onPress={() => setNoTransactions(number)}
									>
										<Text>{number}</Text>
									</DropdownMenuItem>
								)
							}
						</DropdownMenuSubContent>

					</DropdownMenuSub>

				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}