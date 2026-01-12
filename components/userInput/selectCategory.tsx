import { MpesaParced } from "@/interface/mpesa";
import moment from "moment";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import LightText from "../text/lightText";
// import CreateCategory from "./createCategory";
import SelectCategoryDropDown from "./selectCategoryDropDown";

interface SelectCategoryProps {
	transaction: MpesaParced
	closeModal: () => void
}

export default function SelectCategory({ closeModal, transaction }: SelectCategoryProps) {
	const theme = useTheme()

	function ValueDisplay({ title, value }: { title: string, value: string }) {
		return (
			<View className="flex-1">
				<LightText text={title} color={theme.colors.tertiary} />
				<Text variant="bodyLarge" className="text-xl">{value}</Text>
			</View>
		)
	}

	return (
		<View
			className="items-center p-5 mx-7 rounded-2xl gap-3 justify-between"
			style={{
				backgroundColor: theme.colors.secondaryContainer,
				aspectRatio: 1
			}}
		>
			<Text
				className="uppercase"
				variant="headlineSmall"
				numberOfLines={2}
				ellipsizeMode="tail"
				style={{
					// @ts-expect-error
					color: transaction.type === 'receive' ? theme.colors.onSuccessContainer : theme.colors.onSecondaryContainer
				}}>
				{transaction.counterparty}
			</Text>

			<SelectCategoryDropDown transaction={transaction} closeModal={closeModal} />

			<LightText text={`${transaction.parsedTime} on ${moment(transaction.parsedDate).format("ddd, Do MMM YY")}`} />

			<View className="flex-1 w-full">
				<ValueDisplay title="Amount" value={`Ksh ${transaction.amount}`} />
				<ValueDisplay title="Transaction Fee" value={`Ksh ${transaction.fee || 0}`} />
				<ValueDisplay title="Balance" value={`Ksh ${transaction.balance}`} />
			</View>

		</View>
	)
}