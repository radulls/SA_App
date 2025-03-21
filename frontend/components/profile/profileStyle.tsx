import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  scrollViewContent: {
    alignItems: 'center',
    width: '100%',
  },
  contentContainer: {
    maxWidth: 600,
    width: '100%',
  },
  headerButtons: {
    position: 'absolute',
    top: 55,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  qrIcon: {
    width: 22,
    height: 22,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sosIcon: {
    width: 22,
    height: 22,
  },
  settingsIcon: {
    width: 22,
    height: 22,
  },
  coverImageContainer: {
    width: '100%',
    aspectRatio: 414 / 210, // Рассчитанное соотношение 414:210 = 1.971:1
  },
  coverImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#D2D2D2',
    resizeMode: 'cover',  // Сохраняет пропорции изображения при изменении размеров контейнера
  },
  divider: {
    backgroundColor: 'rgba(236, 236, 236, 1)',
    minHeight: 0.5,
    marginTop: 20,
    marginBottom: 20,
    width: '100%',
  },
  backIcon: {
    marginLeft: -20,
    marginTop: -20,
  },
  moreIcon: {
    padding: 20,
    marginRight: -20,
    marginTop: -20,
  },
  settingIcon: {
    marginLeft: 20,
  },
  settingIconSos:{
    marginLeft: 0,
  },
  sosActiveContainer:{
    backgroundColor: '#F00',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sosActiveText:{
    fontSize: 12,
    fontFamily: "SFUIDisplay-semiBold",
    color: '#fff'
  },
});