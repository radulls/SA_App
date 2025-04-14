import * as React from "react";
import {
	View,
	StyleSheet,
	Image,
	Text,
	TouchableOpacity,
} from "react-native";

const sosData = [
	{
		id: 1,
		count: 2,
		description: "Нужна помощь",
	}
];

function SOSNotification() {
	return (
		<View style={styles.notificationContainer}>
			<View style={styles.notificationCard}>
				<View style={styles.contentWrapper}>
					<Image
						resizeMode="contain"
						source={ require('../assets/images/Кнопка Sos.png')}
						style={styles.alertIcon}
						accessible={true}
						accessibilityLabel="SOS Alert Icon"
					/>
					<View style={styles.textContainer}>
						<View style={styles.headerContainer}>
							<View>
								<Text style={styles.headerText}>SOS</Text>
							</View>
							<View>
								<Text style={styles.countText}>({sosData[0].count})</Text>
							</View>
						</View>
						<View style={styles.descriptionContainer}>
							<Text style={styles.descriptionText}>{sosData[0].description}</Text>
						</View>
					</View>
				</View>
				<TouchableOpacity
					style={styles.actionButton}
					accessible={true}
					accessibilityLabel="View SOS details"
					accessibilityRole="button"
				>
					<Text style={styles.actionButtonText}>Смотреть</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	notificationContainer: {
		// maxWidth: 382,
		backgroundColor: '#F5F5F5',
		margin: 10,
		borderRadius: 14,
		flexDirection: "row",
		alignItems: "stretch",
		fontFamily: "SF UI Display, sans-serif",
	},
	notificationCard: {
		borderRadius: 14,
		width: "100%",
		paddingHorizontal: 17,
		paddingVertical: 13,
		alignItems: "stretch",
		display: 'flex',
		flexDirection: 'row',
		gap: 20,
		justifyContent: "space-between",
	},
	contentWrapper: {
		display: "flex",
		flexDirection: 'row',
		alignItems: "stretch",
		gap: 12,
		color: "rgba(0, 0, 0, 1)",
	},
	alertIcon: {
		position: "relative",
		marginVertical: "auto",
		width: 22,
		flexShrink: 0,
		aspectRatio: 1,
	},
	textContainer: {
		flexDirection: "column",
		alignItems: "stretch",
	},
	headerContainer: {
		flexDirection: "row",
		alignItems: "stretch",
		gap: 8,
	},
	headerText: {
		fontSize: 14,
		fontWeight: "700",
	},
	countText: {
		fontSize: 14,
		fontWeight: "700",
	},
	descriptionContainer: {
		marginTop: 4,
	},
	descriptionText: {
		fontSize: 12,
		fontWeight: "400",
	},
	actionButton: {
		borderRadius: 8,
		marginVertical: "auto",
		paddingHorizontal: 10,
		paddingVertical: 9,
		backgroundColor: "#000000",
		width: 81
	},
	actionButtonText: {
		fontSize: 12,
		color: "rgba(255, 255, 255, 1)",
		fontWeight: "700",
		textAlign: "center",
	},
});

export default SOSNotification;