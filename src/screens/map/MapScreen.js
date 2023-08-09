import { useEffect, useCallback, useState } from 'react'
// LINK 
import * as Linking from 'expo-linking'
// FIREBASE 
import useFirebase from '../../firebase/useFirebase'
// MODELS 
import { MODEL_STRING } from '../../models/modelText'
// NAVIGATION 
import { useFocusEffect } from '@react-navigation/native' 

const MapSreen = ({ navigation }) => {
    // FIREBASE 
    const { _readDataProfil, profil } = useFirebase() 
    // CONST 
    const [isProfileLoaded, setIsProfileLoaded] = useState(false)

    // Focus effect, s'exécute quand l'écran obtient le focus
    useFocusEffect(
        useCallback(() => {
            _handleMap()
            navigation.navigate('Home')
        }, [profil]) // Dépendance au profil pour s'assurer qu'il est chargé
    )

    // Récupère les données du profil au montage
    useEffect(() => {
        _readDataProfil(MODEL_STRING.key_uid_firebase)
        setIsProfileLoaded(true)
        console.log("mapscreen useEffect")
    }, [])

    
    useEffect(() => {
        if (isProfileLoaded) {
            console.log("mapscreen useEffect isProfileLoaded")
            _handleMap()
        }
    }, [isProfileLoaded])

    // OPEN URL 
    const _handleMap = () => {
        profil?.filter(p => p.id === 'profil').forEach(p => {
            console.log("HomePro _handleMap ", p.googleMap[0])
            _handleOpenLink(p.googleMap[0])
        })
    }

    // OPEN MAP URL 
    const _handleOpenLink = async (url) => {
        const canOpen = await Linking.canOpenURL(url)
        if (canOpen) {
            Linking.openURL(url)
        } else {
            console.log(`Don't know how to open this URL: ${url}`)
        }
    }
}

export default MapSreen
