import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { IconButton } from 'react-native-paper'

interface HeaderBackArrowProps {
	canGoBack: boolean
	tintColor: string
}

export default function HeaderBackArrow({ canGoBack, tintColor }: HeaderBackArrowProps) {
	return canGoBack && canGoBack && (
		<IconButton
			icon={({ size }) => <Ionicons name="arrow-back" size={size - 5} color={tintColor} />}
			onPress={() => router.back()}
		/>
	)
}