import React from 'react'
// REACT NATIVE 
import { StyleSheet } from 'react-native'
// REACT NATIVE PAPER 
import { Button } from 'react-native-paper'
// FIREBASE 
import useAuthFirebase from '../../firebase/useAuthFirebase'
// MODEL 
import { MODEL_COLORS } from '../../models/modelColors'


const LogoutPro = () => {
    // FIREBASE AUTH 
    const { _signOut } = useAuthFirebase() 

    const _handleSignOut = () => {
        _signOut()
    }

    return <Button mode='contained' buttonColor={MODEL_COLORS.orange} onPress={_handleSignOut} style={styles.button}>Se deconnecter</Button>

}

export default LogoutPro

// STYLES DESIGN 
const styles = StyleSheet.create({
    button: {
        margin:20,
        marginStart:20,
        marginEnd:20,
    },
})