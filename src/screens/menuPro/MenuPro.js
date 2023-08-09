import React, { useState, useContext, useEffect, useRef } from 'react'
// REACT NATIVE 
import {
    View,
    StyleSheet,
    Text,
    ScrollView, 
    TouchableOpacity,
} from 'react-native' 
// REACT NATIVE PAPER 
import { 
    Button,
    TextInput,
    Card,
    Avatar,
    Dialog, 
    Portal,
    Provider
} from 'react-native-paper'
// ICONS 
import { Ionicons, AntDesign } from '@expo/vector-icons'
// MODELS 
import { MODEL_COLORS } from '../../models/modelColors'
import { MODEL_STRING } from '../../models/modelText'
// FIREBASE 
import useFirebase from '../../firebase/useFirebase'
// FORMULAIRE 
import useForm from '../../hooks/useForm'

const menuArray = ["Formule", "Entree", "Plat", "Dessert", "Boisson"]

// VALUES 
const INITIAL_STATE = {
    title:'',
    subTitle:'',
    price:'', 
}

const MenuPro = () => { 
    // FORM 
    const { _handleChange, values, _refresh } = useForm(INITIAL_STATE)
    // FIREBASE 
    const { menu, _readDataMenu, _writeData, _deleteData } = useFirebase()
    // CONST 
    const [showInput, setShowInput] = useState(false)
    const [visible, setVisible] = useState(false)
    const [idPlat, setIdPlat] = useState()
    // USE REF 
    const scrollViewRef = useRef(null)

    
    // GET DATA FROM FIREBASE 
    useEffect(() => {
        _readDataMenu(MODEL_STRING.key_uid_firebase)
        _handleScrollToTop()
    },[])

    // SCROLL TO TOP 
    const _handleScrollToTop = () => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true })
    }
    
    // SHOW / HIDE INPUT 
    const _handleShowHideInput = (choice) => {
        setShowInput(choice)
        _refresh()
        console.log("MenuPro _handleShowHideInput ", choice)
    }
    
    // HANDLE SAVE 
    const _handleSave = () => {
        const data = {
            title:values.title,
            subTitle:values.subTitle,
            price:values.price,
            category:showInput
        }
        _writeData(`entreprises/${MODEL_STRING.key_uid_firebase}/menu`,data) 
        _handleShowHideInput()
        console.log('MenuPro _handleSave ', values, showInput)
    }
    
    // SHOW DIALOG CONFIRM DELETE 
    const _hideDialog = () => setVisible(false)

    // HANDLE CANCEL ADD 
    const _handleCancel = () => {
        _handleShowHideInput()
    }
    
    // HANDLE DELETE 
    const _handleDelete = (idPlat) => {
        setVisible(true)
        setIdPlat(idPlat)
    }

    const _handleCancelDelete = () => {
        setIdPlat()
        _hideDialog()
    }

    const _handleConfirmDelete = () => {
        _deleteData(`entreprises/${MODEL_STRING.key_uid_firebase}/menu/${idPlat}`)
        _hideDialog()
        setIdPlat()
    }
    
    // ICON CARD 
    const LeftContent = (choice) => (
    <Avatar.Icon
        style={{ backgroundColor:'transparent'}}
        icon={() => 
            <TouchableOpacity onPress={() => _handleShowHideInput(showInput === choice ? '' : choice)}>
                {showInput === choice ? 
                    <Ionicons name="md-remove-circle-outline" size={24} color={MODEL_COLORS.main} />
                : 
                    <Ionicons name="add-circle-outline" size={24} color={MODEL_COLORS.main} />
                }
            </TouchableOpacity>
        }
    />)

    return (
        <Provider>
            <ScrollView keyboardShouldPersistTaps="always" ref={scrollViewRef}>

                {/* TITLE PAGE */}
                <Text style={styles.title}>Menu</Text>

                {/* ARRAY CATEGORY MENU */}
                {menuArray.map(item => (

                    // CARD 
                    <Card style={styles.card} key={item}>

                        {/* TITLE + ICON */}
                        <Card.Title title={item} style={styles.cardTitle} right={() => LeftContent(item)}/>
                        <Card.Content>

                            {/* INPUT ADD MENU */}
                            {showInput === item && 

                                <View style={styles.viewInput}>

                                    {/* TITLE */}
                                    <TextInput
                                        value={values.title}
                                        onChangeText={(text) => _handleChange('title', text)}
                                        placeholder="Titre"
                                        autoCompleteType="name"
                                        autoCorrect={false}
                                        returnKeyType="next"
                                        style={styles.input}
                                    />
                
                                    {/* SUBTITLE */}
                                    <TextInput
                                        value={values.subTitle}
                                        onChangeText={(text) => _handleChange('subTitle', text)}
                                        placeholder="Presentation"
                                        autoCompleteType="name"
                                        autoCorrect={false}
                                        returnKeyType="default"
                                        multiline={true}
                                        mode='outlined'
                                        style={[styles.input, { height: 100 }]}  // ajustez la hauteur selon vos besoins
                                    />
                
                                    {/* PRICE */}
                                    <TextInput
                                        value={values.price}
                                        onChangeText={(text) => _handleChange('price', text)}
                                        placeholder="Prix"
                                        keyboardType="numeric"
                                        autoCorrect={false}
                                        returnKeyType="next"
                                        style={styles.input}
                                    />
                
                                    <View style={{ height:20 }} />
                
                                    {/* BUTTON CANCEL / SAVE */}
                                    <View style={styles.viewFlex}>
                
                                        <Button  
                                            mode='contained' 
                                            onPress={_handleCancel} 
                                            buttonColor={MODEL_COLORS.orange}
                                        >ANNULER</Button>
                
                                        <Button  
                                            mode='contained' 
                                            onPress={_handleSave} 
                                            buttonColor={MODEL_COLORS.main}
                                            disabled={values.title && values.price ? false : true}
                                        >ENREGISTRER</Button>
                
                                    </View>
                
                                </View>
                            }

                            {/* SHOW MENU BY CATEGORY - SORT ALPHABETIC */}
                            {menu
                                .filter(menu => menu.category === item)
                                .sort((a, b) => a.title.localeCompare(b.title))
                                .map(plat => (
                                <View key={plat.id} style={styles.viewText}>
                                    <View style={[styles.viewFlex, {justifyContent:"space-between"}]}>
                                        <Text style={{ fontWeight:"bold" }}>{plat.title}</Text>
                                        <TouchableOpacity onPress={() => _handleDelete(plat.id)}>
                                            <AntDesign name="delete" size={24} color={MODEL_COLORS.red} />
                                        </TouchableOpacity>
                                    </View>
                                    <Text>{plat.subTitle}</Text>
                                    <Text>{plat.price}€</Text>
                                </View>
                            ))}
        
                        </Card.Content>
                    </Card>
                ))}

                <View style={{ height:80 }} />

                {/* ALERT CONFIRM DELETE PLAT */}
                <Portal>
                    <Dialog visible={visible} onDismiss={_hideDialog}>

                        <Dialog.Title>Confirmer la suppression</Dialog.Title> 

                        <Dialog.Content>

                            {/* BUTTON CANCEL / CONFIRM DELETE */}
                            <View style={styles.viewFlex}>
                                <Button  
                                    mode='contained' 
                                    onPress={_handleCancelDelete} 
                                    buttonColor={MODEL_COLORS.orange}
                                >ANNULER</Button>

                                <Button  
                                    mode='contained' 
                                    onPress={_handleConfirmDelete} 
                                    buttonColor={MODEL_COLORS.red}
                                >CONFIRMER</Button>

                            </View>

                        </Dialog.Content>

                    </Dialog>
                </Portal>
                
            </ScrollView>
        </Provider>
    )
} 

export default MenuPro

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
    viewIcon: {
        // textAlign:"center",
        // marginEnd:20,
    },
    viewFlex: {
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-around",
    },
    button: {
        margin:20,
        marginStart:20,
        marginEnd:20,
    },
    titleCategory: {
        color:MODEL_COLORS.main,
        margin:10,
        textAlign:"center",
    },
    card: {
        margin:20,
    },
    cardTitle: {
        backgroundColor:MODEL_COLORS.ultraLight,
        borderTopStartRadius:10,
        borderTopEndRadius:10,
        borderBottomColor:MODEL_COLORS.main,
        borderBottomWidth:1,
        paddingEnd:10,
    },
    viewInput: {
        borderBottomColor:MODEL_COLORS.main,
        borderBottomWidth:1,
        paddingBottom:20,
    },
    viewText: {
        marginTop:10,
        borderBottomColor:MODEL_COLORS.main,
        paddingBottom:10,
        borderBottomWidth:1,
    },
    text: {
        textAlign:"center",
    }
})