import { Chip, Text, useTheme } from "react-native-paper"
import { IconSource } from "react-native-paper/lib/typescript/components/Icon"

interface ChipsProps {
	chipText: string
	icon?: IconSource
	selected?: boolean
	onPress?: () => void
}


const ChipCustom = ({chipText, selected, icon, onPress} : ChipsProps) => {
	const theme = useTheme()

	return (
		<Chip
			mode="flat"
			icon={icon}
			onPress={onPress}
			selected={selected}
			// selectedColor={theme.colors.inverseOnSurface}
			selectedColor={theme.colors.onSecondaryContainer}
			closeIcon="cancel"
			showSelectedOverlay={true}
			background={{
				color: theme.colors.secondaryContainer,
			}}
			style={{
				// backgroundColor: selected ? theme.colors.secondary : theme.colors.elevation.level1,
				// backgroundColor: selected ? theme.colors.secondary : theme.colors.secondaryContainer,
				// borderColor: selected ? theme.colors.outline : theme.colors.outlineVariant

				padding: 3,
				backgroundColor: selected ? theme.colors.secondaryContainer : theme.colors.elevation.level1
			}}
		>
			{/* <Text color={selected ? theme.colors.onSecondary : theme.colors.onSurface}>{chipText}</Text> */}
			<Text
				style={{
					color: selected ? theme.colors.onSecondaryContainer : theme.colors.onSurface
				}}
			>
				{chipText}
			</Text>
		</Chip>
	)
}

export default ChipCustom