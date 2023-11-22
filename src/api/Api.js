import axios from "axios/index";
import { makeGetRequest, makeGetRequestWithQueryParameters, makePostRequest, makePostRequestWithHeader, makePutRequest, } from "./RequestExecutor";
import {
  ADD_CHILD,
  CHANGE_PASSWORD,
  FORGET_PASSWORD,
  GET_CHILD,
  GET_DIAGNOSIS,
  GET_TEST,
  IMAGE_UPLOAD,
  LOGIN,
  SOCIAL_LOGIN,
  PARENT_PROFILE,
  REGISTER,
  SAVE_PARENT_PROFILE,
  SCAN_HISTORY,
  UPDATE_CHILD,
  UPDATE_TEST,
  GET_PROGRESS_REPORT,
  SCAN_IMAGE_UPLOAD,
  POST_DIAGNOSIS,
} from "./Url";
import { getToken, getUserId } from "../utils/AsyncStorageUtils";
var moment = require('moment');
const API_LOG = true;

axios.interceptors.request.use(request => {
  if (API_LOG)
    console.log('====>request<====', request);
  return request
});

export async function registerUser(fullName, userName, address, mobileNumber, email, password, confpassword) {
  let responseData;
  let data = {
    "fullName": fullName,
    "userName": userName,
    "address": address,
    "mobileNumber": mobileNumber,
    "email": email,
    "password": password,
    "confpassword": confpassword
  };
  responseData = makePostRequest(REGISTER, data);
  return responseData;
}

export async function loginUser(userName, password, deviceToken) {
  let responseData;
  let data = {
    "userName": userName,
    "password": password,
    "deviceId": deviceToken
  };
  responseData = makePostRequest(LOGIN, data);
  return responseData;
}

export async function facebookLogin(email, token, deviceToken) {
  let responseData;
  let data = {
    "email": email,
    "token": token,
    "authenticator": "facebook",
    "deviceId": deviceToken
  };
  //responseData = makeGetRequestWithQueryParameters(SOCIAL_LOGIN, data);
  responseData = makePostRequest(SOCIAL_LOGIN, data);
  return responseData;
}

export async function googleLogin(email, token, deviceToken) {
  let responseData;
  let data = {
    "email": email,
    "token": token,
    "authenticator": "google",
    "deviceId": deviceToken
  };
  responseData = makePostRequest(SOCIAL_LOGIN, data);
  return responseData;
}

export async function forgetPassword(email) {
  let responseData;
  let data = {
    "email": email
  };
  responseData = makePostRequest(FORGET_PASSWORD, data);
  return responseData;
}

export async function changePassword(oldPassword, password, confirmPassword) {
  let responseData;
  let data = {
    "oldpassword": oldPassword,
    "password": password,
    "confpassword": confirmPassword
  };
  responseData = makePostRequestWithHeader(CHANGE_PASSWORD, data);
  return responseData;
}

export async function getParentProfile() {
  let responseData;
  responseData = makeGetRequest(PARENT_PROFILE);
  return responseData;
}

export async function saveParentProfile(userName, fullName, mobileNumber, email, country, state, city, address, parentRole) {
  let responseData;
  let data = {
    "userName": userName,
    "fullName": fullName,
    "mobileNumber": mobileNumber,
    "email": email,
    "country": country,
    "state": state,
    "city": city,
    "address": address,
    "parentRole": parentRole
  };
  responseData = makePostRequestWithHeader(SAVE_PARENT_PROFILE, data);
  return responseData;
}

export async function updateParentImageProfile(id, image, userName, fullName, mobileNumber, email) {
  let responseData;
  let data = {
    "image": image,
    "userName": userName,
    "fullName": fullName,
    "mobileNumber": mobileNumber,
    "email": email,
  };

  responseData = makePostRequestWithHeader(SAVE_PARENT_PROFILE, data);
  return responseData;
}

export async function addChild(firstName, lastName, birthdate, gender, childId) {
  let responseData;
  // let newId = ObjectId(childId);
  // alert(JSON.stringify(newId));
  let data = {
    "_id": childId,
    "firstName": firstName,
    "lastName": lastName,
    // "image": 'x',
    "gender": gender,
    "birthDate": birthdate,
    // "DeliveryTypes": 'x',
    // "isTwinPregnancy": false,
    // "medicalCondition": 'x',
    // "ethnicity": 'x',
    // "apgar_1": 'x',
    // "apgar_2": 'x',
    // "apgar_3": 'x',

  };
  responseData = makePostRequestWithHeader(ADD_CHILD, data);
  return responseData;
}

export async function updateChild(id, firstName, lastName, birthdate, gender) {
  let responseData;
  let data = {
    "firstName": firstName,
    "lastName": lastName,
    // "image": 'x',
    "gender": gender,
    "birthDate": birthdate,
    // "DeliveryTypes": 'x',
    // "isTwinPregnancy": false,
    // "medicalCondition": 'x',
    // "ethnicity": 'x',
    // "apgar_1": 'x',
    // "apgar_2": 'x',
    // "apgar_3": 'x',
  };

  responseData = makePutRequest(UPDATE_CHILD + id, data);
  return responseData;
}

export async function addDiagnosis(patientId, diagnosis, plagiocephalyLevel, headSide, scanNotes, scanVideoId, scan) {
  let responseData;
  let dateformat = moment(new Date(scan)).format("MM/DD/YYYY")+"";
  let timeformat = moment(new Date(scan)).format("HH:MM")+"";
  let data = {
    "patientId": patientId,
    "diagnosis": diagnosis,
    "plagiocephalyLevel": plagiocephalyLevel,
    "headSide": headSide,
    "scanNotes": scanNotes,
    "scanVideoId": scanVideoId,
    "scanDate": dateformat,
    "scanTime": timeformat
  };
  // alert(JSON.stringify(data))
  responseData = await makePostRequestWithHeader(POST_DIAGNOSIS, data);
  // alert(JSON.stringify(responseData))
  return responseData;

}

export async function updateChildImageProfile(id, image) {
  let responseData;
  let data = {
    "image": image,
  };

  responseData = makePutRequest(UPDATE_CHILD + id, data);
  return responseData;
}

export async function getChild() {
  let responseData;
  responseData = makeGetRequest(GET_CHILD);
  // alert(JSON.stringify(responseData))
  return responseData;
}

export async function getTest() {
  let responseData;
  responseData = makeGetRequest(GET_TEST);
  return responseData;

}

export async function editTest(image, child_id, test_id) {
  let responseData;
  let data = {
    "image": image,
    "childId": child_id,
    "_id": test_id,
  };
  responseData = makePutRequest(UPDATE_TEST + test_id, data);
  return responseData;
}

export async function uploadImage(image, testID, childID) {

  let resizedImageUri = await resizeImage(image);
  let authToken = await getToken();
  let myHeaders = new Headers();
  myHeaders.set('Authorization', 'bearer ' + authToken);

  let formdata = new FormData();
  formdata.append('image', {
    uri: resizedImageUri,
    type: 'image/jpeg',
    name: 'scanPhoto'
  });

  let varInit = {
    method: 'POST',
    headers: myHeaders,
    body: formdata
  };

  let varsRequest = new Request(IMAGE_UPLOAD, varInit);
  return fetch(varsRequest).then((response) => response.json())
    .then((result) => {
      editTest(result.data, childID, testID);
      return result;
    })
}

export async function scanImageUpload(imageUrl) {
  let responseData;
  let data = new FormData();
  data.append('image', {
    uri: imageUrl,
    type: 'image/jpeg',
    name: 'image.jpeg'
  });

  responseData = makePostRequestWithHeader(SCAN_IMAGE_UPLOAD, data);
  return responseData;
}

export async function scanVideoUpload(videourl, time, childId, scanVideoId) {
  let responseData;

  let data = new FormData();
  // let timeformat = moment(new Date(time)).format("DDMMYYYYHHMMSS");
  data.append('scanVideo', {
    uri: videourl,
    type: 'video/mov',
    name: scanVideoId + ".mov",
  });
  //DDMMYYHHMMSS
  data.append('patientId', childId);
  data.append('scanDate', time);
  data.append('scanVideoId', scanVideoId);
  data.append('userId', 'x');

  responseData = makePostRequestWithHeader(SCAN_IMAGE_UPLOAD, data);
  return responseData;
}

export async function uploadChildImage(childID, image) {

  let resizedImageUri = await resizeImage(image);
  let authToken = await getToken();
  let myHeaders = new Headers();
  myHeaders.set('Authorization', 'bearer ' + authToken);
  let formdata = new FormData();
  formdata.append('image', {
    uri: resizedImageUri,
    type: 'image/jpeg',
    name: 'scanPhoto'
  });
  let varInit = {
    method: 'POST',
    headers: myHeaders,
    body: formdata
  };
  let varsRequest = new Request(IMAGE_UPLOAD, varInit);
  return fetch(varsRequest).then((response) => response.json())
    .then((result) => {
      updateChildImageProfile(childID, result.data);
      return result;
    })
}

export async function uploadParentImage(userID, image, userName, fullName, mobileNumber, email) {

  let resizedImageUri = await resizeImage(image);
  let authToken = await getToken();
  let myHeaders = new Headers();
  myHeaders.set('Authorization', 'bearer ' + authToken);
  let formdata = new FormData();
  formdata.append('image', {
    uri: resizedImageUri,
    type: 'image/jpeg',
    name: 'scanPhoto'
  });
  let varInit = {
    method: 'POST',
    headers: myHeaders,
    body: formdata
  };
  let varsRequest = new Request(IMAGE_UPLOAD, varInit);
  return fetch(varsRequest).then((response) => response.json())
    .then((result) => {
      updateParentImageProfile(userID, result.data, userName, fullName, mobileNumber, email);
      return result;
    })
}

export async function getHistoryByChildID(childId, testId) {
  let responseData;
  responseData = makeGetRequest(SCAN_HISTORY + childId + '/' + testId);
  return responseData;
}

export async function getDiagnosisResult(childId, testId, imageData) {
  let responseData;
  let data = imageData;
  responseData = makePostRequestWithHeader(GET_DIAGNOSIS + childId + '/' + testId, data);
  return responseData;
}

export async function getProgressReport(childId, testId) {
  let responseData;
  responseData = makeGetRequest(GET_PROGRESS_REPORT + childId + '/' + testId);
  return responseData;
}

