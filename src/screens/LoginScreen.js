import { CommonActions } from '@react-navigation/native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomButton from '../ReuseableComponents/CustomButton';
import CustomInputField from '../ReuseableComponents/CustomInputField';
import CustomModal from '../ReuseableComponents/CustomModal';
import Logo from '../ReuseableComponents/Logo';
import appColors from '../appConstants/appColors';
import appScreens from '../appConstants/appScreens';
import ApiConstants from "../services/ApiContants.json";
import { apiMethods } from '../services/apiMethods';
import { setUserToken } from '../utils/AsyncStorageUtils';


const LoginScreen = ({ navigation }) => {

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true)
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMsg, setModalMsg] = useState("")

  const onPressLogin = () => {
    if(userName == "" && password == ""){
      setModalMsg("Please fill all fields.")
      setModalVisible(true)
    }
    else if(userName == ""){
      setModalMsg("Please enter username.")
      setModalVisible(true)
    }
    else if(password == ""){
      setModalMsg("Please enter password.")
      setModalVisible(true)
    }
    else{
      login()
    }
  }

  const login = async () => {
    
    try {
      setLoading(true)
      
      let body = {
        userName: userName,
        password: password
      }

      const response = await apiMethods(
        ApiConstants.methods.POST,
        ApiConstants.endPoints.login,
        body
      )

      console.log("res:",response.data)

      if (response.data.success == true) {
        let token = response.data.data.token;
        await setUserToken(token);
        setTimeout(() => (
          navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: appScreens.HomeScreen }] }))
        ), 200)
      }
      else if (response.data.success == false) {
        setModalMsg(response.data.errors[0].msg)
        setModalVisible(true)
      }
      else {
        setModalMsg(ApiConstants.message.WentWrong)
        setModalVisible(true)
      }
    }
    catch (error) {
      setModalMsg(ApiConstants.message.NetworkError)
      setModalVisible(true)
    }
    finally {
      setLoading(false)
    }
  }

  console.log("modal:",modalVisible)

  return (
    <SafeAreaView style={styles.safeAreContainer}>

      <StatusBar backgroundColor={appColors.white} barStyle={"dark-content"} />

      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{ color: appColors.white }}
      />

      <CustomModal
        modalVisible={modalVisible}
        response={ApiConstants.reponseCode.failure}
        message={modalMsg}
        btnText={"Ok"}
        onPress={() => setModalVisible(false)}
      />

      <KeyboardAvoidingView
        behavior="height"
        style={{ flex: 1}}
      >

        <ScrollView
          keyboardShouldPersistTaps="handled"
          bounces={false}
          contentContainerStyle={styles.scrollContentContainer}
        >

          <Logo />

          <CustomInputField
            style={{ width: "80%", marginTop: 60 }}
            mandatory
            autoCapitalize={"none"}
            title={"USERNAME"}
            value={userName}
            onChangeText={setUserName}
          />

          <CustomInputField
            style={{ width: "80%", marginTop: 35 }}
            mandatory
            title={"PASSWORD"}
            value={password}
            secureTextEntry={secureText}
            onIconPress={() => setSecureText(!secureText)}
            onChangeText={setPassword}
          />

          <CustomButton
            style={{ marginTop: 60 }}
            title="Login"
            onPress={onPressLogin}
          />

        </ScrollView>
      
      </KeyboardAvoidingView>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeAreContainer: {
    backgroundColor: appColors.white,
    flex: 1,
    paddingVertical: 10
  },
  scrollContentContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1
  }
});



export default LoginScreen;