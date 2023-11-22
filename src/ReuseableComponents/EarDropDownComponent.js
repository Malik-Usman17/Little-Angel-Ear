import React from "react";
import { View, Text, StyleSheet } from "react-native";
import appColors from "../appConstants/appColors";
import { Picker } from '@react-native-picker/picker';

const EarDropDownComponent = ({ data, selectedValue, onValueChange }) => {
  return (
    <View>
      <Picker
        mode="dropdown"

        dropdownIconColor={appColors.primaryColor}
        selectedValue={selectedValue}
        onValueChange={onValueChange}
      >
        <Picker.Item label="--Select--" value={""} />
        {
          data.map((val, ind) => (
            <Picker.Item
              key={ind}
              label={val.item}
              value={val.item}
              fontFamily='CircularStd-Medium'
            />
          ))
        }
      </Picker>
      <View style={styles.line} />
    </View>
  )
}

const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: appColors.divider,
    marginHorizontal: 5
  },
})

export default EarDropDownComponent;