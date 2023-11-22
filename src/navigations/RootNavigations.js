import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import appScreens from '../appConstants/appScreens';
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AddChild from '../screens/AddChild';
import ChildList from '../screens/ChildList';
import EditPatientProfile from '../screens/EditPatientProfile';
import PatientHistory from '../screens/PatientHistory';
import PhysicianDx from '../screens/PhysicianDx';
import Splash from '../screens/Splash';
import Scan from '../screens/Scan';
import Preview from '../screens/Preview';

const { Screen, Navigator } = createNativeStackNavigator()

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
        <Screen name={appScreens.Splash} component={Splash} />
        <Screen name={appScreens.LandingScreen} component={LandingScreen} />
        <Screen name={appScreens.LoginScreen} component={LoginScreen} />
        <Screen name={appScreens.HomeScreen} component={HomeScreen} />
        <Screen name={appScreens.AddChild} component={AddChild} />
        <Screen name={appScreens.ChildList} component={ChildList} />
        <Screen name={appScreens.EditPatientProfile} component={EditPatientProfile} />
        <Screen name={appScreens.Scan} component={Scan} />
        <Screen name={appScreens.Preview} component={Preview} />
        <Screen name={appScreens.PatientHistory} component={PatientHistory} />
        <Screen name={appScreens.PhysicianDx} component={PhysicianDx} />
      </Navigator>
    </NavigationContainer>
  );
}