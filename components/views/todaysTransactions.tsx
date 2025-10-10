import { Mpesa } from "@/interface/mpesa";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { FlatList, View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import TransInfo from "../information/transInfo";
import Title from "../text/title";

interface TodaysTransactionProps {
	messages: Mpesa[]
}


export default function TodaysTransaction({ messages }: TodaysTransactionProps) {
	const theme = useTheme()

	function EmptyComponent() {
		return (
			<View className="items-center justify-center" style={{ height: 310 }}>
				<Text style={{ color: theme.colors.onSurfaceDisabled }}>Empty Component</Text>
			</View>
		)
	}


	return (
		<>
			<Title
				leadingIcon={<Ionicons name='calendar-number-sharp' size={16} color={theme.colors.primary} />}
				text="Todays Transactions"
				trailingIcon={
					<IconButton
						icon={() =>
							<MaterialIcons
								name="sort"
								size={16}
								color={theme.colors.primary}
							/>
						}
						onPress={() => { }}
					// onPress={() => setMessages([])}
					/>
				}
			/>

			<FlatList
				// style={{ maxHeight: 310, }}
				contentContainerStyle={{
					justifyContent: 'center',
				}}
				className="flex-1"
				data={messages}
				
				renderItem={({ item, index }) =>
					<TransInfo key={index} item={item} index={index} length={messages.length} />
				}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={() => <EmptyComponent />}
			/>
		</>
	)
}