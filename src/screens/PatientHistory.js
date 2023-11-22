import { useIsFocused } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useDispatch, useSelector } from 'react-redux';
import CheckBoxComponent from '../ReuseableComponents/CheckBoxComponent';
import CustomButton from '../ReuseableComponents/CustomButton';
import CustomModal from '../ReuseableComponents/CustomModal';
import ScreenHeader from '../ReuseableComponents/ScreenHeader';
import appColors from '../appConstants/appColors';
import { appImages } from '../appConstants/appImages';
import appScreens from '../appConstants/appScreens';
import { getMedicalRecord, setMedicalRecord } from '../redux/slices';
import ApiConstants from "../services/ApiContants.json"
import appKeys from '../appConstants/appKeys';
import { launchImageLibrary } from 'react-native-image-picker';



const PatientHistory = ({ route, navigation }) => {

  const { firstName, lastName, childKey, isDataUploaded } = route.params;

  const patientsData = useSelector(getMedicalRecord);

  const findPatientObj = patientsData?.find(val => val._id == childKey)

  console.log("Find Patient OBJ:", findPatientObj)

  const dispatch = useDispatch()
  const isFocused = useIsFocused()

  const [fever, setFever] = useState(findPatientObj?.fever ? findPatientObj.fever : "No")
  const [earPain, setEarPain] = useState(findPatientObj?.earPain ? findPatientObj.earPain : "No")
  const [infection, setInfection] = useState(findPatientObj?.nasalCongestion ? findPatientObj.nasalCongestion : "No")
  const [days, setDays] = useState(findPatientObj?.duration ? findPatientObj?.duration : 0)
  // const [isDisabled, setIsDisabled] = useState(patientData.fever ? true : false)
  const [isDisabled, setIsDisabled] = useState(isDataUploaded)
  const [modal, setModal] = useState(false)
  const [modalResponse, setModalResponse] = useState("")
  const [modalMsg, setModalMsg] = useState("")


  const ArrowButtonComponent = ({ iconName, onPress, disabled }) => {
    return (
      <TouchableOpacity disabled={disabled} onPress={onPress}>
        <MaterialIcons
          name={iconName}
          size={24}
          color={appColors.primaryColor}
        />
      </TouchableOpacity>
    )
  }


  const ReuseableComponent = ({ value, title, setValue }) => {
    return (
      <View style={styles.componentContainer}>

        <View style={{ flex: 1, marginRight: 5 }}>
          <Text style={styles.title}>{title}</Text>
        </View>

        <CheckBoxComponent
          style={styles.checkBoxStyle}
          disabled={isDisabled}
          title={"Yes"}
          titleStyle={styles.checkBoxTitle}
          image={value == "Yes" ? appImages.success : appImages.emptyCircle}
          imageStyle={styles.circle}
          onPress={() => setValue("Yes")}
        />

        <CheckBoxComponent
          imageStyle={styles.circle}
          disabled={isDisabled}
          style={{ ...styles.checkBoxStyle }}
          titleStyle={styles.checkBoxTitle}
          image={value == "No" ? appImages.success : appImages.emptyCircle}
          title={"No"}
          onPress={() => setValue("No")}
        />

        <CheckBoxComponent
          imageStyle={styles.circle}
          disabled={isDisabled}
          style={styles.checkBoxStyle}
          titleStyle={styles.checkBoxTitle}
          image={value == "N/A" ? appImages.success : appImages.emptyCircle}
          title={"N/A"}
          onPress={() => setValue("N/A")}
        />

      </View>
    )
  }

  const openGallery = async (earType) => {
    const updatingData = [...patientsData]
    const findIndex = updatingData.findIndex(item => item._id == childKey)
    const response = await launchImageLibrary({
      mediaType: "video",
      maxHeight: 600,
      maxWidth: 600,
      durationLimit: 5,
      videoQuality: Platform.OS == "android" ? "low" : "medium",
    })
    if (response.assets) {
      console.log(response.assets[0].uri)
      navigation.navigate(appScreens.Preview, {
        firstName,
        lastName,
        childKey,
        videoUri: response.assets[0].uri,
        earType: earType
      })
    }
  }

  // firstName, lastName, childKey, videoUri, page, patientObj, earType 


  const patientsCachingRecord = () => {
    if (isDataUploaded == false) {
      console.log("runnig")
      const cachingArr = [...patientsData]
      const searchIndex = cachingArr?.findIndex(item => item._id == childKey)
      if (searchIndex != -1) {
        const updateObj = {
          ...cachingArr[searchIndex],
          childId: childKey,
          fever: fever,
          earPain: earPain,
          nasalCongestion: infection,
          duration: days
        }
        cachingArr.splice(searchIndex, 1, updateObj)
        dispatch(setMedicalRecord(cachingArr))
      }
      else {
        newObj = {
          _id: childKey,
          childId: childKey,
          fever: fever,
          earPain: earPain,
          nasalCongestion: infection,
          duration: days
        }
        cachingArr.push(newObj)
        dispatch(setMedicalRecord(cachingArr))
      }
    }
  }


  useEffect(() => {
    patientsCachingRecord()
  }, [])


  const onPressContinue = () => {
    if (isDataUploaded == false) {
      const updatingArray = [...patientsData]
      const findObjIndex = updatingArray.findIndex(val => val._id == childKey)
      const newObj = {
        ...updatingArray[findObjIndex],
        fever: fever,
        earPain: earPain,
        nasalCongestion: infection,
        duration: days
      }
      updatingArray.splice(findObjIndex, 1, newObj)
      dispatch(setMedicalRecord(updatingArray))
      if (fever == "Yes" && days == 0) {
        setModal(true)
        setModalResponse(ApiConstants.reponseCode.failure)
        setModalMsg("Please tell the duration of fever.")
      }
      else {
        navigation.navigate(appScreens.PhysicianDx, {
          firstName,
          lastName,
          childKey,
          isDataUploaded: false
        })
      }
    }
    else {
      navigation.navigate(appScreens.PhysicianDx, {
        firstName,
        lastName,
        childKey,
        isDataUploaded: true
      })
    }
  }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: appColors.white }}>

      <StatusBar backgroundColor={appColors.white} barStyle={"dark-content"} />

      <ScreenHeader
        iconName
        heading={`${firstName} ${lastName}`}
        onPress={() => navigation.goBack()}
      />

      <CustomModal
        modalVisible={modal}
        response={modalResponse}
        message={modalMsg}
        btnText={"Ok"}
        onPress={() => setModal(false)}
      />

      <ScrollView style={{ padding: 20 }} contentContainerStyle={{ flex: 1 }}>

        <Text style={styles.screenHeading}>PATIENT HISTORY</Text>

        <ReuseableComponent
          title="Ear Pain"
          value={earPain}
          setValue={setEarPain}
        />

        <ReuseableComponent
          title="Fever as reported by parent"
          value={fever}
          setValue={(val) => {
            setFever(val)
            if (val != "Yes") {
              setDays(0)
            }
          }}
        />

        {
          fever == "Yes" &&
          <View style={{ marginTop: 25 }}>

            <Text style={styles.title}>DURATION (IN CONSECUTIVE DAYS)</Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>

              <Text style={{ ...styles.title, fontSize: 18, flex: 1 }}>{days}</Text>

              <View style={{ alignItems: "center" }}>
                <ArrowButtonComponent
                  disabled={(days == 0 || isDataUploaded == true) ? true : false}
                  iconName={"keyboard-arrow-up"}
                  onPress={() => setDays(days - 1)}
                />
                <ArrowButtonComponent
                  disabled={isDisabled}
                  iconName={"keyboard-arrow-down"}
                  onPress={() => setDays(days + 1)}
                />
              </View>

            </View>

            <View style={{ backgroundColor: appColors.divider, height: 1 }} />

          </View>
        }

        <ReuseableComponent
          title="Ongoing upper respiratory tract infection/nasal congestion"
          value={infection}
          setValue={setInfection}
        />

        {
          !isDataUploaded &&
          <View style={{ marginTop: "auto" }}>
            <CustomButton
              style={{ width: "100%" }}
              activeOpacity={0.9}
              title={"SELECT VIDEO OF L EAR"}
              onPress={() => openGallery(appKeys.leftEar)}
            // onPress={() => navigation.navigate(appScreens.Scan, { earType: appKeys.leftEar, firstName, lastName, childKey })}
            />

            <CustomButton
              style={{ width: "100%", marginTop: 10 }}
              activeOpacity={0.9}
              title={"SELECT VIDEO OF R EAR"}
              onPress={() => openGallery(appKeys.rightEar)}
            // onPress={() => navigation.navigate(appScreens.Scan, { earType: appKeys.rightEar, firstName, lastName, childKey })}
            />
          </View>
        }

        <CustomButton
          style={{ width: "100%", marginTop: !isDataUploaded ? 10 : "auto" }}
          activeOpacity={0.9}
          title={"CONTINUE"}
          onPress={onPressContinue}
        />

      </ScrollView>

    </SafeAreaView>
  )
}

export default PatientHistory;

const styles = StyleSheet.create({
  screenHeading: {
    fontSize: 17,
    fontWeight: '600',
    color: '#030303',
    fontFamily: 'CircularStd-Medium'
  },
  componentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20
  },
  title: {
    fontFamily: 'CircularStd-Medium',
    color: appColors.black,
    fontSize: 15
  },
  circle: {
    height: 18,
    width: 18
  },
  checkBoxRowContainer: {
    flexDirection: "row",
    flex: 0.8,
    alignSelf: "flex-end"
  },
  checkBoxStyle: {
    marginBottom: 0,
    flex: 0.4
  },
  checkBoxTitle: {
    marginLeft: 5,
    fontSize: 14
  }
})