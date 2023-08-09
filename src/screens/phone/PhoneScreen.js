import { useEffect, useCallback, useState } from 'react'
// LINK 
import * as Linking from 'expo-linking'
// FIREBASE 
import useFirebase from '../../firebase/useFirebase'
// MODELS 
import { MODEL_STRING } from '../../models/modelText'
// NAVIGATION 
import { useFocusEffect } from '@react-navigation/native' 

const PhoneScreen = ({ navigation }) => {
    // FIREBASE 
    const { _readDataProfil, profil } = useFirebase() 
        // CONST 
        const [isProfileLoaded, setIsProfileLoaded] = useState(false)

    // Focus effect, s'exécute quand l'écran obtient le focus
    useFocusEffect(
        useCallback(() => {
            _handlePhone()
            navigation.navigate('Home')
        }, [profil]) // Dépendance au profil pour s'assurer qu'il est chargé
    )

    // Récupère les données du profil au montage
    useEffect(() => {
        _readDataProfil(MODEL_STRING.key_uid_firebase)
        setIsProfileLoaded(true)
        console.log('phoneScreen useEFffect ')
    }, [])

    useEffect(() => {
        if (isProfileLoaded) {
            console.log("mapscreen useEffect isProfileLoaded")
            _handlePhone()
        }
    }, [isProfileLoaded])

    // Fonction pour appeler un numéro de téléphone
    const _handlePhone = () => {
        profil?.filter(p => p.id === 'profil').forEach(p => {
            const phoneUrl = "tel:" + p.phoneRestaurant
            
            Linking.canOpenURL(phoneUrl).then(supported => {
                if (supported) {
                    Linking.openURL(phoneUrl) 
                } else {
                    console.warn("Unable to open URL:", phoneUrl)
                }
            })
        })
    }
}

export default PhoneScreen
