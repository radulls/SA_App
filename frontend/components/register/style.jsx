import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    form: {
      marginTop: 28,
    },
    title: {
      fontSize: 18,
     // fontFamily: "SFUIDisplay-Bold",
      color: 'white',
      fontWeight: '700',
    },
    description: {
      // fontFamily: "SFUIDisplay-medium",
      marginTop: 10,
      color: 'white',
      fontSize: 12,
      marginBottom: 30, 
    },
    inputContainer: {
      marginBottom: 0, 
    },
    label: {
      fontSize: 14,
      // fontFamily: "SFUIDisplay-Bold",
      color: 'white',
      marginBottom: 7, 
    },
    input: {
      borderRadius: 12,
      backgroundColor: 'rgba(255, 255, 255, 1)',
      height: 48,
      paddingLeft: 12, 
    },
    termsText: {
      marginTop: 0,      
    },
    termsRegular: {
      fontSize: 12,
      color: 'rgba(139, 139, 139, 1)',
      // fontFamily: "SFUIDisplay-regular",
    },
    termsHighlight: {
      fontSize: 12,
      // fontFamily: "SFUIDisplay-Bold",
      color: 'rgba(148,179,255,1)',
    },
    agreementContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 20,
      maxWidth: '92%'
    },
    checkbox: {
      width: 18,
      height: 18,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 5,
      backgroundColor: '#1E1E1E',
    },
    checkboxIcon: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxText: {
      color: 'rgba(148,179,255,1)',
      fontSize: 14,
      fontWeight: 'bold',
    },
  });
export default styles;
