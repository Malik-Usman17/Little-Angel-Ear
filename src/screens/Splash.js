import { CommonActions } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Image, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import appColors from '../appConstants/appColors';
import { appImages } from '../appConstants/appImages';
import appScreens from '../appConstants/appScreens';
import { getToken } from "../utils/AsyncStorageUtils";

const Splash = ({ navigation }) => {

  const getDataFromLoginScreen = async () => {
    let authToken = await getToken();
    if (authToken) {
      navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: appScreens.HomeScreen }] }))
    }
    else {
      navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: appScreens.LandingScreen }] }))
    }
  }

  useEffect(() => {
    setTimeout(() => {
      getDataFromLoginScreen()
    }, 1000);
  }, [])

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar backgroundColor={appColors.white} barStyle={"dark-content"} />
      <Image
        resizeMode='contain'
        source={appImages.logo}
        style={styles.logo}
      />
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: appColors.white,
    justifyContent: "center",
    alignItems: "center"
  },
  logo: {
    height: 200,
    width: 200
  }
});

export default Splash;