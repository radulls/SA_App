import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 16
  },
  scrollView: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    overflowX:'visible',
    overflowY:'visible',
    height: '100%'
  },
  scrollViewContent: {
    paddingBottom: 90,
    alignItems: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    width: '100%',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  topItems:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  topText:{
    fontSize: 14,
    fontWeight: '700',
  },
  showButton:{
    color: '#7D90A9',
    fontSize: 12,
    fontWeight: '700',
  },
  formWrapper: {
    paddingTop: 35,
    width: '100%',
  },
  cityWrapper:{
    marginBottom: 14,
  },
  subtitle: {
    color: '#8B8B8B',
    fontSize: 12,
    fontWeight: '400',
    width: '100%',
    textAlign: 'left',
    paddingBottom: 20,
  },
  showSurnameContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  showSurnameText: {
    fontSize: 14,
    fontWeight: '700'
  },
  switchWrapper: {
    width: 35,
    height: 22,
    borderRadius: 15,
    padding: 2,
    justifyContent: 'center',
    position: 'relative',
  },
  switchThumb: {
    position: 'absolute',
    width: 20,
    height: 19,
    backgroundColor: '#FFF',
    borderRadius: 13,
  },
  ContinueButton: {
    paddingBottom: 40,
    width: '100%',
    maxWidth: 600,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationContainer:{

  },
  verificationTitle:{

  },
  buttonContainer:{
    width: '100%',
    paddingTop: 27,
  },
  confirmButton:{
    backgroundColor: '#F1F1F1',
    borderRadius: 8,
    width: 124,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText:{
    fontSize: 12,
    fontWeight: '700'
  },
  approveButtonContainer:{
    paddingTop: 86,
    alignItems: 'center',
  },
  approveButton:{
    width: 172,
    height: 44,
    backgroundColor: '#000',
  },
  approveText:{
    color: '#fff',
  },
  errorContainer:{
    position:'relative',
    width: '100%',
  },
  errorMessage:{
    top: 0,
  },
  forgotPassword:{
    color: '#7D90A9',
    fontSize: 12,
    fontWeight: '700',
  },
  modalContainer:{
    flex: 1,
    alignItems: 'center'
  },
  fullscreenModal: {    
    paddingHorizontal: 16,
    paddingTop: 58,
    width: '100%',
    height: '100%',
    maxWidth: 600,
  },
  topContainer:{
    position: 'relative',
  },
  input: {
    borderRadius: 12,
    backgroundColor: 'rgba(243, 243, 243, 1)',
    paddingVertical: 14,
    paddingHorizontal: 12,
    color: 'rgba(0, 0, 0, 1)',
    textAlignVertical: 'top',
    width: '100%',
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  inputText: {
    fontSize: 14,
    fontFamily: "SFUIDisplay-regular",
  },
  inputFocused: {
    borderWidth: 1,
    borderColor: 'rgba(66, 66, 66, 100)',
  },
  titleSearch: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 15,
    fontFamily: "SFUIDisplay-bold",
  },
  closeButton: {
    position: 'absolute',
    top: 3,
    left: 0,
    zIndex: 20,
  },  
  cityItem: {
    paddingVertical: 10,
  },
  cityName: {
    fontSize: 14,
    fontWeight: '400'
  },
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  overlayTouchable: {
    flex: 1,
  },
  modalContent: {
    maxWidth: 600,
    width: '100%',
    maxHeight: '75%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 52,
  },
  dragHandleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 10,
  },
  dragHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#DADBDA',
    borderRadius: 3,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
    paddingTop: 20,
    position: 'relative',
  },
  inputSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  inputSearch: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingLeft: 10,
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  inputAdded:{
    marginBottom: 20,
  },
  emptyText:{
    color: '#000'
  },
  userItem:{
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  userImage: {
    width: 38,
    height: 38,
    borderRadius: 25,
    marginRight: 12,
  },
  nameContainer:{
  },
  username:{
    color: '#000',
    fontSize: 14,
    fontWeight: '700'
  },
  name:{
    color: '#000',
    fontSize: 12,
    fontWeight: '400'
  },
  codeText: {
    fontSize: 18,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  backButton: {
    marginTop: 10,
  },
  backButtonText: {
    color: '#007bff',
    fontSize: 16,
  },
  // Активационный код
  buttonRow:{ 
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  buttonRowItem:{
    justifyContent: 'center',
    flex: 1
  },
  typeButton:{
    borderBottomWidth: 0.5,
    borderColor: '#ECECEC',
  },
  activeTypeButton:{
    borderBottomWidth: 2,
    borderColor: '#000',
  },
  buttonRowText:{
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color:'#ECECEC',
    paddingBottom: 12
  },
  buttonRowTextSelected:{
    color:'#000'
  },
  generateButton: {
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    paddingVertical: 14.5,
    alignItems: 'center',
    marginTop: 20,
  },
  generateButtonText: {
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 12,
    fontWeight: 'bold',
  },
  label: {
    color: 'rgba(0, 0, 0, 1)',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  inputCopy:{
    borderRadius: 12,
    backgroundColor: 'rgba(243, 243, 243, 1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  copyIcon:{
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 15,
  },
  userCopyIcon:{
    paddingBottom: 0,
  },
  rightItems:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  invitedNumbers:{
    fontSize: 12,
    fontWeight: '500',
    marginRight: 8,
  },
  userCodeContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ECECEC',
    paddingTop: 20,
    paddingBottom: 15,
  },
  userCode:{
    fontSize: 14,
    fontWeight: '700'
  },
  codeNumber:{
    fontSize: 12,
    fontWeight: '500'
  },
  usedCodeContainer:{
    alignItems: 'center',
  },
  usedCode:{
    fontSize: 12,
    fontWeight: '700',
    color: '#6E6E6E',
  },
  usedDate: {
    fontSize: 12,
    color: '#6E6E6E',
    marginTop: 5,
  },
  usedDateText:{
    fontSize: 12,
    fontWeight: '700',
  },
  settingsItem:{
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  subContainer:{
    backgroundColor: '#FFD200'
  },
  title:{
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    color:'#fff',
    marginTop: 30,
    marginBottom: 12,
  },
  description:{
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    color:'#fff'
  },
  bottomItems:{
    width: '100%'
  },
  subsInfo:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  check:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  subsText:{
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  subsTextPrice:{
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  subsButton:{
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 14.5,
    alignItems: 'center',
  },
  subsButtonText:{
    fontSize: 12,
    fontWeight: 'bold',
  },
  touchableOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    maxWidth: 600,
  },
  overlayTouchableArea: {
    flex: 1,
    width: '100%',
  },
  
});