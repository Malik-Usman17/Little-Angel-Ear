import { CommonActions } from '@react-navigation/native';
import React from 'react';
import { Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenHeader from '../ReuseableComponents/ScreenHeader';
import appColors from '../appConstants/appColors';
import { appImages } from '../appConstants/appImages';
import appScreens from '../appConstants/appScreens';
import { clearStorageForLogout } from '../utils/AsyncStorageUtils';


const HomeScreen = ({ navigation }) => {

  async function handleLogOut() {
    try {
      await clearStorageForLogout();
      navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: appScreens.LoginScreen }] }))
    } catch (error) {
      console.error(error);
    }
  }

  const IconComponent = ({ image, backgroundColor, onPress, title }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={{ justifyContent: "center", alignItems: "center" }}
        onPress={onPress}
      >
        <View style={{ backgroundColor: backgroundColor, ...styles.imageContainer }}>
          <Image
            resizeMode='contain'
            source={image}
            style={styles.image}
          />
        </View>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>

      <StatusBar backgroundColor={appColors.white} barStyle={"dark-content"} />

      <ScreenHeader
        heading={"Select Patient"}
        rightTitle={"Logout"}
        onPressRight={handleLogOut}
      />

      <View style={styles.container}>
        <IconComponent
          image={appImages.plus}
          backgroundColor={"#afe5f3"}
          title={"New Patient"}
          onPress={() => navigation.navigate(appScreens.AddChild)}
        />

        <IconComponent
          image={appImages.search}
          backgroundColor={"#ffde84"}
          title={"Search Patient"}
          onPress={() => navigation.navigate(appScreens.ChildList)}
        />
      </View>

    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: appColors.white
  },
  container: {
    justifyContent: "space-evenly",
    flex: 1,
    paddingVertical: 10
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 92,
    width: 92,
    borderRadius: 46
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00194f',
    marginTop: 12
  },
  image: {
    height: 40,
    width: 40
  }
})


export default HomeScreen;