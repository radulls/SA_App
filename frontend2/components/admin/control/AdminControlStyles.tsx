import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    backgroundColor: '#fff', 
    gap: 25,
    paddingBottom: 25
  },
  infoItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
  },
  label: { 
    fontSize: 12, 
    color: '#000', 
    fontWeight: '700' 
  },
  value: { 
    fontSize: 12, 
    fontWeight: '500' 
  },
  labelDelete:{
    color: '#f00'
  },
  restoreButton:{
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#000',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8
  },
  restoreText:{
    color: '#fff',
    fontSize: 12,
    fontWeight: '700'
  }
});