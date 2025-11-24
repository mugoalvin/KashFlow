import IndexLayout from '@/app/(home)/_layout';
import AnalysisLayout from '@/app/(transactions)/_layout';

import Settings from '@/app/settings';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import { BottomNavigation } from 'react-native-paper';

const Tab = createBottomTabNavigator();

export default function PaperBottomNavigation() {
	return (
		<Tab.Navigator
			screenOptions={{
				animation: 'shift',
				headerShown: false
			}}
			tabBar={({ navigation, state, descriptors, insets }) => (
				<BottomNavigation.Bar
					navigationState={state}
					safeAreaInsets={insets}
					onTabPress={({ route, preventDefault }) => {
						const event = navigation.emit({
							type: 'tabPress',
							target: route.key,
							canPreventDefault: true,
						});

						if (event.defaultPrevented) {
							preventDefault();
						} else {
							navigation.dispatch({
								...CommonActions.navigate(route.name, route.params),
								target: state.key,
							});
						}
					}}
					renderIcon={({ route, focused, color }) =>
						descriptors[route.key].options.tabBarIcon?.({
							focused,
							color,
							size: 24,
						}) || null
					}
					getLabelText={({ route }) => {
						const { options } = descriptors[route.key];
						const label =
							typeof options.tabBarLabel === 'string'
								? options.tabBarLabel
								: typeof options.title === 'string'
									? options.title
									: route.name;

						return label;
					}}
				/>
			)}>
			<Tab.Screen
				name="Home"
				component={IndexLayout}
				options={{
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons name="home" color={color} size={size} />
					),
				}}
			/>
			<Tab.Screen
				name='Analysis'
				component={AnalysisLayout}
				options={{
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons name="chart-bell-curve-cumulative" color={color} size={size} />
					)
				}}
			/>
			<Tab.Screen
				name="Settings"
				component={Settings}
				options={{
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons name="cog" color={color} size={size} />
					),
				}}
			/>
		</Tab.Navigator>
	);
}