import { StyleSheet, Text, View, TouchableOpacity, Image, Platform } from 'react-native'
import React from 'react'
import appColors from '../appConstants/appColors'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';



const ScreenHeader = ({ leftTitle, titleStyle, image, iconName, onPress, heading, rightTitle, onPressRight, onPressLeft }) => {
  return (
    <>
      <View style={Platform.OS == "android" ? styles.container : styles.containerIOS}>
        {
          leftTitle &&
          <TouchableOpacity activeOpacity={0.9} onPress={onPressLeft}>
            <Text style={styles.title}>{leftTitle}</Text>
          </TouchableOpacity>
        }

        {
          iconName &&
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
          >
            <MaterialIcons
              name="arrow-back-ios"
              size={30}
              color={appColors.primaryColor}
            />
          </TouchableOpacity>
        }

        <View style={styles.titleContainer}>
          <Text style={styles.Name}>{heading}</Text>
        </View>

        {
          rightTitle &&
          <TouchableOpacity activeOpacity={0.9} onPress={onPressRight}>
            <Text style={[styles.title, titleStyle]}>{rightTitle}</Text>
          </TouchableOpacity>
        }

      </View>

      <View style={styles.GreyLine} />
    </>
  )
}


const styles = StyleSheet.create({
  containerIOS: {
    backgroundColor: appColors.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 15,
    paddingTop: 7
  },
  container: {
    backgroundColor: appColors.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingBottom: 15,
    paddingTop: 12
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 5
  },
  title: {
    fontFamily: 'CircularStd-Medium',
    color: 'rgba(51,51,51,0.6)',
    fontSize: 18
  },
  rightText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00194f',
    marginLeft: 5
  },
  image: {
    height: 30,
    width: 30
  },
  Name: {
    textAlign: "center",
    fontFamily: 'CircularStd-Medium',
    fontSize: 18,
    fontWeight: "600",
    color: '#030303'
  },
  GreyLine: {
    backgroundColor: appColors.divider,
    height: 1,
  },
});


export default ScreenHeader;