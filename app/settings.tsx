import Body from "@/components/views/body";
import { extractWithdrawDetails } from "@/utils/extractDetails";
import { StatusBar } from "react-native";
import { Button } from "react-native-paper";

export default function Settings() {
	const statusBarHeight = StatusBar.currentHeight

	const message = "THJ51ALLE3 Confirmed.on 19/8/25 at 3:25 PMWithdraw Ksh200.00 from 683804 - Afribrooks Investments  Majengo Behind co-operative bank Kajiado New M-PESA balance is Ksh0.00. Transaction cost, Ksh29.00. Amount you can transact within the day is 498,890.00. Sign up for Lipa Na M-PESA Till online https://m-pesaforbusiness.co.ke"
	return (
		<Body style={{ paddingTop: statusBarHeight } as any} className="items-center justify-center gap-3">

			<Button
				onPress={() => {
					console.log(
						extractWithdrawDetails(message)
					)
				}}
			>
				Hi
			</Button>

		</Body>
	)
}

{/*

============TODO Options/Settings============
1. Animation Preferences
2. Theme Settings
3. Graph Settigns
	-Data Point Visibility
4. Tab View
	-Horizontal Scrollability
	-Animation Type
5. Home Screens Balance Visibility Preference

*/}