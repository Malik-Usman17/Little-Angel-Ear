import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import appColors from '../appConstants/appColors'
import CheckBoxComponent from './CheckBoxComponent'
import { appImages } from '../appConstants/appImages'

const GenderSelection = ({ disabled, gender, onPressMale, onPressFemale }) => {
  return (
    <View style={{ marginTop: 20, marginBottom: 10 }}>

      <Text style={styles.title}>
        GENDER *
      </Text>

      <View style={styles.checkBoxContainer}>
        <CheckBoxComponent
          style={styles.container}
          disabled={disabled}
          imageStyle={styles.circleImage}
          title="Male"
          image={gender == "male" ? appImages.success : appImages.emptyCircle}
          onPress={onPressMale}
        />
        <CheckBoxComponent
          style={styles.container}
          disabled={disabled}
          imageStyle={styles.circleImage}
          title="Female"
          image={gender == "female" ? appImages.success : appImages.emptyCircle}
          onPress={onPressFemale}
        />
      </View>

      <View style={styles.GreyLine} />

    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  GreyLine: {
    marginTop: 5,
    width: '100%',
    backgroundColor: appColors.divider,
    height: 1,
  },
  checkBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
  },
  title: {
    fontFamily: 'CircularStd-Medium',
    color: appColors.smallHeading,
    fontSize: 13,
    letterSpacing: 0.7
  },
  circleImage: {
    height: 23,
    width: 23
  }
});


export default GenderSelection;