import { MpesaParced } from "@/interface/mpesa";
import { chunkArray } from "@/utils/functions";
import * as React from "react";
import { Dimensions, View } from "react-native";
import { useTheme } from "react-native-paper";
import Animated, { LinearTransition, useSharedValue } from "react-native-reanimated";
import Carousel, {
	ICarouselInstance,
	Pagination,
} from "react-native-reanimated-carousel";
import TransInfo from "../information/transInfo";

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
			count: index - progress.value,
			animated: true,
		})
	}

	return (
		<View className="flex-1">
			<Carousel
				ref={ref}
				width={width}
				height={width * .88}
				data={chunkedData}
				onProgressChange={progress}
				renderItem={({ item, index }) => (
					<Animated.View
						key={index}
						layout={LinearTransition}
					>
						{item.map((transaction, i) => (
							<TransInfo
								key={i}
								item={transaction}
								index={i}
								length={data.length}
							/>
						))}
					</Animated.View>
					// <Animated.FlatList
					// 	itemLayoutAnimation={LinearTransition}
					// 	data={item}
					// 	renderItem={({ item, index }) =>
					// 		<TransInfo
					// 			key={index}
					// 			item={item}
					// 			index={index}
					// 			length={data.length}
					// 		/>
					// 	}
					// />
				)}
				loop={false}
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