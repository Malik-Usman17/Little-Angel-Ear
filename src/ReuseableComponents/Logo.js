import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { appImages } from '../appConstants/appImages';

const Logo = () => {
  return (
    <Image
      source={appImages.logo}
      style={styles.image}
    />
  )
}



const styles = StyleSheet.create({
  image: {
    height: 140,
    width: 140
  }
});


export default Logo;