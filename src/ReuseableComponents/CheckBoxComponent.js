import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';


const CheckBoxComponent = ({ style, imageStyle, disabled, onPress, image, title, titleStyle }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      disabled={disabled}
      style={[styles.container, style]}
      onPress={onPress}
    >
      <Image
        resizeMode='contain'
        source={image}
        style={[styles.image, imageStyle]}
      />
      <Text style={[styles.title, titleStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 7
  },
  image: {
    height: 30,
    width: 30
  },
  title: {
    marginLeft: 10,
    flex: 1,
    fontFamily: 'CircularStd-Medium',
    color: '#333333',
    fontSize: 17
  }
});


export default CheckBoxComponent;