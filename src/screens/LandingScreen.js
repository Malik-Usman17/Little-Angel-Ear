import { CommonActions } from '@react-navigation/native';
import React from 'react';
import { Image, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import CustomButton from '../ReuseableComponents/CustomButton';
import appColors from '../appConstants/appColors';
import { appImages } from '../appConstants/appImages';
import appScreens from '../appConstants/appScreens';


const LandingScreen = ({ navigation }) => {

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: appColors.white, justifyContent: "center", alignItems: "center" }}>

      <StatusBar backgroundColor={appColors.white} barStyle={"dark-content"} />

      <Image
        source={appImages.logo}
        style={{ height: 140, width: 140, resizeMode: "contain" }}
      />

      <CustomButton
        title={"LOGIN"}
        style={{ marginTop: 100 }}
        onPress={() => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: appScreens.LoginScreen }] }))}
      />
    </SafeAreaView>
  )
}

export default LandingScreen;


