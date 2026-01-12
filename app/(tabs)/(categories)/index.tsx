import AccordionAndContentMenu from "@/components/category/AccordionAndContentMenu";
import AddCategory from "@/components/userInput/addCategory";
import Body from "@/components/views/body";
import useBottomSheetContext from "@/contexts/BottomSheetContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FAB } from "react-native-paper";

export default function Categories() {
	const { openSheet } = useBottomSheetContext()

	return (
		<Body className="pt-3">

			<AccordionAndContentMenu />

			<FAB
				// visible={false}
				style={{ position: 'absolute', margin: 16, bottom: 0, right: 0 }}
				icon={({ color, size }) =>
					<MaterialCommunityIcons name="plus" color={color} size={size} />
				}
				onPress={() =>
					openSheet({
						content: <AddCategory />
					})
				}
			/>
		</Body>
	)
}