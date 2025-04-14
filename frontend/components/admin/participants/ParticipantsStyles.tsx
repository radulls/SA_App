import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
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
});