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
    bottom: Platform.select({
      ios: '30%',
      android: '30%',
      web: '35%',
    }),    
  },
  bottomContainer: { 
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 16, 
    paddingHorizontal: 16,
    paddingBottom: Platform.select({
      ios: 40,
      android: 40,
      web: 20,
    }),    
    bottom: 0,
    width: '100%',
  },
  title: {
    fontSize: 14,
    fontWeight: 700,
    paddingBottom: 7,
    paddingTop: 20,
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 15, 
    backgroundColor: '#f3f3f3', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 30 
  },
  inputText: { 
    fontSize: 14, 
    fontWeight: '400', 
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
    fontWeight: '700', 
    textAlign: 'center', 
    fontSize: 12 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
});