import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  block: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  container: { 
    width: '100%', 
    height: '100%', 
    position: 'relative',
    paddingBottom: 30 
  },
  geoButton: { 
    position: 'absolute', 
    zIndex: 400, 
    right: 16, 
    top: -78,   
  },
  bottomContent:{
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  bottomContentContainer:{
    position: 'relative',
  },
  bottomContainer:{
    gap: 10,
    backgroundColor: '#fff', 
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 40,
    borderTopRightRadius: 16, 
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 16, 
    borderBottomLeftRadius: 16,
  },
  title: {
    fontSize: 14,
    fontFamily: "SFUIDisplay-bold",
    paddingBottom: 7,
    paddingTop: 20,
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 14, 
    backgroundColor: '#f3f3f3', 
    height: 48,
    paddingLeft: 14,
    paddingRight: 14,
    borderRadius: 12, 
    marginBottom: 30, 
  },
  inputText: { 
    fontSize: 14, 
    fontFamily: "SFUIDisplay-regular",
    color: '#000' 
  },
  button: { 
    padding: 15, 
    borderRadius: 8, 
    backgroundColor: '#000', 
    width: '100%', 
  },
  modalOpen: { 
    alignItems: 'center', 
    flex: 1,
    paddingBottom: 10
  },
  modalContainer: { 
    width: '100%', 
    height: '100%', 
    paddingVertical: 30, 
    paddingHorizontal: 16, 
    maxWidth: 600 
  },
  buttonText: { 
    color: '#fff', 
    fontFamily: "SFUIDisplay-bold",
    textAlign: 'center', 
    fontSize: 12 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalTopContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 37,
  },
  modalTitle:{
    fontFamily: "SFUIDisplay-regular",
    fontSize: 15,
  },
  addButton:{
    fontFamily: "SFUIDisplay-regular",
    fontSize: 14,
  }
});