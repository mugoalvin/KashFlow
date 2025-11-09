import { MpesaParced } from "@/interface/mpesa";
import { chunkArray } from "@/utils/functions";
import * as React from "react";
import { Dimensions, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
	ICarouselInstance,
	Pagination,
} from "react-native-reanimated-carousel";
import TransInfo from "../information/transInfo";
import { useTheme } from "react-native-paper";

const width = Dimensions.get("window").width - 15;

interface AppCarouselProps {
	data: MpesaParced[]
}

export default function AppCarousel({ data }: AppCarouselProps) {
	const theme = useTheme()
	const chunkedData = React.useMemo(() => chunkArray(data, 5), [data]);

	const ref = React.useRef<ICarouselInstance>(null);
	const progress = useSharedValue<number>(0);

	const onPressPagination = (index: number) => {
		ref.current?.scrollTo({
			/**
			 * Calculate the difference between the current index and the target index
			 * to ensure that the carousel scrolls to the nearest index
			 */
			count: index - progress.value,
			animated: true,
		});
	};
	return (
		<View className="flex-1">
			<Carousel
				ref={ref}
				width={width}
				height={width * .88}
				data={chunkedData}
				onProgressChange={progress}
				renderItem={({ item, index }) => (
					<View key={index}>
						{item.map((transaction, i) => (
							<TransInfo
								key={i}
								item={transaction}
								index={i}
								length={data.length}
							/>
						))}
					</View>
				)}
			/>

			<Pagination.Custom
				progress={progress}
				data={chunkedData}
				dotStyle={{ backgroundColor: theme.colors.secondaryContainer, borderRadius: 50 }}
				containerStyle={{ gap: 5, marginTop: 10, }}
				activeDotStyle={{ backgroundColor: theme.colors.secondary }}
				onPress={onPressPagination}
			/>
		</View>
	)
}