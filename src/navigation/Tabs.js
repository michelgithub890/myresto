import React from 'react'
// NAVIGATION 
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from '@react-navigation/stack'
// ICONS 
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
// MODELS 
import { MODEL_COLORS } from "../models/modelColors"
// SCREENS 
import HomeSreen from "../screens/home/HomeSreen"
import MapSreen from "../screens/map/MapScreen"
import FoodSreen from "../screens/food/FoodScreen"
import AuthScreen from "../screens/auth/AuthScreen"
import ForgetPasswordScreen from "../screens/auth/ForgetPasswordScreen"
import PhoneScreen from '../screens/phone/PhoneScreen'
import BasketScreen from '../screens/basket/BasketScreen'

// CONST BOTTOM TAB BAR 
const Tab = createBottomTabNavigator()
// CONST STACK 
const AuthStack = createStackNavigator()
const BasketStack = createStackNavigator()


// PART AUTH  
const AuthStackScreen = () => (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Auth" component={AuthScreen} />
        <AuthStack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
    </AuthStack.Navigator>
)

// PART BASKET 
const BasketStackScreen = () => (
    <BasketStack.Navigator screenOptions={{ headerShown: false }}>
        <BasketStack.Screen name="Food" component={FoodSreen} />
        <BasketStack.Screen name="Basket" component={BasketScreen} />
    </BasketStack.Navigator>
)


// BOTTOM TAB NAVIGATOR PAGES + ICONS  
const Tabs = () => (
    <Tab.Navigator
        screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarInactiveTintColor: MODEL_COLORS.main,
        tabBarActiveTintColor: MODEL_COLORS.orange,
        }}
    >
        <Tab.Screen 
            name="Home" 
            component={HomeSreen} 
            options={{
                tabBarIcon: ({color, size}) => (
                    <Feather name="home" color={color} size={size} />
                )
            }}
        />

        <Tab.Screen 
            name="Map" 
            component={MapSreen} 
            options={{
                tabBarIcon: ({color, size}) => (
                    <Feather name="map" color={color} size={size} />
                )
            }}
        />

        <Tab.Screen 
            name="Menu" 
            component={PhoneScreen} 
            options={{
                tabBarIcon: ({color, size}) => (
                    <Feather name="phone-call" color={color} size={size} />
                )
            }}
        />

        <Tab.Screen 
            name="Order" 
            component={BasketStackScreen} 
            options={{
                tabBarIcon: ({color, size}) => (
                    <MaterialCommunityIcons name="silverware-fork-knife" size={size} color={color} />
                )
            }}
        />

        {/* <Tab.Screen 
            name="Menu" 
            component={MenuSreen} 
            options={{
                tabBarIcon: ({color, size}) => (
                    <Feather name="menu" color={color} size={size} />
                )
            }}
        /> */}

        <Tab.Screen
            name="AuthTab"
            component={AuthStackScreen} // use the dummy component
            options={{
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="person-circle-outline" size={size} color={color} />
                )
            }}
        />

    </Tab.Navigator>
)

export default Tabs
