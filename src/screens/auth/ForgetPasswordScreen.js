import React, { useState, useEffect } from 'react'
// REACT NATIVE
import {
    TextInput,
    StyleSheet,
    Text,
} from 'react-native' 
// REACT NATIVE PAPER
import { 
    Button,
    Portal,
    Provider as PaperProvider,
    Dialog,
} from 'react-native-paper'
// FIREBASE 
import useAuthFirebase from '../../firebase/useAuthFirebase'
// MODELS 
import { MODEL_COLORS } from '../../models/modelColors'
// FORMULAIRE
import useForm from '../../hooks/useForm'


const ForgetPasswordScreen = ({ navigation }) => {
    // FORM  
    const { _handleChange, values } = useForm(INITIAL_STATE)  
    // FIREBASE AUTH 
    const { visible, _hideDialog, myRedir, _forgotPassword, titleAlert } = useAuthFirebase()

    // NAVIGATION AUTH PAGE 
    useEffect(() => {
        if (myRedir === 'ok') {
            console.log('page AuthUser useEffect ', myRedir)
            // navigation.navigate('auth')
            navigation.navigate('Auth')
        }
    },[myRedir])

    // FORGET PASSWORD 
    const _handleForgetPassword = () => {
        _forgotPassword(values.email)
    }

    // NAVIGATION AUTH PAGE 
    const _handleReturn = () => {
        navigation.navigate('Auth')
    }

    return (
        <PaperProvider>

            <Text style={styles.title}>Mot de passe oublié</Text>

            {/* BUTTON EMAIL */}
            <TextInput
                value={values.email}
                onChangeText={(text) => _handleChange('email', text)}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCompleteType="email"
                autoCorrect={false}
                style={styles.input}
            />

            {/* BUTTON FORGET PASSWORD / NAVIGATION */}
            <Button style={styles.button} mode='contained' onPress={_handleForgetPassword} buttonColor={MODEL_COLORS.main}>Envoyer</Button>

            <Text style={styles.textForget} onPress={_handleReturn}>Retour</Text>

            {/* MODAL ERROR */}
            <Portal>
                <Dialog visible={visible} onDismiss={_hideDialog}>
                    <Dialog.Content>
                        <Text variant="bodyMedium">{titleAlert}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={_hideDialog} mode='text' textColor={MODEL_COLORS.main}>Fermer</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

        </PaperProvider>
    )
}

export default ForgetPasswordScreen

const styles = StyleSheet.create({
    title:{
        fontSize:25,
        textAlign:"center",
        marginTop:30,
    },
    input:{
        height: 40, 
        borderColor: 'gray', 
        borderWidth: 1, 
        marginTop:20, 
        marginStart:20, 
        marginEnd:20 , 
        paddingStart:10
    },
    button: {
        margin:20,
        marginStart:20,
        marginEnd:20,
    },
    textForget: {
        color:MODEL_COLORS.main,
        textAlign:'center',
        marginBottom:10,
        textDecorationLine:"underline",
    },
})