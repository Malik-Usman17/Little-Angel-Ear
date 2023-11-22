import Axios from 'axios';
import ApiConstants from './ApiContants.json';


export const apiMethods = async (methodType, endPoint, body, headers) => {
  var response;
  // const time = 5 * 60 * 1000
  switch (methodType) {
    case ApiConstants.methods.GET:
      response = await Axios.get(`${ApiConstants.baseURL}${endPoint}`, { headers: headers });
      return response;

    case ApiConstants.methods.POST:
      response = await Axios.post(`${ApiConstants.baseURL}${endPoint}`, body, { headers: headers });
      return response;

    case ApiConstants.methods.PUT:
      response = await Axios.put(`${ApiConstants.baseURL}${endPoint}`, body, { headers: headers });
      return response
  }
};