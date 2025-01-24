import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { toastConfig } from '@/config/toastConfig';
import Toast from 'react-native-toast-message';



export default function RootLayout() {
	return (
		<GestureHandlerRootView style={styles.container}>
			<Stack
				screenOptions={{
					headerShown: false,
				}}
			>
				<Stack.Screen name="index" />				
			</Stack>
			<Toast config={toastConfig} />
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
