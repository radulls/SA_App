import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flex: 1,
  },
  header:{
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 25,
  },
  closeIcon:{
    position: 'absolute',
    left: 0
  },
  title:{
    fontSize: 15,
    fontWeight: '700',
  },
  postTypeContainer:{

  },
  postType:{
    paddingVertical: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postTypeText:{
    color: '#000',
    fontWeight: '700',
    fontSize: 12,
  },
  line:{
    backgroundColor: '#ececec',
    height: 0.5
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  citySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 25,
  },
  cityIcon: {
    backgroundColor: "#000",
    borderRadius: 4,
    width: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  cityIconText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  cityName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  groupsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  groupButton: {
    height: 36,
    width: 106,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 8,
  },
  groupButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  groupText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  groupTextActive: {
    color: '#fff',
  },
  selectionCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#DFDFDF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  selectionCircleSelected: {
    backgroundColor: 'black',
    borderWidth: 0,
  },
  selectionCircleSelectedAdmin:{
    backgroundColor: 'none',
    borderWidth: 7,
    borderColor: '#000'
  },
  nextButton: {
    marginTop: 'auto',
    paddingVertical: 18,
    backgroundColor: '#000',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fromRow: {
    marginBottom: 25,
  },
  fromLabel: {
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 8,
  },
  fromButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  fromButton: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#EFEFEF'
  },
  fromButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  fromText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#808080',
  },
  fromTextActive: {
    color: '#fff',
  },
  emergencyButton:{
    paddingVertical: 20,
  },
  emergency:{
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  emergencyText:{
    color: '#808080',
    fontSize: 12,
    fontWeight: '400',
    maxWidth: 307,
  },
});
