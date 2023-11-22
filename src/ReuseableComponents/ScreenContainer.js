import { StyleSheet, Text, View, ScrollView, SafeAreaView, StatusBar } from 'react-native'
import React from 'react'
import appColors from '../appConstants/appColors'

const ScreenContainer = ({ scroll, children, scrollViewStyle }) => {
  return (
    <SafeAreaView style={styles.safeAreaContainer}>

      <StatusBar backgroundColor={appColors.white} barStyle={"dark-content"} />

      {children}

      {
        scroll ?
          <ScrollView style={scrollViewStyle}>
            {children}
          </ScrollView>
          :
          { children }
      }

    </SafeAreaView>
  )
}

export default ScreenContainer

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: appColors.white
  }
})