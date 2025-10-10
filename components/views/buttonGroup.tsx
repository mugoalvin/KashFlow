import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

type buttonsType = 'all' | 'moneyOut' | 'moneyIn'

export default function ButtonGroup() {
	const theme = useTheme()
	const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
	const [selectedButton, setSelectedButton] = useState<buttonsType>('all')

	const buttons = [
		{ title: "All", type: 'all' },
		{ title: "Money Out", type: 'moneyOut' },
		{ title: "Money In", type: 'moneyIn' },
	];

	function ButtonInGroup({ button, index, length }: any) {
		// Shared values for each corner and background
		const tl = useSharedValue(12);
		const bl = useSharedValue(12);
		const tr = useSharedValue(12);
		const br = useSharedValue(12);
		const bg = useSharedValue(0); // 0 = unselected, 1 = selected

		useEffect(() => {
			// Default radii
			let newTL = 12, newBL = 12, newTR = 12, newBR = 12;
			if (index === 0) {
				newTL = 24;
				newBL = 24;
			}
			if (index + 1 === length) {
				newTR = 24;
				newBR = 24;
			}
			if (button.type === selectedButton) {
				newTL = newBL = newTR = newBR = 40;
				bg.value = withTiming(1, { duration: 350 });
			} else {
				bg.value = withTiming(0, { duration: 350 });
			}
			tl.value = withSpring(newTL, { damping: 18, stiffness: 120 });
			bl.value = withSpring(newBL, { damping: 18, stiffness: 120 });
			tr.value = withSpring(newTR, { damping: 18, stiffness: 120 });
			br.value = withSpring(newBR, { damping: 18, stiffness: 120 });
		}, [index, length, button.type, tl, bl, tr, br, bg]);

		const animatedStyle = useAnimatedStyle(() => {
			const backgroundColor = interpolateColor(
				bg.value,
				[0, 1],
				[theme.colors.elevation.level2, theme.colors.secondaryContainer]
			);
			return {
				backgroundColor,
				borderTopLeftRadius: tl.value,
				borderBottomLeftRadius: bl.value,
				borderTopRightRadius: tr.value,
				borderBottomRightRadius: br.value,
			};
		});

		return (
			<AnimatedPressable
				className={"flex-1 items-center justify-center"}
				style={animatedStyle}
				onPress={() => setSelectedButton(button.type)}
			>
				<Text>{button.title}</Text>
			</AnimatedPressable>
		)
	}

	return (
		<View className="flex-row h-14 justify-between gap-[2]">
			{
				buttons.map((button, index) => (
					<ButtonInGroup key={index} button={button} index={index} length={buttons.length} />
				))
			}
		</View>
	)
}