import { SafeAreaView, StyleSheet, StatusBar, Text, View, ScrollView, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import appColors from '../appConstants/appColors'
import ScreenHeader from '../ReuseableComponents/ScreenHeader'
import { Picker } from '@react-native-picker/picker';
import { appImages } from '../appConstants/appImages'
import CheckBoxComponent from '../ReuseableComponents/CheckBoxComponent'
import EarDropDownComponent from '../ReuseableComponents/EarDropDownComponent';
import CustomButton from '../ReuseableComponents/CustomButton';
import appScreens from '../appConstants/appScreens';
import { getMedicalRecord, setMedicalRecord } from '../redux/slices';
import { useSelector, useDispatch } from 'react-redux';
import { apiMethods } from '../services/apiMethods';
import ApiConstants from '../services/ApiContants.json'
import Spinner from 'react-native-loading-spinner-overlay';
import CustomModal from '../ReuseableComponents/CustomModal';
import { getToken } from '../utils/AsyncStorageUtils';
import { CommonActions } from '@react-navigation/native';

const PhysicianDx = ({ navigation, route }) => {

  const { firstName, lastName, childKey, isDataUploaded } = route.params;
  // console.log("CHILD KEY:", childKey)
  const medicalRecords = useSelector(getMedicalRecord);
  const patientDataObj = medicalRecords.find(val => val._id == childKey)
  const [isDisabled, setIsDisabled] = useState(isDataUploaded)

  const dispatch = useDispatch()

  // console.log("PATIENT OBJ:", patientDataObj)

  // console.log("PHYSICIAN DX:", patientDataObj)

  const [omgradeScale, setOmgradeScale] = useState(patientDataObj?.omgradeScale ? patientDataObj?.omgradeScale : "")
  const [aom, setAOM] = useState(patientDataObj?.isAom ? patientDataObj?.isAom : false)
  const [aomType, setAomType] = useState(patientDataObj?.AOM ? patientDataObj?.AOM : "")
  const [earWax, setEarWax] = useState(patientDataObj?.isEarWax ? patientDataObj?.isEarWax : false)
  const [otitisMedia, setOtitisMedia] = useState(patientDataObj?.isOtitisMedia ? patientDataObj?.isOtitisMedia : false)
  const [otitisExterna, setOtitisExterna] = useState(patientDataObj?.isOtitisExterna ? patientDataObj?.isOtitisExterna : false)
  const [normal, setNormal] = useState(patientDataObj?.Normal ? patientDataObj?.Normal : false)
  const [otitisMediaEarType, setOtitisMediaEarType] = useState(patientDataObj?.OtitisMedia ? patientDataObj?.OtitisMedia : "")
  const [otitisExternaEarType, setOtitisExternaEarType] = useState(patientDataObj?.OtitisExterna ? patientDataObj?.OtitisExterna : "")
  const [earWaxEarType, setEarWaxType] = useState(patientDataObj?.Earwax ? patientDataObj?.Earwax : "")
  const [other, setOther] = useState(patientDataObj?.isOther ? patientDataObj?.isOther : false)
  const [otherDescription, setOtherDescription] = useState(patientDataObj?.Other ? patientDataObj?.Other : "")
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalResponse, setModalResponse] = useState("")
  const [modalMsg, setModalMsg] = useState("")

  const finalDiagnosisObject = () => {
    const body = {
      childId: patientDataObj.childId,
      videoDataUrls: [patientDataObj.videoDataUrls.LeftEar, patientDataObj.videoDataUrls.RightEar],
      fever: patientDataObj.fever,
      earPain: patientDataObj.earPain,
      duration: patientDataObj.duration.toString(),
      nasalCongestion: patientDataObj.nasalCongestion,
      omgradeScale: omgradeScale,
      finalDiagnosis: {
        AOM: aomType,
        OtitisMedia: otitisMediaEarType,
        OtitisExterna: otitisExternaEarType,
        Earwax: earWaxEarType,
        Other: otherDescription,
        Normal: normal.toString()
      }
    }
    return body
  }

  useEffect(() => {
    if (aom == false) {
      setAomType("")
    }
    if (otitisMedia == false) {
      setOtitisMediaEarType("")
    }
    if (otitisExterna == false) {
      setOtitisExternaEarType("")
    }
    if (earWax == false) {
      setEarWaxType("")
    }
    if (other == false) {
      setOtherDescription("")
    }
  }, [aom, otitisMedia, otitisExterna, otitisMedia, earWax, other])


  const pickerData = [
    { id: 1, item: "0" },
    { id: 2, item: "1" },
    { id: 3, item: "2" },
    { id: 4, item: "3" },
    { id: 5, item: "4" },
    { id: 6, item: "5B" },
    { id: 7, item: "5C" },
    { id: 8, item: "6" }
  ]

  const earTypes = [
    { id: 1, item: "Left Ear" },
    { id: 2, item: "Right Ear" },
    { id: 3, item: "Both Ears (affected)" }
  ]


  const patientsCachingRecord = () => {
    const cachingArr = [...medicalRecords]
    const updatingObj = cachingArr.find(val => val._id == childKey)
    const findIndex = cachingArr.findIndex(item => item._id == childKey)
    const newObj = {
      ...updatingObj,
      omgradeScale: omgradeScale,
      isAom: aom,
      AOM: aomType,
      isOtitisMedia: otitisMedia,
      OtitisMedia: otitisMediaEarType,
      isOtitisExterna: otitisExterna,
      OtitisExterna: otitisExternaEarType,
      isEarWax: earWax,
      Earwax: earWaxEarType,
      isOther: other,
      Other: otherDescription,
      Normal: normal
    }
    cachingArr.splice(findIndex, 1, newObj)
    dispatch(setMedicalRecord(cachingArr))
  }

  useEffect(() => {
    patientsCachingRecord()
  }, [])


  const onPressHome = () => {
    if (isDataUploaded == true) {
      navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: appScreens.HomeScreen }] }))
    }
    else {
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
  }


  const uplaodPatientMedicalData = async () => {
    try {
      setLoading(true)
      let token = await getToken()
      token = `bearer ${token}`
      const response = await apiMethods(
        ApiConstants.methods.POST,
        ApiConstants.endPoints.UploadPatientMedicalRecord,
        finalDiagnosisObject(),
        { Authorization: token }
      )

      if (response.data.success == true) {
        setIsModalOpen(true)
        setModalResponse(ApiConstants.reponseCode.success)
        setModalMsg("Data has been uploaded successfully.")
      }
      else {
        setIsModalOpen(true)
        setModalResponse(ApiConstants.reponseCode.failure)
        setModalMsg(ApiConstants.reponseCode.failure)
      }
    }
    catch (error) {
      // console.log("catch:", error)
      setModalResponse(ApiConstants.reponseCode.failure)
      setIsModalOpen(true)
      setModalMsg(ApiConstants.message.NetworkError)
    }
    finally {
      setLoading(false)
    }
  }

  const onPressSubmit = async () => {
    if (isDataUploaded == true) {
      navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: appScreens.HomeScreen }] }))
    }
    else {
      if (omgradeScale == "" || aom == "" || otitisMediaEarType == "" || otitisExternaEarType == "" || earWaxEarType == "") {
        setIsModalOpen(true)
        setModalResponse(ApiConstants.reponseCode.failure)
        setModalMsg("Please fill all the fields.")
      }
      else if (other == true && otherDescription == "") {
        setModalResponse(ApiConstants.reponseCode.failure)
        setIsModalOpen(true)
        setModalMsg("Please specify reason.")
      }
      else if (!patientDataObj.videoDataUrls) {
        setModalResponse(ApiConstants.reponseCode.failure)
        setIsModalOpen(true)
        setModalMsg("Please take the scan of both ears.")
      }
      else if (patientDataObj.videoDataUrls.LeftEar == "") {
        setModalResponse(ApiConstants.reponseCode.failure)
        setIsModalOpen(true)
        setModalMsg("Please take the scan of left ear.")
      }
      else if (patientDataObj.videoDataUrls.RightEar == "") {
        setModalResponse(ApiConstants.reponseCode.failure)
        setIsModalOpen(true)
        setModalMsg("Please take the scan of right ear.")
      }
      else {
        uplaodPatientMedicalData()
      }
    }
  }


  // console.log("AOM:", aom)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: appColors.white }}>

      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{ color: appColors.white }}
      />

      <CustomModal
        modalVisible={isModalOpen}
        response={modalResponse}
        message={modalMsg}
        btnText={"Ok"}
        onPress={() => {
          if (modalResponse == ApiConstants.reponseCode.failure) {
            setIsModalOpen(false)
          }
          else {
            navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: appScreens.HomeScreen }] }))
          }
        }}
      />

      <StatusBar backgroundColor={appColors.white} barStyle={"dark-content"} />

      <ScreenHeader
        iconName
        heading={`${firstName} ${lastName}`}
        onPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >

        <Text style={styles.screenHeading}>PHYSICIAN DX:</Text>

        <View style={{ marginTop: 20 }}>
          <Text style={styles.subHeading}>1. OMGRADE SCALE</Text>
          <Picker
            mode="dropdown"
            dropdownIconColor={appColors.primaryColor}
            selectedValue={omgradeScale}
            onValueChange={(itemValue, itemIndex) =>
              setOmgradeScale(itemValue)
            }>
            <Picker.Item label="--Select--" value={""} />
            {
              pickerData.map((val, ind) => (
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

        <View style={{ marginTop: 25 }}>

          <Text style={styles.subHeading}>2. FINAL DIAGNOSIS FROM SELECTION</Text>

          <CheckBoxComponent
            style={{ marginBottom: 0, marginTop: 10 }}
            image={aom ? appImages.success : appImages.emptyCircle}
            disabled={isDisabled}
            imageStyle={styles.circle}
            titleStyle={styles.checkBoxTitle}
            title="AOM"
            onPress={() => setAOM(!aom)}
          />

          {
            (aom == true || isDataUploaded == true) &&
            <EarDropDownComponent
              data={earTypes}
              selectedValue={aomType}
              onValueChange={setAomType}
            />
          }

        </View>

        <CheckBoxComponent
          style={{ marginBottom: 0, marginTop: 20 }}
          image={otitisMedia ? appImages.success : appImages.emptyCircle}
          disabled={isDisabled}
          imageStyle={styles.circle}
          titleStyle={styles.checkBoxTitle}
          title="Otitis media with effusion"
          onPress={() => setOtitisMedia(!otitisMedia)}
        />

        {
          (otitisMedia == true || isDataUploaded == true) &&
          <EarDropDownComponent
            data={earTypes}
            selectedValue={otitisMediaEarType}
            onValueChange={setOtitisMediaEarType}
          />
        }

        <CheckBoxComponent
          style={styles.checkBoxStyle}
          image={otitisExterna ? appImages.success : appImages.emptyCircle}
          disabled={isDisabled}
          imageStyle={styles.circle}
          titleStyle={styles.checkBoxTitle}
          title="Otitis externa: infection of the external auditory canal"
          onPress={() => setOtitisExterna(!otitisExterna)}
        />

        {
          (otitisExterna == true || isDataUploaded == true) &&
          <EarDropDownComponent
            data={earTypes}
            selectedValue={otitisExternaEarType}
            onValueChange={setOtitisExternaEarType}
          />
        }

        <CheckBoxComponent
          style={styles.checkBoxStyle}
          image={earWax ? appImages.success : appImages.emptyCircle}
          disabled={isDisabled}
          imageStyle={styles.circle}
          titleStyle={styles.checkBoxTitle}
          title="Earwax Buildup"
          onPress={() => setEarWax(!earWax)}
        />

        {
          (earWax == true || isDataUploaded == true) &&
          <EarDropDownComponent
            data={earTypes}
            selectedValue={earWaxEarType}
            onValueChange={setEarWaxType}
          />
        }

        <CheckBoxComponent
          style={styles.checkBoxStyle}
          image={other ? appImages.success : appImages.emptyCircle}
          disabled={isDisabled}
          imageStyle={styles.circle}
          titleStyle={styles.checkBoxTitle}
          title="Other (Please Specify)"
          onPress={() => setOther(!other)}
        />

        {
          (other == true || isDataUploaded == true) &&
          <View>
            <TextInput
              style={{ fontFamily: 'CircularStd-Book' }}
              value={otherDescription}
              onChangeText={setOtherDescription}
            />
            <View style={{ ...styles.line, marginHorizontal: 5 }} />
          </View>
        }

        <CheckBoxComponent
          style={{ ...styles.checkBoxStyle, marginBottom: 20 }}
          image={normal ? appImages.success : appImages.emptyCircle}
          disabled={isDisabled}
          imageStyle={styles.circle}
          titleStyle={styles.checkBoxTitle}
          title="Normal"
          onPress={() => setNormal(!normal)}
        />

        <CustomButton
          title="SUBMIT"
          style={{ marginTop: "auto", width: "100%", backgroundColor: isDataUploaded ? appColors.divider : appColors.primaryColor }}
          onPress={onPressSubmit}
        />

        <CustomButton
          title="HOME"
          style={{ marginTop: 10, width: "100%" }}
          onPress={onPressHome}
        />

      </ScrollView>

    </SafeAreaView>
  )
}

export default PhysicianDx

const styles = StyleSheet.create({
  screenHeading: {
    fontSize: 17,
    fontWeight: '600',
    color: appColors.black,
    fontFamily: 'CircularStd-Medium'
  },
  line: {
    height: 1,
    backgroundColor: appColors.divider
  },
  subHeading: {
    fontFamily: 'CircularStd-Book',
    fontSize: 15,
    color: appColors.black
  },
  checkBoxStyle: {
    marginBottom: 0,
    marginTop: 12,
  },
  circle: {
    height: 18,
    width: 18
  },
  checkBoxTitle: {
    marginLeft: 9,
    fontFamily: 'CircularStd-Book',
    fontSize: 16
  }
})