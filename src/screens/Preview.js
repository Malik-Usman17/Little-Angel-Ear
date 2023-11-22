import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { ifIphoneX } from "react-native-iphone-x-helper/index";
import Video from 'react-native-video';
import Spinner from "react-native-loading-spinner-overlay";
import { scanVideoUpload } from "../api/Api";
import { apiMethods } from '../services/apiMethods';
import ApiConstants from "../services/ApiContants.json";
import { getToken } from '../utils/AsyncStorageUtils';
import CustomModal from '../ReuseableComponents/CustomModal';
import appScreens from '../appConstants/appScreens';
import { useDispatch, useSelector } from 'react-redux';
import { getMedicalRecord, setMedicalRecord } from '../redux/slices';


var moment = require('moment');


const Preview = ({ navigation, route }) => {

  const { firstName, lastName, childKey, videoUri, earType } = route.params;

  // console.log(route.params);

  const dispatch = useDispatch()
  const medicalRecords = useSelector(getMedicalRecord)
  const updatingArray = [...medicalRecords]
  const findPatientObj = updatingArray.find(val => val._id == childKey)
  const findPatientObjIndex = updatingArray.findIndex(item => item._id == childKey)

  const rightEarVideo = findPatientObj?.videoDataUrls.RightEar
  const leftEarVideo = findPatientObj?.videoDataUrls.LeftEar

  console.log("Right Ear Video:", rightEarVideo)
  console.log("Left Ear Video:", leftEarVideo)

  const addingEarVideoUrl = (videoUrl, earSide) => {
    if (earSide == appKeys.leftEar) {
      var updatingObj = {
        ...updatingArray[findPatientObjIndex],
        videoDataUrls:
        {
          LeftEar: videoUrl,
          RightEar: rightEarVideo
        }
      }
    }
    else {
      updatingObj = {
        ...updatingArray[findPatientObjIndex],
        videoDataUrls:
        {
          LeftEar: leftEarVideo,
          RightEar: videoUrl
        }
      }
    }
    updatingArray.splice(findPatientObjIndex, 1, updatingObj)
    dispatch(setMedicalRecord(updatingArray))
  }


  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(false)
  const [modalMsg, setModalMsg] = useState("")
  const [modalResponse, setModalResponse] = useState("")



  const scanUploading = async () => {
    setLoading(true)
    const timeStamp = new Date();
    // let now = moment(timeStamp).format();
    let timeformat = moment(timeStamp).format("DDMMYYYYHHMMSS");
    let scanVideoId = childKey + timeformat;
    try {
      let token = await getToken();
      token = `bearer ${token}`
      let formData = new FormData();
      formData.append('scanVideo', {
        uri: videoUri,
        type: 'video/mov',
        name: scanVideoId + ".mov"
      })
      formData.append('patientId', childKey);
      formData.append('scanVideoId', scanVideoId);

      const response = await apiMethods(
        ApiConstants.methods.POST,
        ApiConstants.endPoints.scanUpload,
        formData,
        {
          Authorization: token,
          'Content-Type': 'multipart/form-data'
        }
      )
      // console.log(response.data)
      if (response.data.success == true) {
        addingEarVideoUrl(response.data.data.videoUrl, earType)
        navigation.navigate(appScreens.PhysicianDx, {
          childKey: childKey,
          firstName: firstName,
          lastName: lastName,
          isDataUploaded: false
        })
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

  return (
    <View style={styles.bg1}>
      <Spinner
        visible={loading}
        textContent={"Processing..."}
        textStyle={{ color: '#FFF' }}
      />

      <CustomModal
        modalVisible={modal}
        message={modalMsg}
        response={modalResponse}
        btnText={"Ok"}
        onPress={() => setModal(false)}
      />
      <View style={styles.cross}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.imgcross}>Retake</Text>
        </TouchableOpacity>
        <Text style={[styles.imgcross, { color: 'white' }]}>
          {firstName} {lastName.slice(0, 1)}
        </Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 20 }}>
        {videoUri != '' &&
          <Video
            source={{ uri: videoUri }}
            repeat={true}
            resizeMode='cover'
            // source={require('../assets/video/test.mov')}
            // ref={(ref) => { this.player = ref }}
            // onBuffer={this.onBuffer}
            style={{
              // backgroundColor: "green",
              backgroundColor: 'transparent',
              position: 'absolute',
              width: '80%',
              height: '100%',

            }} />
        }
        <Text style={styles.info}>Video Complete</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          scanUploading()
          // this.sendVideo();
        }}>
        <View style={[styles.button, { backgroundColor: '#84d2e5' }]}>
          <Text style={[styles.buttontext, { color: '#ffffff' }]}>Save</Text>
        </View>
      </TouchableOpacity>
    </View>
  )

}

const styles = StyleSheet.create({
  cross: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'black'
  },
  imgcross: {
    ...ifIphoneX({ marginTop: 30 }, { marginTop: 20 }),
    marginHorizontal: 20,
    color: '#84d2e5',
    fontSize: 20,
    textAlign: 'center'
  },
  container: {
    flex: 1
  },
  bg1: {
    backgroundColor: 'black',
    flex: 1
  },
  info: {

    fontFamily: 'CircularStd-Medium',
    textAlign: 'center',
    color: 'white',
    fontSize: 32
  },
  button: {
    ...ifIphoneX({ marginBottom: 100 }, { marginBottom: 30 }),
    marginLeft: '7.5%',
    height: 53,
    width: "85%",
    backgroundColor: '#cde6fe',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',

  },
  buttontext: {
    color: '#1e72be',
    fontSize: 20,
    textAlign: 'center'
  }
});


export default Preview;