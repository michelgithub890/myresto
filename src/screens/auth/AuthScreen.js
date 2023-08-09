import React, { useState, useContext, useEffect } from 'react'
// REACT NATIVE 
import {
    View,
    StyleSheet,
    Text,
} from 'react-native' 
// REACT NATIVE PAPER 
import { 
    Button,
    Portal,
    TextInput,
    Provider as PaperProvider,
    Dialog,
} from 'react-native-paper'
// USE AUTH FIREBASE 
import useAuthFirebase from '../../firebase/useAuthFirebase'
// MODELS 
import { MODEL_COLORS } from '../../models/modelColors'
// CONTEXT 
import { AppContext } from '../../../App'
// FORMULAIRE 
import useForm from '../../hooks/useForm'

const INITIAL_STATE = {
    email:'',
    password:'',
    fName:'',
}

const AuthScreen = ({ navigation }) => {
    // USER 
    const { user } = useContext(AppContext) 
    // FORM 
    const { _handleChange, values, _refresh } = useForm(INITIAL_STATE) 
    // FIREBASE AUTH 
    const { _signIn, _signOut, visible, titleAlert, _hideDialog, _signUp, myRedir } = useAuthFirebase()
    // CONST 
    const [isConnect, setIsConnect] = useState(true)

    // NAVIGATION HOME PAGE 
    useEffect(() => {
        if (myRedir === 'ok') {
            navigation.navigate('Home')
        }
    },[myRedir])

    // LOG OUT 
    const _handleSignOut = () => {
        _signOut()
        _refresh()
    }

    // SIGN IN 
    const _handleSignIn = () => {
        _signIn(values.email, values.password)
    }

    // SIGN UP 
    const _handleSignUp = () => {
        _signUp(values.fName, values.email, values.password)
    }

    // SHOW / HIDE INPUT 
    const _handleShowInput = () => {
        setIsConnect(!isConnect)
        _refresh()
    }

    // FORGOT PASSWORD 
    const _handleForgetPassword = () => {
        navigation.navigate('ForgetPassword')
        console.log("AuthScreen _handleForgetPassword")
    }

    // NAVIGATION HOME PAGE 
    const _handleReturn = () => {
        navigation.navigate('Home')
        _refresh()
    }

    // navigation.navigate('Home', { screen:'Workout', params: { idRoutine:item }})

    return (
        <PaperProvider>

            <View style={{ height:30 }} />

            {/* TEXT BUTTON NAVIGATION PAGE HOME */}
            <Text style={styles.textForget} onPress={_handleReturn}>Accueil</Text>

            {user.uid ? 
                // LOG OUT 
                <Button mode='contained' buttonColor={MODEL_COLORS.orange} onPress={_handleSignOut} style={styles.button}>Se deconnecter</Button>
            :

                isConnect ? 
                    <View>

                        {/* INPUT EMAIL */}
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

                        {/* INPUT PASSWORD */}
                        <TextInput
                            value={values.password}
                            onChangeText={(text) => _handleChange('password', text)}
                            placeholder="Password"
                            secureTextEntry
                            autoCapitalize="none"
                            autoCompleteType="password"
                            autoCorrect={false}
                            returnKeyType="done"
                            style={styles.input}
                        />

                        {/* BUTTON SIGN IN / FORGET PASSWORD / CREATE ACCOUNT */}
                        <Button style={styles.button} mode='contained' onPress={_handleSignIn} buttonColor={MODEL_COLORS.main}>SE CONNECTER</Button>

                        <Text style={styles.textForget} onPress={_handleForgetPassword}>Mot de passe oublié</Text>

                        <Text style={styles.text}>ou</Text>
                        
                        <Button mode='outlined' style={styles.button} onPress={_handleShowInput} textColor={MODEL_COLORS.main}>créer un compte</Button>

                    </View>
                : 

                <View>

                    {/* INPUT FIRST NAME */}
                    <TextInput
                        value={values.fName}
                        onChangeText={(text) => _handleChange('fName', text)}
                        placeholder="Nom utilisateur"
                        autoCapitalize="words"
                        autoCompleteType="name"
                        autoCorrect={false}
                        returnKeyType="next"
                        style={styles.input}
                    />

                    {/* INPUT EMAIL */}
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

                    {/* INPUT PASSWORD */}
                    <TextInput
                        value={values.password}
                        onChangeText={(text) => _handleChange('password', text)}
                        placeholder="Password"
                        secureTextEntry
                        autoCapitalize="none"
                        autoCompleteType="password"
                        autoCorrect={false}
                        returnKeyType="done"
                        style={styles.input}
                    />

                    {/* BUTTONS SIGN UP / SE CONNECTER */}
                    <Button style={styles.button} mode='contained' onPress={_handleSignUp} buttonColor={MODEL_COLORS.main}>CREER UN COMPTE</Button>

                    <Text style={styles.text}>ou</Text>
                        
                    <Button mode='outlined' style={styles.button} onPress={_handleShowInput} textColor={MODEL_COLORS.main}>se connecter</Button>

                </View>
            
            } 

                {/* MODAL ALERT */}
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

export default AuthScreen

// STYLES DESIGN 
const styles = StyleSheet.create({
    button: {
        margin:20,
        marginStart:20,
        marginEnd:20,
    },
    text: {
        textAlign:"center"
    },
    textForget: {
        color:MODEL_COLORS.main,
        textAlign:'center',
        marginBottom:10,
        textDecorationLine:"underline",
    },
    input: {
        height: 40, 
        marginTop:20, 
        marginStart:20, 
        marginEnd:20 , 
        paddingStart:10,
        backgroundColor:MODEL_COLORS.ultraLight,
    },
})