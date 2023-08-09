import React, { useState, useEffect, createContext } from 'react'
// REACT NATIVE 
import { View, Text, Button } from 'react-native'
// DEVICE 
import * as Device from 'expo-device'
// EXPO NOTIFICATION 
import * as Notifications from 'expo-notifications'
// NAVIGATION 
import { NavigationContainer } from '@react-navigation/native'
import Tabs from './src/navigation/Tabs'
import TabsPro from './src/navigation/TabsPro'
// import { AuthProvider } from './src/components/AuthContext'
// STATUS BAR + SAFE AREA VIEW 
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
// MODELS 
import { MODEL_COLORS } from './src/models/modelColors'
// COMPONENTS 
import Header from './src/components/header/Header'
// FIREBASE 
import useAuthFirebase from './src/firebase/useAuthFirebase'
// MODEL 
import { MODEL_STRING } from './src/models/modelText'

// CONTEXT
export const AppContext = createContext()

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

const App = () => {
  const { user, _onAuth } = useAuthFirebase() 
  const [myToken, setMyToken] = useState()
  const [myFinalStatus1, setMyFinalStatus1] = useState()
  const [myFinalStatus2, setMyFinalStatus2] = useState()

  useEffect(() => {
    _onAuth()
  },[])

  useEffect(() => {
    // _getTokenPermissions()
  },[])

  const _handleGetToken = async () => {
    console.log("app _handleGetToken ")
    let token = '';
    let attempts = 0;
    while (!token && attempts < 5) {
        try {
            token = (await Notifications.getExpoPushTokenAsync()).data;
        } catch (error) {
            console.error("Error getting token: ", error);
        }
        attempts++;
    }
    if (token) {
        setMyToken(_stringToken(token));
    } else {
        console.error("Failed to get token after 5 attempts");
    }
}


  const _getTokenPermissions = async () => {
    await _handleGetToken()
    await _handleRequestPermissionsAsync()
  }

  async function registerForPushNotificationsAsync() {
    let token = ''
    token = (await Notifications.getExpoPushTokenAsync()).data
    console.log("token ===> ",token)
    setMyToken(token)
  }

  const _handleRequestPermissionsAsync = async () => {
    const { status } = await Notifications.requestPermissionsAsync()
    let finalStatus = status
    console.log("app _handleGetPermissionsAsync ", finalStatus)
    setMyFinalStatus2(finalStatus)
  }

  const _stringToken = (token) => {
    const match = token.match(/\[(.*?)\]/)
    return match ? match[1] : null
  }

  const _myTabs = () => {
    if (user.uid === MODEL_STRING.key_uid) { 
      return <TabsPro />
    } else {
      return <Tabs />
    }
  }

  return (
    <SafeAreaView style={{ flex:1 }}>
      <NavigationContainer>
        <AppContext.Provider value={{ user }}>
          <Header />
          <StatusBar barStyle="dark-content" backgroundColor={MODEL_COLORS.white}  />
          {/* {user.uid === MODEL_STRING.key_uid ? <TabsPro /> : <Tabs />} */}
          {_myTabs()}
        </AppContext.Provider>
      </NavigationContainer>
    </SafeAreaView>
  )
}

export default App

/*


      <View>
        <View style={{ height:10 }} />
        <Text>page app</Text>
        <View style={{ height:10 }} />
        <Button title='get token' onPress={_handleGetToken} />
        <View style={{ height:10 }} />
        <View style={{ height:10 }} />
        <Button title='get permission async' onPress={_handleRequestPermissionsAsync} />
        <Text style={{ marginTop:10 }}>_handleGetToken = {myToken}</Text>
        <Text style={{ marginTop:10 }}>_handleGetPermissionsAsync = {myFinalStatus1}</Text>
        <Text style={{ marginTop:10 }}>_handleRequestPermissionsAsync = {myFinalStatus2}</Text>
      </View>

*/

