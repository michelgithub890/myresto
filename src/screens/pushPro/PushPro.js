import React, { useState, useContext, useEffect } from 'react'
// REACT NATIVE 
import {
    View,
    StyleSheet,
    Text,
    ScrollView, 
    TouchableOpacity,
    Alert,
} from 'react-native' 
// REACT NATIVE PAPER 
import { 
    Button,
    TextInput,
    RadioButton,
    Card,
    Avatar,
    Dialog, 
    Portal,
    Provider
} from 'react-native-paper'
// ICONS 
import { Feather, MaterialCommunityIcons, Ionicons, AntDesign } from '@expo/vector-icons'
// MODELS 
import { MODEL_COLORS } from '../../models/modelColors'
import { MODEL_STRING } from '../../models/modelText'
// DATE FNS 
import { format } from 'date-fns' 
import { fr } from 'date-fns/locale'
// CONTEXT 
import { AppContext } from '../../../App'
// FIREBASE 
import useFirebase from '../../firebase/useFirebase'
// FORMULAIRE 
import useForm from '../../hooks/useForm'
// MESSAGES PUSH 
import usePush from '../../hooks/usePush'

// VALUES 
const INITIAL_STATE = {
    title:'',
    message:'',
}

const PushPro = () => {
    // USER 
    const { user } = useContext(AppContext) 
    // FORM 
    const { _handleChange, values, _refresh } = useForm(INITIAL_STATE)
    // FIREBASE 
    const { _writeData, _readDataPush, messagesPush } = useFirebase()
    // PUSH 
    const { _sendPushNotification } = usePush()
    // CONST 
    const [visible, setVisible] = useState(false)
    const [showHistory, setShowHistory] = useState(false)

    // GET MESSAGES PUSH 
    useEffect(() => {
        _readDataPush(MODEL_STRING.key_uid_firebase)
    },[])

    // SHOW DIALOG CONFIRM DELETE 
    const _hideDialog = () => setVisible(false)

    // HANDLE OPEN MODAL 
    const _handleOpenModal = () => {
        setVisible(true)
    }

    // SEND MESSAGE 
    const _handleSendMessage = () => {
        const date = new Date(Date.now())
        const formattedDate = format(date, "eeee dd MMMM yyyy", { locale: fr })

        const data = {
            date:formattedDate,
            title:values.title,
            message:values.message,
        }

        _writeData(`entreprises/${MODEL_STRING.key_uid_firebase}/messagesPush`, data)

        console.log("PushPro _handleSendMessage ", values.title, values.message)
        _refresh()
        _hideDialog()
    }

    // CANCEL SEND MESSAGE 
    const _handleCancelSendMessage = () => {
        _hideDialog()
        _refresh()
    }

    // HANDLE SHOW HISTORY 
    const _handleShowHistory = () => {
        setShowHistory(!showHistory)
    }
 
    return (
        <Provider>

            <ScrollView keyboardShouldPersistTaps="always">

                <Text style={styles.title}>page push</Text>

                {/* NAME ENTREPRISE */}
                <TextInput
                    value={values.title}
                    onChangeText={(text) => _handleChange('title', text)}
                    placeholder="Titre"
                    autoCompleteType="name"
                    autoCorrect={false}
                    returnKeyType="next"
                    style={styles.input}
                />

                {/* ADDRESS */}
                <TextInput
                    value={values.message}
                    onChangeText={(text) => _handleChange('message', text)}
                    placeholder="Message"
                    autoCompleteType="name"
                    autoCorrect={false}
                    returnKeyType="default"
                    multiline={true}
                    mode='outlined'
                    style={[styles.input, { height: 60 }]}  // ajustez la hauteur selon vos besoins
                />

                {/* BUTTON SAVE */}
                <Button 
                    style={styles.button} 
                    mode='contained' 
                    onPress={_handleOpenModal} 
                    buttonColor={MODEL_COLORS.main}
                    disabled={values.title && values.message ? false : true}
                >ENVOYER</Button>

                {/* BUTTON SHOW HISTORY MESSAGES PUSH */}
                <TouchableOpacity onPress={_handleShowHistory} style={styles.viewHistory}>
                    <Text style={styles.textHistory}>Historique</Text>
                    <AntDesign name={showHistory ? "up" : "down"} size={20} color="black" />
                </TouchableOpacity>
        

                {showHistory && 
                    messagesPush.sort((a, b) => a.date.localeCompare(b.date)).map(message => (
                        <Card mode='outlined' style={styles.card} key={message.id}>
                            <Card.Title title={message.date} />
                            <Card.Content>
                                <Text style={styles.textCard}>titre</Text>
                                <Text>message</Text>
                            </Card.Content>
                        </Card>
                    ))
                }

                <View style={{ height:60 }} />

            </ScrollView>

                {/* ALERT NUMBER PLAT */}
                <Portal>
                    <Dialog visible={visible} onDismiss={_hideDialog}>

                        {/* TITLE */}
                        <Dialog.Title style={styles.text}>{values.title}</Dialog.Title> 

                        <Dialog.Content>

                            {/* MESSAGE */}
                            <Text style={styles.textNumber}>{values.message}</Text>
                      
                        </Dialog.Content>

                        {/* BUTTON CANCEL / CONFIRM DELETE */}
                        <Dialog.Actions>
                            <Button  
                                mode='contained' 
                                onPress={_handleCancelSendMessage} 
                                buttonColor={MODEL_COLORS.orange}
                            >ANNULER</Button>

                            <Button  
                                mode='contained' 
                                onPress={_handleSendMessage} 
                                buttonColor={MODEL_COLORS.red}
                            >CONFIRMER</Button>
                        </Dialog.Actions>             

                    </Dialog>
                </Portal>
        </Provider>
    )
}

export default PushPro

// STYLES DESIGN 
const styles = StyleSheet.create({
    title: {
        textAlign:'center',
        fontSize:18,
        margin:10,
    },
    input: {
        height: 40, 
        marginTop:20, 
        marginStart:20, 
        marginEnd:20 , 
        paddingStart:10,
        backgroundColor:MODEL_COLORS.ultraLight,
    },
    button: {
        margin:20,
        marginStart:20,
        marginEnd:20,
        marginTop:30,
    },
    viewFlex: {
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
    },
    viewHistory: {
        display:"flex",
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
    },
    textHistory: {
        fontSize:18,
        marginEnd:10
    },
    card: {
        marginStart:20,
        marginEnd:20,
        marginTop:10,
        backgroundColor:MODEL_COLORS.ultraLight,
    },
    textCard: {
        fontWeight:"bold"
    }
})