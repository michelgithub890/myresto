import React, { useEffect } from 'react'
// NAVIGATION 
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
// ICONS 
import { Feather, AntDesign, MaterialIcons, Ionicons } from '@expo/vector-icons'
// MODELS 
import { MODEL_COLORS } from '../models/modelColors'
// NAVIGATION 
import { useNavigation } from '@react-navigation/native' 
// SCREENS 
import HomePro from '../screens/homePro/HomePro'
import ProfilPro from '../screens/profilPro/ProfilPro'
import MenuPro from '../screens/menuPro/MenuPro'
import PushPro from '../screens/pushPro/PushPro'
import LogoutPro from '../screens/logoutPro/LogoutPro'

// CONST BOTTOM TAB NAVIGATOR  
const Tab = createBottomTabNavigator()

const TabsPro = () => {
    const navigation = useNavigation()

    React.useEffect(() => {
      navigation.navigate('HomePro')
    }, [])

    return (
        <Tab.Navigator
            initialRouteName="HomePro"
            screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarInactiveTintColor: MODEL_COLORS.main,
            tabBarActiveTintColor: MODEL_COLORS.orange,
            }}
        >

            <Tab.Screen 
                name="HomePro" 
                component={HomePro} 
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Feather name="home" color={color} size={size} />
                    )
                }}
            />

            <Tab.Screen 
                name="ProfilPro" 
                component={ProfilPro} 
                options={{
                    tabBarIcon: ({color, size}) => (
                        <AntDesign name="paperclip" color={color} size={size} />
                    )
                }}
            />

            <Tab.Screen 
                name="MenuPro" 
                component={MenuPro} 
                options={{
                    tabBarIcon: ({color, size}) => (
                        <MaterialIcons name="restaurant-menu" color={color} size={size} />
                    )
                }}
            />

            <Tab.Screen 
                name="PushPro" 
                component={PushPro} 
                options={{
                    tabBarIcon: ({color, size}) => (
                        <MaterialIcons name="send-to-mobile" color={color} size={size} />
                    )
                }}
            />

            <Tab.Screen
                name="AuthTab"
                component={LogoutPro} // use the dummy component
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-circle-outline" size={size} color={color} /> 
                    )
                }}
            />

        </Tab.Navigator>
    )
}

export default TabsPro