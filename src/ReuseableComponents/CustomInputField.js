import { StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'
import Entypo from "react-native-vector-icons/Entypo";
import appColors from '../appConstants/appColors';

const CustomInputField = ({ onChangeText, autoCapitalize, style, mobile, value, onIconPress, placeholder, secureTextEntry, editable, keyboardType, title, mandatory, maxLength, multiline }) => {
  return (
    <View style={[styles.container, style]}>

      <Text style={styles.LabelText}>{mandatory ? `${title} *` : `${title}`}</Text>

      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>

        {
          mobile &&
          <Text style={styles.contactPlus}>
            +
          </Text>
        }

        <TextInput
          style={styles.TextInput}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          placeholder={placeholder}
          maxLength={maxLength}
          multiline={multiline}
          editable={editable}
          value={value}
          secureTextEntry={secureTextEntry}
        />

        {
          onIconPress &&
          <Entypo
            name={secureTextEntry ? "eye-with-line" : "eye"}
            color={appColors.primaryColor}
            size={22}
            style={{ marginLeft: 5 }}
            onPress={onIconPress}
          />
        }

      </View>

      <View style={styles.UnderLine} />

    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    width: "100%",
  },
  LabelText: {
    fontFamily: 'CircularStd-Medium',
    color: appColors.smallHeading,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5
  },
  TextInput: {
    marginTop: 1,
    paddingVertical: 6,
    fontFamily: 'CircularStd-Medium',
    color: '#333333',
    fontSize: 16,
    flex: 1
  },
  UnderLine: {
    marginTop: 3,
    height: 1,
    backgroundColor: appColors.divider
  },
  contactPlus: {
    fontFamily: 'CircularStd-Medium',
    color: '#333333',
    fontSize: 16,
    marginVertical: 6
  }
});


export default CustomInputField;