import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomButton from '../ReuseableComponents/CustomButton';
import CustomInputField from '../ReuseableComponents/CustomInputField';
import CustomModal from '../ReuseableComponents/CustomModal';
import DatePickerComponent from '../ReuseableComponents/DatePickerComponent';
import GenderSelection from '../ReuseableComponents/GenderSelection';
import ScreenHeader from '../ReuseableComponents/ScreenHeader';
import appColors from '../appConstants/appColors';
import appScreens from '../appConstants/appScreens';
import { captilalizeFirstLetter } from '../appConstants/functions';
import ApiConstants from '../services/ApiContants.json';
import { apiMethods } from '../services/apiMethods';
import { getToken } from '../utils/AsyncStorageUtils';
import { responsiveWidth } from "../utils/Scale";


const moment = require('moment');

const EditPatientProfile = ({ route, navigation }) => {

  const { page, childKey, gender, patientData, allPatientsData, isDataUploaded } = route.params;

  console.log("Check Patient Status:", isDataUploaded)

  const [firstName, setFirstName] = useState(patientData?.firstName)
  const [lastName, setLastName] = useState(patientData?.lastName)
  const [editable, setEditable] = useState(false)
  const [patientGender, setPatientGender] = useState(gender)
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(patientData?.birthDate)
  const [loader, setLoader] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalResponse, setModalResponse] = useState("")
  const [modalMsg, setModalMsg] = useState("")

  const onPressHome = () => {
    const updatingArray = [...medicalRecords]
    const findObjIndex = updatingArray.findIndex(val => val._id == childKey)
    const newObj = {
      ...updatingArray[findObjIndex],
      omgradeScale: omgradeScale,
      isAom: aom,
      isOtitisMedia: otitisMedia,
      isOtitisExterna: otitisExterna,
      isEarWax: earWax,
      isOther: other,
      AOM: aomType,
      OtitisMedia: otitisMediaEarType,
      OtitisExterna: otitisExternaEarType,
      Earwax: earWaxEarType,
      Other: otherDescription,
      Normal: normal
    }
    updatingArray.splice(findObjIndex, 1, newObj)
    dispatch(setMedicalRecord(updatingArray))
    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: appScreens.HomeScreen }] }))
  }


  // const checkPatientMedicalInfo = async () => {
  //   try {
  //     setLoader(true)
  //     let token = await getToken()
  //     token = `bearer ${token}`
  //     const response = await apiMethods(
  //       ApiConstants.methods.GET,
  //       `${ApiConstants.endPoints.patientMedicalInfo}${childKey}`,
  //       {},
  //       { Authorization: token }
  //     )
  //     // console.log("RESSS:", response.data.data)
  //     if (response.data.success == true) {
  //       navigation.navigate(appScreens.PatientHistory, {
  //         isDataUploaded: response.data.data.length > 0 ? true : false,
  //         allPatientsData: allPatientsData,
  //         patientData,
  //         isNewChild: false,
  //         childKey: childKey,
  //         firstName: firstName,
  //         lastName: lastName,
  //         gender: gender,
  //         birthDate: dateOfBirth
  //       })
  //     }
  //     else {
  //       setModal(true)
  //       setModalResponse(ApiConstants.reponseCode.failure)
  //       setModalMsg(ApiConstants.message.WentWrong)
  //     }
  //   }
  //   catch (error) {
  //     setModal(true)
  //     setModalResponse(ApiConstants.reponseCode.failure)
  //     setModalMsg(ApiConstants.message.NetworkError)
  //   }
  //   finally {
  //     setLoader(false)
  //   }
  // }



  function isFormEmpty() {
    if (firstName === '') {
      Alert.alert("Please enter the first name");
      return true;
    }
    else if (lastName === '') {
      Alert.alert("Please enter the last name");
      return true;
    }
    else if (dateOfBirth === '') {
      Alert.alert("Please select a Date of Birth");
      return true;
    }
    else if (patientGender == "") {
      Alert.alert("Please select a gender");
      return true;
    }
    else {
      return false;
    }
  }

  async function handleOnPressSave() {
    if (!isFormEmpty()) {
      updateData();
      setEditable(false)
      return true;
    } else {
      setEditable(true)
    }

  }

  const handleUpdate = () => {
    let check;
    if (editable) {
      check = handleOnPressSave()
      return;
    }
    else {
      setEditable(true)
    }
  }


  async function updateData() {
    if (!isFormEmpty()) {
      Alert.alert(
        "Update confirm?",
        `Name: ${firstName} ${lastName}\nDOB: ${dateOfBirth}\nGender: ${captilalizeFirstLetter(patientGender)}`,
        [
          {
            text: 'cancel',
            style: 'destructive'
          },
          {
            text: 'confirm',
            onPress: () => updatePatientProfile(),
            style: 'default'
          },
        ],
      )
    }
  }

  const updatePatientProfile = async () => {
    setLoader(true)
    try {
      let body = {
        firstName: firstName,
        lastName: lastName,
        gender: patientGender,
        birthDate: dateOfBirth,
      }
      let token = await getToken()
      token = `bearer ${token}`
      const response = await apiMethods(
        ApiConstants.methods.PUT,
        `${ApiConstants.endPoints.updatePatientProfile}${childKey}`,
        body,
        { Authorization: token }
      )

      if (response.data.success == true) {
        setModal(true)
        setModalResponse(ApiConstants.reponseCode.success)
        setModalMsg("Updated patient profile successfully.")
      }
      else {
        setModal(true)
        setModalResponse(ApiConstants.reponseCode.failure)
        setModalMsg(ApiConstants.message.WentWrong)
      }
    }
    catch (error) {
      setModal(true)
      setModalResponse(ApiConstants.reponseCode.failure)
      setModalMsg(ApiConstants.message.NetworkError)
    }
    finally {
      setLoader(false)
    }
  }

  const handleConfirm = (date) => {
    setDateOfBirth(moment(date).format("YYYY-MM-DD"))
    setDatePickerVisibility(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: appColors.white }}>

      <ScreenHeader
        heading={`${firstName} ${lastName}`}
        iconName
        onPress={() => navigation.goBack()}
        rightTitle={editable ? 'Save' : 'Edit'}
        titleStyle={{ color: '#1e72be' }}
        // onPressRight={() => handleUpdate()}
        onPressRight={() => {
          if (!isDataUploaded) {
            handleUpdate()
          }
        }}
      // onPressRight={}
      />

      <Spinner
        visible={loader}
        textContent={'Loading...'}
        textStyle={{ color: appColors.white }}
      />

      <CustomModal
        modalVisible={modal}
        response={modalResponse}
        message={modalMsg}
        btnText={"Ok"}
        onPress={() => {
          if (modalResponse == ApiConstants.reponseCode.success) {
            navigation.navigate(appScreens.HomeScreen)
          }
          else {
            setModal(false)
          }
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, backgroundColor: appColors.white, paddingHorizontal: 30, paddingVertical: 20 }}
        contentContainerStyle={{ flexGrow: 1 }}
      >

        <Text style={styles.heading}>PATIENT PROFILE</Text>

        <CustomInputField
          title={"FIRST NAME"}
          // editable={!isDataUploaded : }
          style={{ marginTop: 20 }}
          mandatory
          value={firstName}
          editable={editable}
          onChangeText={setFirstName}
        />

        <CustomInputField
          title={"LAST NAME"}
          style={{ marginTop: 20 }}
          mandatory
          value={lastName}
          editable={editable}
          onChangeText={setLastName}
        />

        <DatePickerComponent
          disabled={!editable}
          dateOfBirth={dateOfBirth}
          isDatePickerVisible={isDatePickerVisible}
          onConfirm={handleConfirm}
          onCancel={() => setDatePickerVisibility(false)}
          onPress={() => setDatePickerVisibility(true)}
        />

        <GenderSelection
          gender={patientGender}
          disabled={!editable}
          onPressMale={() => setPatientGender("male")}
          onPressFemale={() => setPatientGender("female")}
        />

        <CustomButton
          style={{ width: "100%", marginTop: "auto" }}
          title="CONTINUE"
          // onPress={checkPatientMedicalInfo}
          onPress={() => {
            navigation.navigate(appScreens.PatientHistory, {
              isDataUploaded,
              allPatientsData: allPatientsData,
              patientData,
              isNewChild: false,
              childKey: childKey,
              firstName: firstName,
              lastName: lastName,
              gender: gender,
              birthDate: dateOfBirth
            })
          }}
        />

      </ScrollView>

    </SafeAreaView>
  )
}

export default EditPatientProfile;


const styles = StyleSheet.create({
  bg1: {
    // flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center', alignItems: 'center'
  },

  backBtnView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    width: 50
  },

  container: {
    // ...ifIphoneX({
    //     paddingTop: 40,
    // }, {
    //     paddingTop: 20,
    // }),
    // paddingTop: 20,
    flexDirection: 'row',
    paddingHorizontal: 20,
    width: '100%',
    backgroundColor: '#ffffff',
    height: '10%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between'
  },

  view2: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveWidth(36) / 2,
    height: responsiveWidth(36),
    width: responsiveWidth(36),
    alignSelf: 'center',
    //backgroundColor: 'rgba( 208, 77, 156, 0.4 )'
  },
  imageback: {
    height: 23,
    width: 35
  },

  heading: {
    fontSize: 17,
    fontWeight: '600',
    color: '#030303',
    fontFamily: 'CircularStd-Medium',
  },

  header: {
    marginLeft: 20,
    marginTop: 25,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },

  image1: {
    height: responsiveWidth(34),
    width: responsiveWidth(34),
    borderRadius: responsiveWidth(34) / 2,
  },

  title: {
    fontSize: 24,
    fontFamily: 'CircularStd-Bold',
    fontWeight: '600',
    color: 'rgba(0, 0, 0, 0.87)',
    marginTop: '2%'
  },

  bg2: {
    // flex: 1,
    marginTop: '20%',
    backgroundColor: 'white'
  },

  info1: {
    fontSize: 16,
    marginLeft: 20,
    color: '#030303',
    fontWeight: '600',
    marginBottom: -10,
    fontFamily: 'CircularStd-Book'
  },

  info2: {
    marginLeft: 20,
    fontFamily: 'CircularStd-Medium',
    fontSize: 16,
    fontWeight: 'normal',
    color: '#758692',
    justifyContent: 'center'
  },

  content2: {
    width: '96%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  HeaderText: {
    fontFamily: 'CircularStd-Medium',
    fontSize: 18,
    color: '#333333'
  },
  iconView: {
    height: 15,
    width: 15,
  },

  separator: {
    height: 1,
    width: '100%',
    backgroundColor: 'grey',
    marginTop: 10
  },

  container2: {
    height: '58%',
    // marginTop: '30%',
    alignItems: 'center',
    alignItems: 'center',
  },

  heading2: {
    fontWeight: '900',
    fontSize: 15,
    fontFamily: 'CircularStd-Medium',
    color: '#d04d9c'
  },

  buttontext: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 70,
    paddingRight: 70,
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'CircularStd-Medium',
    fontWeight: '900'
  },
  newScanButtonText: {
    paddingTop: 18,
    paddingBottom: 18,
    paddingLeft: 100,
    paddingRight: 100,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'CircularStd-Medium',
    fontWeight: '900'
  },
  GreyLine: {
    width: '100%',
    backgroundColor: appColors.divider,
    height: 1,
  },

  ImageContainer: {
    paddingTop: 15,
    paddingBottom: 5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },



  FormContainer: {
    // flexDirection: 'column',
    width: '80%',
    alignSelf: 'center',
    // alignItems: 'flex-start',
    // ...ifIphoneX({
    //   marginBottom: 2,
    // }, {
    //   marginBottom: 45,
    // }),
  },

  LabelText: {
    marginTop: 10,
    fontFamily: 'CircularStd-Medium',
    color: 'rgba(51, 51, 51, 0.4)',
    fontSize: 13,
    letterSpacing: 0.7
  },

  TextInput: {
    width: 200,
  },
  TextInput1: {
    fontSize: 17,
    color: '#333333',
    fontFamily: 'CircularStd-Medium',
    padding: 7
  },

  BoxContainer: {
    marginTop: 20,
    paddingVertical: 17,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },

  CheckBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '40%'
  },

  Image: {
    height: 22,
    width: 22
  },

  Text: {
    marginLeft: 10,
    fontFamily: 'CircularStd-Medium',
    color: '#333333',
    fontSize: 17,
  },
});

