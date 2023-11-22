import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StatusBar, StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from '../ReuseableComponents/CustomButton';
import CustomInputField from '../ReuseableComponents/CustomInputField';
import CustomModal from '../ReuseableComponents/CustomModal';
import DatePickerComponent from '../ReuseableComponents/DatePickerComponent';
import GenderSelection from '../ReuseableComponents/GenderSelection';
import ScreenHeader from '../ReuseableComponents/ScreenHeader';
import appColors from '../appConstants/appColors';
import appScreens from '../appConstants/appScreens';
import { captilalizeFirstLetter } from '../appConstants/functions';
import { getMedicalRecord } from '../redux/slices';
import ApiConstants from '../services/ApiContants.json';
import { apiMethods } from '../services/apiMethods';
import { getToken } from '../utils/AsyncStorageUtils';
const moment = require('moment');



const AddChild = ({ navigation }) => {

  let date = new Date();

  const medicalRecords = useSelector(getMedicalRecord)
  const dispatch = useDispatch()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [gender, setGender] = useState("")
  // const [dob, setDob] = useState(moment(date).format('DD-MM-YYYY'))
  const [dob, setDob] = useState("")
  const [isDisabled, setIsDisabled] = useState(false)
  const [childId, setChildId] = useState("")
  const [modal, setModal] = useState(false)
  const [modalMsg, setModalMsg] = useState("")
  const [modalResponse, setModalResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [isDatePicker, setIsDatePicker] = useState(false)

  // console.log(medicalRecords.length)

  async function handleOnPressSave() {
    if (!isFormEmpty()) {
      Alert.alert(
        'Add this patient?',
        `Name: ${firstName} ${lastName}\nDOB: ${dob}\nGender: ${captilalizeFirstLetter(gender)}`,
        [
          {
            text: 'Cancel',
            style: 'destructive',
          },
          {
            text: 'Confirm',
            onPress: () => addPatient(),
            style: 'default',
          },
        ],
      );
    }
  }

  function isFormEmpty() {
    if (firstName === '') {
      setModalMsg('Please enter the first name.')
      setModalResponse(ApiConstants.reponseCode.failure)
      setModal(true)
      return true;
    }
    else if (lastName === '') {
      setModalMsg('Please enter the last name.')
      setModalResponse(ApiConstants.reponseCode.failure)
      setModal(true)
      return true;
    }
    else if (dob === '') {
      setModalMsg('Please select a Date of Birth.')
      setModalResponse(ApiConstants.reponseCode.failure)
      setModal(true)
      return true;
    }
    else if (gender == "") {
      setModalMsg('Please select a gender.')
      setModalResponse(ApiConstants.reponseCode.failure)
      setModal(true)
      return true;
    }
    else {
      return false;
    }
  }


  const addPatient = async () => {
    setLoading(true)
    let childId = generateID()
    try {
      let token = await getToken();
      token = `bearer ${token}`
      let body = {
        _id: childId,
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        birthDate: moment(dob, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      }
      const response = await apiMethods(
        ApiConstants.methods.POST,
        ApiConstants.endPoints.addPatient,
        body,
        { Authorization: token }
      )
      if (response.data.success == true) {
        const allPatients = response.data.data
        const patientObj = allPatients.find(val => val._id == childId)
        alertForSave(childId, allPatients, patientObj);
      }
      else if (response.data.success == false) {
        setModal(true)
        setModalResponse(ApiConstants.reponseCode.failure)
        setModalMsg(response.data.errors[0].msg)
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
      setLoading(false)
    }
  }


  const alertForSave = (childId, allMedicalRecord, addedPatientObj) => {
    Alert.alert('Registered', 'Patient registered successfully.', [
      {
        text: 'OK',
        onPress: () => navigation.navigate(appScreens.PatientHistory, {
          isDataUploaded: false,
          allPatientsData: allMedicalRecord,
          patientData: addedPatientObj,
          page: 'NewTest',
          firstName: firstName,
          lastName: lastName,
          gender: gender,
          childKey: childId,
          birthDate: moment(dob, 'DD-MM-YYYY').format('YYYY-MM-DD'),
          isNewChild: true
        })
      },
    ]);
  };


  const generateID = () => {
    let dateOfBirth = moment(dob, 'DD-MM-YYYY').format('DDMMYY');
    let childID = firstName.slice(0, 2).toUpperCase() + date.getDate() + date.getMilliseconds() + lastName.slice(0, 2).toUpperCase() + dateOfBirth + gender.slice(0, 1).toUpperCase();
    return childID
  };

  // console.log("CHILD ID:", generateID())

  const onConfirmDate = (date) => {
    setDob(moment(date).format("YYYY-MM-DD"))
    setIsDatePicker(false)
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>

      <StatusBar backgroundColor={appColors.white} barStyle={"dark-content"} />

      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{ color: appColors.white }}
      />

      <ScreenHeader
        heading={"Patient Profile"}
        leftTitle={"Cancel"}
        onPressLeft={() => navigation.goBack()}
      />

      <CustomModal
        modalVisible={modal}
        response={modalResponse}
        message={modalMsg}
        btnText={"Ok"}
        onPress={() => setModal(false)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollViewContainer}
        keyboardShouldPersistTaps="handled"
      >

        <CustomInputField
          title="FIRST NAME"
          mandatory
          value={firstName}
          onChangeText={setFirstName}
        />

        <CustomInputField
          title="LAST NAME"
          mandatory
          value={lastName}
          onChangeText={setLastName}
        />

        <DatePickerComponent
          isDatePickerVisible={isDatePicker}
          dateOfBirth={dob}
          onConfirm={onConfirmDate}
          onCancel={() => setIsDatePicker(false)}
          onPress={() => setIsDatePicker(true)}
        />

        <GenderSelection
          gender={gender}
          onPressMale={() => setGender("male")}
          onPressFemale={() => setGender("female")}
        />

        <CustomButton
          title="Save"
          style={styles.saveButton}
          disabled={isDisabled}
          onPress={handleOnPressSave}
        />

      </ScrollView>

    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: appColors.white
  },
  scrollViewContainer: {
    flex: 1,
    marginHorizontal: 30,
    paddingVertical: 20
  },
  saveButton: {
    alignSelf: "center",
    marginTop: 60,
    width: "100%"
  },
  GreyLine: {
    width: '100%',
    backgroundColor: appColors.divider,
    height: 1,
  },
  NameContainer: {
    width: '60%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  Name: {
    marginLeft: 45,
    fontFamily: 'CircularStd-Book',
    fontSize: 17,
    fontWeight: '600',
    color: '#030303',
  },
  ImageContainer: {
    paddingTop: 15,
    paddingBottom: 5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  LabelText: {
    marginTop: 10,
    fontFamily: 'CircularStd-Medium',
    color: 'rgba(51, 51, 51, 0.4)',
    fontSize: 13,
    letterSpacing: 0.7,
  },
  TextInput: {
    width: 200,
  },
  TextInput1: {
    fontSize: 17,
    color: '#333333',
    fontFamily: 'CircularStd-Medium',
    padding: 7,
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
    width: '40%',
  },

  Image: {
    height: 22,
    width: 22,
  }
});


export default AddChild;