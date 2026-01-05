import { getDropDownMenuItemAndroidRipple, getDropDownStyles } from '@/utils/styles';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { IconButton, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';

interface HeaderRightProps {
	tintColor: string
}

interface MenuItemProps {
	label: string
	onPress?: () => void
}

interface HeaderRightProps {
	items?: MenuItemProps[]
}

export default function HeaderRight({ tintColor, items }: HeaderRightProps) {
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
				<IconButton
					icon={({ size }) => <Ionicons name='ellipsis-vertical' color={tintColor} size={size - 7} />}
				/>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				insets={contentInsets}
				sideOffset={2}
				className="w-56"
				align="start"
				style={getDropDownStyles(theme).menuContent}
			>
				<DropdownMenuGroup>

					{
						items &&
						items.map(item =>
							<DropdownMenuItem key={item.label} onPress={item.onPress} android_ripple={getDropDownMenuItemAndroidRipple(theme)} className="active:bg-transparent">
								<Text>{item.label}</Text>
							</DropdownMenuItem>
						)
					}
					{
						items &&
						<DropdownMenuSeparator style={getDropDownStyles(theme).separator} />
					}

					<DropdownMenuItem onPress={() => router.push('/settings')} android_ripple={getDropDownMenuItemAndroidRipple(theme)} className="active:bg-transparent">
						<Text>Settings</Text>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}