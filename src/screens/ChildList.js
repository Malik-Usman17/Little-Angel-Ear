import React, { useEffect, useState } from 'react';
import { FlatList, Image, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useDispatch, useSelector } from 'react-redux';
import CustomModal from '../ReuseableComponents/CustomModal';
import ScreenHeader from '../ReuseableComponents/ScreenHeader';
import appColors from '../appConstants/appColors';
import { appImages } from '../appConstants/appImages';
import appScreens from '../appConstants/appScreens';
import { getMedicalRecord, setMedicalRecord } from '../redux/slices';
import ApiConstants from "../services/ApiContants.json";
import { apiMethods } from '../services/apiMethods';
import { getToken } from '../utils/AsyncStorageUtils';
import { responsiveWidth } from "../utils/Scale";
const moment = require('moment');


const ChildList = ({ navigation }) => {

  const [searchKey, setSearchKey] = useState("");
  const [childData, setChildData] = useState([]);
  const [loading, setLoading] = useState(false)
  const [modalResponse, setModalResponse] = useState("")
  const [modal, setModal] = useState(false)
  const [modalMsg, setModalMsg] = useState("")

  const dispatch = useDispatch();
  const medicalRecords = useSelector(getMedicalRecord)

  const savingPatientInRedux = (data, childKey) => {
    const cachingArray = [...medicalRecords]
    const patientObjIndex = cachingArray.findIndex(val => val.childId == childKey)
    const updateObj = {
      _id: childKey,
      childId: childKey,
      fever: data.fever,
      earPain: data.earPain,
      duration: data.duration,
      omgradeScale: data.omgradeScale,
      nasalCongestion: data.nasalCongestion,
      AOM: data.finalDiagnosis.AOM,
      isAom: true,
      OtitisMedia: data.finalDiagnosis.OtitisMedia,
      isOtitisMedia: true,
      OtitisExterna: data.finalDiagnosis.OtitisExterna,
      isOtitisExterna: true,
      Earwax: data.finalDiagnosis.Earwax,
      isEarWax: true,
      Other: data.finalDiagnosis.Other,
      isOther: data.finalDiagnosis.Other != "" ? true : false,
      Normal: data.finalDiagnosis.Normal,
      videoDataUrls: {
        LeftEar: data.videoDataUrls[0],
        RightEar: data.videoDataUrls[1]
      }
    }
    if (patientObjIndex != -1) {
      cachingArray.splice(patientObjIndex, 1, updateObj)
    }
    else {
      cachingArray.push(updateObj)
    }
    dispatch(setMedicalRecord(cachingArray))
  }

  const checkPatientMedicalInfo = async (key, gender, data) => {
    try {
      setLoading(true)
      let token = await getToken()
      token = `bearer ${token}`
      const response = await apiMethods(
        ApiConstants.methods.GET,
        `${ApiConstants.endPoints.patientMedicalInfo}${key}`,
        {},
        { Authorization: token }
      )
      if (response.data.success == true) {
        if (response.data.data.length > 0) {
          savingPatientInRedux(response.data.data[0], key)
        }
        navigation.navigate(appScreens.EditPatientProfile,
          {
            isDataUploaded: response.data.data.length > 0 ? true : false,
            childKey: key,
            gender: gender,
            patientData: data,
            allPatientsData: childData
          }
        )
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



  const getPatientList = async () => {
    setLoading(true)
    try {
      let token = await getToken()
      token = `bearer ${token}`
      const response = await apiMethods(
        ApiConstants.methods.GET,
        ApiConstants.endPoints.patientList,
        {},
        { Authorization: token }
      )

      if (response.data.success == true) {
        setChildData(response.data.data)
      }
      else if (response.data.success == false) {
        setModalResponse(ApiConstants.reponseCode.failure)
        setModalMsg(response.data.errors[0].msg)
        setModal(true)
      }
      else {
        setModalResponse(ApiConstants.reponseCode.failure)
        setModalMsg(ApiConstants.message.WentWrong)
        setModal(true)
      }
    }
    catch (error) {
      setModalResponse(ApiConstants.reponseCode.failure)
      setModalMsg(ApiConstants.message.NetworkError)
      setModal(true)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getPatientList()
  }, [])


  const ListRenderComponent = ({ name, onPress, date }) => {
    return (
      <View style={{ marginHorizontal: 20, paddingTop: 25 }}>

        <TouchableOpacity activeOpacity={0.8} style={{ flexDirection: "row", alignItems: "center" }} onPress={onPress}>
          <Text style={{ fontFamily: 'CircularStd-Book', fontSize: 16, color: 'rgba(0, 0, 0, 0.87)', flex: 1 }}>
            {name}
          </Text>

          <Text style={{ color: 'rgba(0, 0, 0, 0.87)', fontFamily: 'CircularStd-Book', fontSize: 16, marginLeft: 25 }}>
            {date}
          </Text>

          <Image
            resizeMode='contain'
            source={appImages.rightArrow}
            style={{ height: 15, width: 15, marginLeft: 12 }}
          />
        </TouchableOpacity>

        <View style={{ ...styles.GreyLine, marginTop: 12 }} />

      </View>
    )
  }

  return (
    <SafeAreaView style={{ backgroundColor: appColors.white, flex: 1 }}>

      <StatusBar backgroundColor={appColors.white} barStyle={"dark-content"} />

      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{ color: appColors.white }}
      />

      <CustomModal
        modalVisible={modal}
        response={modalResponse}
        message={modalMsg}
        btnText={"Ok"}
        onPress={() => setModal(false)}
      />

      <ScreenHeader
        image={appImages.back}
        heading={"Patient Profile"}
        onPress={() => navigation.goBack()}
      />

      <View style={{
        backgroundColor: appColors.white, padding: 4,
        borderWidth: 1, borderRadius: 8, marginHorizontal: 10, marginTop: 10,
        borderColor: appColors.divider
      }}>
        <TextInput
          value={searchKey}
          onChangeText={setSearchKey}
          placeholder='Search Patient...'
        />
      </View>

      <View style={{ backgroundColor: '#f8f8f8', flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
          <Text style={[styles.TitleText, { fontSize: 12, color: '#333333' }]}> All Patient(s) </Text>
          <Text style={[styles.TitleText, { fontSize: 12, color: '#333333', marginRight: 25, textAlign: 'center' }]}>Date Of Birth </Text>
        </View>
      </View>

      <View style={styles.GreyLine} />

      <FlatList
        keyboardShouldPersistTaps="handled"
        data={childData}
        style={{ flex: 1, marginVertical: 5 }}
        keyExtractor={(item, index) => index}
        renderItem={({ item }) =>
          item.firstName.includes(searchKey) || item.lastName.includes(searchKey) ?
            <ListRenderComponent
              name={`${item.firstName} ${item.lastName}`}
              date={moment(new Date(item.birthDate)).format('YY/MM/DD')}
              onPress={() => checkPatientMedicalInfo(item._id, item.gender, item)}
            />
            : null
        }
      />

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flex: 1,
  },
  Header: {
    // paddingTop: 15,
    flexDirection: 'row',
    paddingHorizontal: 20,
    width: '100%',
    backgroundColor: '#ffffff',
    height: '10%',
    alignItems: 'center',
    alignSelf: 'center'
  },
  backBtnView: {
    height: 25,
    width: 25,
    justifyContent: 'center'
  },
  NameContainer: {
    width: '70%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  Name: {
    marginLeft: 45,
    fontFamily: 'CircularStd-Book',
    fontSize: 17,
    fontWeight: '600',
    color: '#030303'
  },
  TitleContainer: {
    backgroundColor: '#f8f8f8',
    flexDirection: 'row',
    // height: '5%',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  imageback: {
    height: 23,
    width: 35
  },
  TitleText: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    fontFamily: 'CircularStd-Book',
    color: '#758692',
    fontSize: 16,
  },

  GreyLine: {
    backgroundColor: appColors.divider,
    height: 1,
  },
  content: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    alignSelf: 'center',
    borderBottomWidth: 1,
    borderColor: '#C0C0C0',
    paddingTop: 10,
    paddingBottom: 10,
  },
  content1: {
    flex: 1,
    flexDirection: 'row',
    width: '40%',
    justifyContent: 'space-between',
    marginTop: '2%'
  },
  content2: {
    width: '100%',
    alignItems: 'flex-end',

    justifyContent: 'center',

  },
  imageView: {
    height: 56,
    width: 56,
    backgroundColor: '#84d2e5',
    borderRadius: 56 / 2,
    resizeMode: 'cover',
  },
  iconView: {
    marginTop: 5,
    height: 15,
    width: 15,

  },
  textView: {
    paddingLeft: 10,
    fontSize: 16,
    width: responsiveWidth(46),
    fontFamily: 'CircularStd-Book',
    paddingTop: 10,
    justifyContent: 'center',
  },

});


export default ChildList;