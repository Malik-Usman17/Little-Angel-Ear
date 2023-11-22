import { StyleSheet, Text, StatusBar, View, Modal, Image, TouchableOpacity, SafeAreaView } from 'react-native'
import React from 'react'
import appColors from '../appConstants/appColors';
import ApiConstants from '../services/ApiContants.json';
import { appImages } from '../appConstants/appImages';


const CustomModal = ({ modalVisible, message, response, btnText, onPress }) => {
  return (
    <Modal
      transparent={true}
      visible={modalVisible}
    >
      <SafeAreaView style={styles.ModalContainer}>
        
        <StatusBar backgroundColor={appColors.modalBg} barStyle={"dark-content"} />
        
        <View style={styles.Modal}>
          <Image
            resizeMode='contain'
            style={{ height: 110, width: 110 }}
            source={response == ApiConstants.reponseCode.success ? appImages.success : appImages.failure}
          />
          <Text style={styles.ModalText}>{message}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={onPress}
          >
            <Text style={styles.btnText}>{btnText}</Text>
          </TouchableOpacity>

        </View>
      
      </SafeAreaView>
    
    </Modal>
  )
}

const styles = StyleSheet.create({
  ModalContainer: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    backgroundColor: appColors.modalBg,
    alignItems: "center"
  },
  Modal: {
    width: '85%',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: appColors.white,
    borderRadius: 15,
    alignItems: 'center',
  },
  ModalText: {
    marginTop: 20,
    fontFamily: 'CircularStd-Medium',
    fontSize: 18,
    color: '#1e72be',
    textAlign: 'center',
  },
  button: {
    backgroundColor: appColors.primaryColor,
    padding: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 20
  },
  btnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: appColors.white
  }
});


export default CustomModal;