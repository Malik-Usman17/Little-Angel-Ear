import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import appColors from '../appConstants/appColors'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

const DatePickerComponent = ({ isDatePickerVisible, onConfirm, onCancel, dateOfBirth, onPress, disabled }) => {

  return (
    <>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        maximumDate={new Date()}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />

      <TouchableOpacity
        activeOpacity={1}
        disabled={disabled}
        onPress={onPress}
        style={{ marginTop: 20 }}
      >
        <Text style={styles.title}>
          DATE OF BIRTH *
        </Text>

        <Text style={styles.value}>
          {dateOfBirth}
        </Text>

        <View style={styles.GreyLine} />

      </TouchableOpacity>
    </>
  )
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'CircularStd-Medium',
    color: appColors.smallHeading,
    fontWeight: '600',
    letterSpacing: 0.5
  },
  value: {
    fontFamily: 'CircularStd-Medium',
    fontSize: 17,
    margin: 5,
    marginTop: 9,
    color: appColors.black
  },
  GreyLine: {
    width: '100%',
    marginTop: 2,
    backgroundColor: appColors.divider,
    height: 1,
  }
});


export default DatePickerComponent;