import React, { useState, useContext, useEffect, createRef } from 'react'
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
    Card,
    Dialog, 
    Portal,
    Provider
} from 'react-native-paper'
// ICONS 
import { Ionicons } from '@expo/vector-icons'
// DATE FNS 
import { format } from 'date-fns' 
import { fr } from 'date-fns/locale'
// MODELS 
import { MODEL_COLORS } from '../../models/modelColors'
import { MODEL_STRING } from '../../models/modelText'
// FIREBASE 
import useFirebase from '../../firebase/useFirebase'
// CONTEXT 
import { AppContext } from '../../../App'
// USE BASKET
import useBasket from '../../hooks/useBasket'

const menuArray = ["Formule", "Entree", "Plat", "Dessert", "Boisson"]

const FoodSreen = ({ navigation }) => {
    // USER 
    const { user } = useContext(AppContext)
    // FIREBASE 
    const { menu, _readDataMenu, _readDataBaskets, baskets, _updateData, _readDataClients, clients } = useFirebase()
    // USE BASKET 
    const { _totalBasket } = useBasket()
    // CONST 
    const [visible, setVisible] = useState(false)
    const [plat, setPlat] = useState()
    const [quantity, setQuantity] = useState()
    // USE REF 
    const scrollViewRef = createRef(null)

    
    // GET DATA FROM FIREBASE 
    useEffect(() => {
        _readDataMenu(MODEL_STRING.key_uid_firebase)
        _readDataBaskets(MODEL_STRING.key_uid_firebase)
        _readDataClients(MODEL_STRING.key_uid_firebase)
        _handleScrollToTop()
    },[])

    // SHOW DIALOG CONFIRM DELETE 
    const _hideDialog = () => setVisible(false)
 
    // SCROLL TO TOP 
    const _handleScrollToTop = () => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true })
    }

    // NAV AUTH PAGE 
    const _handleNavAuthPage = () => {
        navigation.navigate('AuthTab', { screen:'Auth' })
    }

    // CHOICE PLAT 
    const _handleChoicePlat = (platRender,client) => {
        console.log("FoodScreen _handleChoicePlat ", platRender.id)
        setPlat({
            idPlat:platRender.id,
            category:platRender.category,
            title:platRender.title,
            subTitle:platRender.subTitle,
            price:platRender.price,
            emailClient:client.email,
            nameClient:client.name
        })
        setVisible(true)
        setQuantity(1)
    }

    // ADD QUANTITY 
    const _handleAddQuantity = () => {
        if (quantity < 10) setQuantity(quantity + 1)
    }

    // SUBSTRACT QUANTITY 
    const _handleSubstractQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1)
    }

    // CANCEL QUANTITY 
    const _handleCancelQuantity = () => {
        setPlat()
        _hideDialog()
    }

    // VALIDE QUANTITY 
    const _handleValideQuantity = () => {
        const date = new Date(Date.now())
        const formattedDate = format(date, "eeee dd MMMM yyyy", { locale: fr })

        let platQuantity = baskets?.filter(basket => basket.id === user.uid).map(basket => basket[plat.idPlat]?.quantity)

        let quantityTotal = 0

        if (platQuantity[0]) {
            quantityTotal = parseInt(platQuantity[0]) + parseInt(quantity)
        } else {
            quantityTotal = parseInt(quantity)
        }
    
        const data = {
            date: formattedDate, 
            uidClient: user.uid,
            emailClient:plat.emailClient,
            nameClient:plat.nameClient,
            [plat.idPlat]: {
                category: plat.category, 
                title: plat.title, 
                subTitle: plat.subTitle, 
                price: plat.price, 
                quantity: quantityTotal,
                idPlat:plat.idPlat,
            }
        }
        
        _updateData(`entreprises/${MODEL_STRING.key_uid_firebase}/baskets/${user.uid}`, data)
        setPlat()
        _hideDialog()
        
    }
    
    // SHOW BASKET 
    const _handleShowBasket = () => {
        console.log("FoodScreen _handleShowBasket")
        navigation.navigate('Basket')
    }

    // EDIT ORDER 
    const _handleEditOrder = () => {
        data = { 
            validate:null
        } 
        _updateData(`entreprises/${MODEL_STRING.key_uid_firebase}/baskets/${user.uid}`, data)
    }

    return (
        <Provider ref={scrollViewRef}> 

                {/* IF USER */}
                {user.uid ? 

                    // clients?.filter(client => client.email === user.uid).map(client => (
                    //     <View key={client.id}>
                    //         <Text>{client.id}</Text>
                    //     </View>
                    // ))
                    clients?.filter(client => client.uid === user.uid).map(client => (

                        <View key={client.id}>

                            {/* BASKET VALIDATE / NO VALIDATE */}
                            {baskets?.filter(basket => basket.id === user.uid && basket.validate === true).length === 0 ?  
                                <TouchableOpacity style={styles.viewBasket} onPress={_handleShowBasket}>
                                    <Ionicons name="ios-basket-outline" size={24} />
                                    <Text style={styles.textBasket}>   Afficher mon panier</Text>
                                    <Text style={styles.textBasket}>{_totalBasket(baskets, user)} €</Text>
                                </TouchableOpacity>
                            :
                                <View style={styles.viewOrder}>
                                    <TouchableOpacity style={styles.viewEdit} onPress={_handleEditOrder}>
                                        <Text style={styles.edit}>modifier</Text>
                                        <Ionicons name="ios-pencil-outline" size={24} color={MODEL_COLORS.white} />
                                    </TouchableOpacity>
                                    <Text style={styles.textOrder}>Commande à récupérer</Text>
                                    <Text style={styles.textOrder}>{_totalBasket(baskets, user)} €</Text>
                                </View>
                            }

                            {baskets?.filter(basket => basket.id === user.uid && basket.validate === true).length == 0 &&
                            <ScrollView keyboardShouldPersistTaps="always">
                                {/* ARRAY CATEGORY MENU  */}
                                {menuArray.map(item => (
            
                                    // CARD 
                                    <Card style={styles.card} key={item}>
            
                                        {/* TITLE + ICON */}
                                        <Card.Title title={item} style={styles.cardTitle} />
                                        <Card.Content>
            
                                            {/* SHOW MENU BY CATEGORY - SORT ALPHABETIC */}
                                            {menu && menu
                                                .filter(menu => menu.category === item)
                                                .sort((a, b) => a.title.localeCompare(b.title))
                                                .map(plat => (
                                                <View key={plat.id} style={styles.viewText}>
                                                    <View style={[styles.viewFlex, {justifyContent:"space-between"}]}>
                                                        <Text style={{ fontWeight:"bold" }}>{plat.title}</Text>
                                                        <TouchableOpacity onPress={() => _handleChoicePlat(plat, client)}>
                                                            <Ionicons name="ios-basket-outline" size={24} color={MODEL_COLORS.main} />
                                                        </TouchableOpacity>
                                                    </View>
                                                    <Text>{plat.subTitle}</Text>
                                                    <Text>{plat.price}€</Text>
                                                </View>
                                            ))}
                        
                                        </Card.Content>
            
                                    </Card>
                                ))}

                            </ScrollView>
                            }

                        </View>

                    ))

                
                : 
                    <View>

                        <Text style={styles.subtitle}>Vous devez être connecté pour commander</Text>

                        <Button 
                            mode='contained' 
                            style={styles.button} 
                            buttonColor={MODEL_COLORS.main}
                            onPress={_handleNavAuthPage}
                        >Se connecter / Créer un compte</Button>

                    </View>
                }


                <View style={{ height:80 }} />

                {/* ALERT NUMBER PLAT */}
                <Portal>
                    <Dialog visible={visible} onDismiss={_hideDialog}>

                        <Dialog.Title style={styles.text}>Quantité</Dialog.Title> 

                        <Dialog.Content>

                            {/* ADD SUBSTRACT QUANTITY */}
                            <View style={styles.viewAddSubstract}>

                                <TouchableOpacity onPress={_handleSubstractQuantity}>
                                    <Ionicons name="md-remove-circle-outline" size={45} color={MODEL_COLORS.orange} />
                                </TouchableOpacity>
                        
                                <View>
                                    <Text style={styles.textNumber}>{quantity}</Text>
                                </View>

                                <TouchableOpacity onPress={_handleAddQuantity}>
                                    <Ionicons name="add-circle-outline" size={45} color={MODEL_COLORS.main} />
                                </TouchableOpacity>
                         
                            </View>

                            {/* BUTTON CANCEL / CONFIRM DELETE */}
                            <View style={styles.viewFlex}>
                                <Button  
                                    mode='contained' 
                                    onPress={_handleCancelQuantity} 
                                    buttonColor={MODEL_COLORS.orange}
                                >ANNULER</Button>

                                <Button  
                                    mode='contained' 
                                    onPress={_handleValideQuantity} 
                                    buttonColor={MODEL_COLORS.red}
                                >VALIDER</Button>

                            </View>

                        </Dialog.Content>

                    </Dialog>
                </Portal>

        </Provider>
    )
}

export default FoodSreen

// STYLES DESIGN 
const styles = StyleSheet.create({
    title: {
        textAlign:'center',
        fontSize:18,
        margin:10,
    },
    viewFlex: {
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-around",
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
    text: {
        textAlign:"center",
    },
    viewText: {
        marginTop:10,
        borderBottomColor:MODEL_COLORS.main,
        paddingBottom:10,
        borderBottomWidth:1,
    },
    button: {
        margin:20,
        marginStart:20,
        marginEnd:20,
    },
    subtitle: {
        textAlign:"center",
        fontSize:18,
        marginStart:20,
        marginEnd:20,
        marginTop:60,
    },
    viewBasket: {
        display:"flex", 
        flexDirection:"row", 
        justifyContent:"space-between", 
        alignItems:"center", 
        height:60,
        paddingStart:20,
        paddingEnd:20,
        backgroundColor:MODEL_COLORS.orange,
    },
    textBasket: {
        fontSize:18,
    },
    viewAddSubstract: {
        display:"flex",
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        height:50,
        marginBottom:30,
    },
    textNumber: {
        marginStart:10,
        marginEnd:10,
        fontSize:30,
    },
    viewOrder: {
        height:120,
        // marginTop:100,
        backgroundColor: MODEL_COLORS.purple,
    },
    textOrder: {
        fontSize:18,
        marginTop:10,
        color: MODEL_COLORS.white,
        textAlign:"center"
    },
    viewEdit: {
        display:"flex", 
        flexDirection:"row", 
        alignItems:"center", 
        justifyContent:"flex-end",
        marginTop:10,
        marginEnd:10,
    },
    edit: {
        color: MODEL_COLORS.white,
    }
})