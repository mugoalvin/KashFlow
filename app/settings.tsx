import Body from "@/components/views/body";
import { sqliteDB } from "@/db/config";
import { mpesaMessages } from "@/db/sqlite";
import { Button as RN_Button, StatusBar } from "react-native";

export default function Settings() {
	const statusBarHeight = StatusBar.currentHeight

	return ( // @ts-ignore
		<Body style={{ paddingTop: statusBarHeight }}>

			<RN_Button title="react-native" onPress={() =>
				sqliteDB.delete(mpesaMessages)
					// fetchDailyTransaction("2025-10-10")
					.then((data) => { console.log(data); console.log("Done") })
					.catch(console.error)
					.finally(console.log)
			} />

		</Body>
	)
}