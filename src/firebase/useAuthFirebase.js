import React, { useState } from 'react'
// FIREBASE
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from './base'
import useFirebase from './useFirebase'
// MODEL 
import { MODEL_STRING } from '../models/modelText'

const useAuthFirebase = () => {
    // USER 
    const [user, setUser] = useState({})
    // FIREBASE 
    const { _writeData, _updateData } = useFirebase()  
    const [myRedir, setMyredir] = useState() 
    const [error, setError] = useState()
    const [visible, setVisible] = useState(false)
    const [titleAlert, setTitleAlert] = useState()
    // METHOD OPEN / CLOSE MODAL 
    const _showDialog = () => setVisible(true)
    const _hideDialog = () => setVisible(false)

    // TO CONNECT 
    const _signIn = async (email, password) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((useCredential) => {
                const user = useCredential.user
                setMyredir('ok') // PAS NECESSAIRE
                // _getUidClient(user.uid)
                console.log('useauthfirebase signin ok')
                _hideDialog()
            })  
            .catch(() => {
                setTitleAlert('email ou mot de passe incorrect')
                _showDialog()
                console.log('email ou mot de passe incorrect')
            })
    }

    // CREATE ACCOUNT 
    const _signUp = (name, email, password) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((useCredential) => {
                const user = useCredential.user
                // enregistrer ici le document dans firebase
                let nameClient = name.toUpperCase()
                console.log("user => ", user.uid)
                const data = {name:nameClient, email:email, uid:user.uid}
                _writeData(`entreprises/${MODEL_STRING.key_uid_firebase}/clients`,data)
                setMyredir('ok')
            })
            .catch((error) => {
                if (error.code === 'auth/email-already-in-use') {
                    _showDialog()
                    setTitleAlert('email déja enregistré')
                } else {
                    _showDialog()
                    setTitleModal('Email incorrect')
                }
            })
    }

    // LOG OUT 
    const _signOut = () => {
        console.log('useAuth _signOut method')
        signOut(auth).then(() => {
            console.log('useAuth _signOut OK ')
            _onAuth()
        }).catch((error) => {
            console.log(error)
        })
    }

    // IS USER ? 
    const _onAuth = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
            } else {
                setUser({})
            }
        })
    }

    // FORGOT PASSWORD 
    const _forgotPassword = (email) => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                _showDialog()
                setTitleAlert("Un email à été envoyé sur votre boite mail")
                setMyredir('ok')
                console.log("Un email à été envoyé sur votre boite mail")
            }).catch((error) => {
                console.log(error)
                setTitleAlert("Veuillez renseigner un email valide")
                console.log("Un email à été envoyé sur votre boite mail => error")
                _showDialog()
            })
    }

    return {
        _signIn,
        _signOut,
        _forgotPassword,
        _onAuth,
        user,
        error,
        myRedir,
        // ALERT 
        visible,
        setVisible,
        _showDialog,
        _hideDialog,
        titleAlert,
        _forgotPassword,
        _signUp,
    }
}

export default useAuthFirebase