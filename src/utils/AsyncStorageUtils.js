import * as STR from "./String";
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getToken() {
    let authToken = await AsyncStorage.getItem(STR.authToken);
    return authToken;
}

export async function getUserId() {
    let userId = await AsyncStorage.getItem(STR.userId);
    return userId;
}

export async function setUserId(userId) {
    await AsyncStorage.setItem(STR.userId, userId);
}

export async function setUserToken(authToken) {
    await AsyncStorage.setItem(STR.authToken, authToken);
}

export async function clearStorageForLogout() {
    await AsyncStorage.removeItem(STR.authToken);
    await AsyncStorage.removeItem(STR.userId);
}


export async function authToken() {
    let authToken = await AsyncStorage.getItem("authToken");
    return authToken;
}

