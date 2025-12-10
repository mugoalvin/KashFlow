import { MpesaParced } from "@/interface/mpesa";
import { getTodaysDate } from "@/utils/functions";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { View } from "react-native";
import { Icon, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface SelectWeekDropDownProps {
	items: {
		title: string;
		data: {
			date: string;
			transactions: MpesaParced[];
		}[];
	}[]
	selectedWeekIndex: number
	setSelectedWeekIndex: (index: number) => void
}

export default function SelectWeekDropDown({ items, selectedWeekIndex, setSelectedWeekIndex }: SelectWeekDropDownProps) {
	const theme = useTheme()
	const insets = useSafeAreaInsets()

	const contentInsets = {
		top: insets.top,
		bottom: insets.bottom,
		left: 4,
		right: 4,
	};

	const dateRanges = items.map(item => {
		const firstItemDataDate = item.data[0]?.date
		const lastItemDataDate = item.data[item.data.length - 1]?.date
		return `${formatDate(lastItemDataDate as string)} - ${getTodaysDate() === firstItemDataDate ? "Today" : formatDate(firstItemDataDate as string)}`
	})

	function formatDate(date: string): string {
		return moment(date).format("ddd, Do")
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className='justify-center'>
				<View className='flex-row justify-between items-center p-4 rounded ' style={{ backgroundColor: theme.colors.elevation.level2 }}>
					<Text>{ dateRanges[selectedWeekIndex] }</Text>
					<Icon
						source={() =>
							<Ionicons name='chevron-down' color={theme.colors.onBackground} />
						}
						size={16}
					/>
				</View>
			</DropdownMenuTrigger>

			<DropdownMenuContent style={{ backgroundColor: theme.colors.secondaryContainer }} insets={contentInsets} sideOffset={2} className="w-56" align="start">
				<DropdownMenuLabel>Select Week</DropdownMenuLabel>
				<DropdownMenuSeparator style={{ backgroundColor: theme.colors.secondary }} />
				<DropdownMenuGroup>
					{
						dateRanges.map((range, index) => [
							<DropdownMenuItem key={index} onPress={() => setSelectedWeekIndex(index)}>
								<Text>{range}</Text>
							</DropdownMenuItem>
						])
					}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}