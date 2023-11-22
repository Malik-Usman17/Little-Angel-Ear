import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import appColors from '../appConstants/appColors'

const CustomButton = ({ title, onPress, style, titleStyle, disabled, activeOpacity }) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={activeOpacity}
      style={[styles.container, style]}
      onPress={onPress}
    >
      <Text style={[styles.buttonTxt, titleStyle]}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.primaryColor,
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 25,
    width: "80%"
  },
  buttonTxt: {
    color: appColors.white,
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'CircularStd-Medium'
  },
});

export default CustomButton;