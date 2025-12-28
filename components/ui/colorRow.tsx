import useSnackbarContext from '@/contexts/SnackbarContext'
import useThemeContext from '@/contexts/ThemeContext'
import { Ionicons } from '@expo/vector-icons'
import { Pressable } from 'react-native'
import { useMMKVString } from 'react-native-mmkv'
import { Text, useTheme } from 'react-native-paper'
import { FlatGrid } from 'react-native-super-grid'

interface ColorRowProps {
	title: string
	colors?: string[]
	closeSheet: () => void
}

export default function ColorRow({ colors, title, closeSheet }: ColorRowProps) {
	const theme = useTheme()
	const { resetTheme, updateTheme } = useThemeContext()
	const { showSnackbar } = useSnackbarContext()
	const colorsToDisplay = colors ? colors : [theme.colors.primary]
	const [accentColor, setAccentColor] = useMMKVString('accentColor')

	return (
		<>
			<Text style={{ color: theme.colors.onSurfaceVariant }}>{title}</Text>
			<FlatGrid
				className='gap-3'
				itemDimension={60}
				data={colorsToDisplay as readonly string[]}
				renderItem={({ item: backgroundColor }) =>
					<Pressable
						key={backgroundColor}
						className='flex-1 items-center justify-center h-12 aspect-square rounded-full mr-2'
						style={{
							backgroundColor
						}}
						onPress={() => {
							closeSheet && closeSheet()

							if (colors) {
								setAccentColor(backgroundColor)
								updateTheme(backgroundColor)
								showSnackbar({
									message: "Theme Updated"
								})
							} else {
								resetTheme()
								showSnackbar({
									message: "Theme Reset"
								})

							}
						}}
					>
						{
							accentColor === backgroundColor &&
							<Ionicons name='checkmark' size={20} color={theme.colors.onSurface} />
						}
					</Pressable>
				}
			/>
		</>
	)
}