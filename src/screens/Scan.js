import React, { useState, useRef, useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useNavigation } from '@react-navigation/native';
import appScreens from '../appConstants/appScreens';
import { appImages } from '../appConstants/appImages';
import appColors from "../appConstants/appColors";
import { useSelector, useDispatch } from "react-redux";
import { getMedicalRecord, setMedicalRecord } from "../redux/slices";



const Scan = ({ route }) => {

  const { earType, firstName, lastName, childKey } = route.params;
  const medicalRecords = useSelector(getMedicalRecord)
  const dispatch = useDispatch()

  const updatingPatientObject = () => {
    const updatingMedicalArray = [...medicalRecords]
    const findPatientObjIndex = updatingMedicalArray.findIndex(item => item._id == childKey)
    const patientObject = updatingMedicalArray.find(val => val._id == childKey)
    // console.log("Patient:", patientObject)
    const newObj = {
      ...updatingMedicalArray[findPatientObjIndex],
      videoDataUrls: {
        LeftEar: patientObject?.videoDataUrls ? patientObject.videoDataUrls.LeftEar : "",
        RightEar: patientObject?.videoDataUrls ? patientObject.videoDataUrls.RightEar : ""
      }
    }
    updatingMedicalArray.splice(findPatientObjIndex, 1, newObj)
    dispatch(setMedicalRecord(updatingMedicalArray))
  }

  useEffect(() => {
    updatingPatientObject()
  }, [])


  const padToTwo = (number) => (number <= 9 ? `0${number}` : number);

  const navigation = useNavigation()
  const camera = useRef(null)

  const [recording, setRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [uri, setUri] = useState("")


  const videoRecordingOptions = {
    maxDuration: 4,
    forceUpOrientation: true,
    fixOrientation: true,
    orientation: 'portrait',
  };

  const openVideoRecording = async () => {
    if (camera.current && !recording) {
      try {
        setRecording(true)
        const myInterval = setInterval(() => {
          setSeconds(seconds => seconds + 1)
        }, 1000);
        const { uri, codec = "mp4" } = await camera.current.recordAsync(videoRecordingOptions)
        // console.log("VIDEO URL", uri)
        clearTimeout(myInterval);
        setRecording(false)
        setSeconds(0)
        setUri(uri)
        navigation.navigate(appScreens.Preview, {
          // patientObj,
          videoUri: uri,
          childKey: childKey,
          // page: page,
          firstName: firstName,
          lastName: lastName,
          earType
        })
      } catch (error) {
        console.log(error)
      }
    }
  }

  const stopVideoRecording = () => {
    if (camera.current && recording) {
      clearTimeout(seconds);
      setSeconds(0)
      setRecording(false)
      navigation.navigate(appScreens.Preview, {
        // patientObj,
        videoUri: uri,
        childKey: childKey,
        // page: page,
        firstName: firstName,
        lastName: lastName,
        earType
      })
    }
  }

  return (
    <SafeAreaView style={styles.container}>

      <StatusBar backgroundColor={appColors.black} barStyle={"light-content"} />

      <View style={{ flexDirection: 'row' }}>
        <View style={styles.cross}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
          >
            <Image
              source={appImages.cross}
              style={styles.imgcross}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.header}>

          <View
            style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <Text
              style={[
                styles.scantxt,
                { textAlign: 'right', marginHorizontal: 5, fontSize: 18 },
              ]}>
              {`00:${padToTwo(seconds)}`}
            </Text>
            <Text style={[styles.scantxt, { marginHorizontal: 20 }]}>
              {`${firstName} ${lastName.slice(0, 1)}`}
            </Text>
          </View>
        </View>
      </View>

      <RNCamera
        ref={camera}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        defaultVideoQuality={RNCamera.Constants.VideoQuality["288p"]}
        flashMode="torch"
        captureAudio={false}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera.',
          message: 'We need your permission to use your camera phone.'
        }}
      >
      </RNCamera>


      <TouchableOpacity
        activeOpacity={0.9}
        style={{ alignSelf: "center", marginVertical: 10 }}
        onPress={() => {
          recording ? stopVideoRecording() : openVideoRecording()
        }}
      >
        <Image
          resizeMode='contain'
          source={recording ? appImages.stop : appImages.start}
          style={{ height: 80, width: 80, }}
        />
      </TouchableOpacity>


    </SafeAreaView>
  )
}

export default Scan;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    flex: 1,
    backgroundColor: 'black',
  },
  scantxt: {
    marginLeft: 3,
    marginTop: 20,
    fontFamily: 'CircularStd-Bold',
    color: 'white',
    fontSize: 14,
  },
  iosButton: {
    left: 0,
    right: 0,
    bottom: 15,
    height: 75,
    position: 'absolute',
    backgroundColor: 'transparent',
    opacity: 0.75,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },

  iosImg: {
    backgroundColor: 'transparent',
    width: 75,
    height: 75,
  },
  cross: {
    height: 55,
    width: 60,
    backgroundColor: 'black',
  },
  imgcross: {
    marginTop: 20,
    marginLeft: 20,
    height: 22,
    width: 22,
  },
});
