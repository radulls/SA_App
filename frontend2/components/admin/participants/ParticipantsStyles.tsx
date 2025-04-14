import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: '100%',
    paddingHorizontal: 16,
  },
  contentContainer:{
    paddingHorizontal: 16,
  },
  paddingHorizontalContainer:{
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  verifiedUserCard:{
    alignItems: 'flex-start',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  username: {
    fontSize: 14,
    fontWeight: '700',
  },
  name: {
    fontSize: 12,
    fontWeight: '400',
    color: '#555',
    paddingTop: 5,
    paddingBottom: 8
  },
  notVerifiedName:{
    paddingBottom: 0,
  },
  noUsers: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
  },
  photoNameContainer:{
    flexDirection: 'row'
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontFamily: "SFUIDisplay-regular",
    fontSize: 12,
    color: "rgba(153, 153, 153, 1)",
  },
  value: {
    fontFamily: "SFUIDisplay-bold",
    fontSize: 12,
    color: "#000",
    paddingVertical: 3,
    paddingHorizontal: 3,
    fontWeight: '700',
  },
  ratingBackground: {
    backgroundColor: "#FFE772",
    paddingHorizontal: 2.5,
    paddingVertical: 3,
    borderRadius: 3,
  },
  marketCard:{
    
  },
  marketUserInfo:{
    flexDirection: 'row'
  },
  marketContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  marketName:{
    fontSize: 12,
    fontWeight: '700',
    color: '#000'
  },
  marketPhoto: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  marketPhotoFallback: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ccc', // серый фон
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  marketPhotoInitial: {
    color: '#fff', // белая буква
    fontWeight: 'bold',
    fontSize: 12,
  },
  presentButton:{
    width: 134,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    borderRadius: 8,
  },
  addAdmin:{
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  }
});