import React, { useContext, useEffect } from 'react'
// REACT NATIVE  
import {
    View,
    StyleSheet,
    Text,
    ScrollView, 
    TouchableOpacity,
} from 'react-native' 
// ICONS 
import { Ionicons, AntDesign } from '@expo/vector-icons'
// MODELS 
import { MODEL_COLORS } from '../../models/modelColors'
import { MODEL_STRING } from '../../models/modelText'
// FIREBASE  
import useFirebase from '../../firebase/useFirebase'
// CONTEXT 
import { AppContext } from '../../../App'
// USE BASKET 
import useBasket from '../../hooks/useBasket'

// ARRAY CATEGORY
const menuArray = ["Formule", "Entree", "Plat", "Dessert", "Boisson"]

const BasketScreen = ({ navigation }) => {
    // USER 
    const { user } = useContext(AppContext)
    // FIREBASE 
    const { _readDataBaskets, baskets, _updateData } = useFirebase()
    // USE BASKET 
    const { _totalBasket, _displayBasket } = useBasket()

    // READ BASKET
    useEffect(() => {
        _readDataBaskets(MODEL_STRING.key_uid_firebase)
    },[])
 
    // RETURN NAVIGATION 
    const _handleReturn = () => {
        navigation.navigate('Food')
    }

    // VALIDATE BASKET 
    const _handleValideBasket = () => {
        const data = {
            validate:true
        }
        _updateData(`entreprises/${MODEL_STRING.key_uid_firebase}/baskets/${user.uid}`, data)
        navigation.navigate('Food')
    }

    // DELETE PLAT
    const _handleDelete = (idPlat) => {
        const data = {
            [idPlat]:null
        }
        _updateData(`entreprises/${MODEL_STRING.key_uid_firebase}/baskets/${user.uid}`, data)
    }

    // SUBSTRACT QUANTITY
    const _handleSubstractQuantity = (idPlat, category, title, subTitle, price, quantity) => {

        if (quantity > 2) {
            const data = {
                [idPlat]: {
                    category: category, 
                    title: title, 
                    subTitle: subTitle, 
                    price: price, 
                    quantity: parseInt(quantity - 1),
                    idPlat:idPlat,
                }  
            }
            _updateData(`entreprises/${MODEL_STRING.key_uid_firebase}/baskets/${user.uid}`, data)
        } else {
            const data = {
                [idPlat]:null
            }
            _updateData(`entreprises/${MODEL_STRING.key_uid_firebase}/baskets/${user.uid}`, data)
        }

    }

    // ADD QUANTITY
    const _handleAddQuantity = (idPlat, category, title, subTitle, price, quantity) => {
        const data = {
            [idPlat]: {
                category: category, 
                title: title, 
                subTitle: subTitle, 
                price: price, 
                quantity: parseInt(quantity + 1),
                idPlat:idPlat,
            }  
        }
        _updateData(`entreprises/${MODEL_STRING.key_uid_firebase}/baskets/${user.uid}`, data)
    }

    return (
        <View style={styles.container}>

            <View style={styles.content}>

                {/* ICON CLOSE => RETURN FOOD PAGE */}
                <TouchableOpacity style={styles.close} onPress={_handleReturn}>
                    <Ionicons name="close" size={30} color="black" />
                    <Text style={styles.textClose}>Panier</Text>
                </TouchableOpacity>

                <View style={styles.line} />

                <ScrollView>

                {/* SHOW ORDER IN BASKET + FILTER + SORT  */}
                {menuArray.map(category => (
                    <View key={category}>
                        {_displayBasket(baskets, user)
                            .sort((a, b) => a.title.localeCompare(b.title))
                            .filter(item => item.category === category)
                            .map(item => (
                            <View key={item.idPlat} style={styles.viewItem}>
                                <View>
                                    <Text style={styles.textItem}>{item.title}</Text>

                                    {/* BUTTON ADD SUBSTRACT QUANTITY */}
                                    <View style={styles.viewAddSubstract}>
                                        <TouchableOpacity onPress={() => _handleSubstractQuantity(item.idPlat, item.category, item.title, item.subTitle, item.price, item.quantity)}>
                                            <Ionicons name="md-remove-circle-outline" size={30} color={MODEL_COLORS.orange} />
                                        </TouchableOpacity>
                                        <View>
                                            <Text style={styles.textNumber}>{item.quantity}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => _handleAddQuantity(item.idPlat, item.category, item.title, item.subTitle, item.price, item.quantity)}>
                                            <Ionicons name="add-circle-outline" size={30} color={MODEL_COLORS.main} />
                                        </TouchableOpacity>
                                    </View>

                                </View>

                                {/* ICON DELETE ITEM */}
                                <TouchableOpacity onPress={() => _handleDelete(item.idPlat)}>
                                    <AntDesign name="delete" size={20} color={MODEL_COLORS.red} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                ))}

                </ScrollView>

            </View>

            {/* BASKET => UNIQUEMENT SI NON VALIDATE */}
                {baskets?.filter(basket => basket.id === user.uid && basket.validate === true).length === 0 &&
                <TouchableOpacity style={styles.viewBasket} onPress={_handleValideBasket}>
                    <Ionicons name="ios-basket-outline" size={24} />
                    <Text style={styles.textBasket}>   Valider mon panier</Text>
                    <Text style={styles.textBasket}>{_totalBasket(baskets, user)} €</Text>
                </TouchableOpacity>
            }

        </View>
    )
}

export default BasketScreen

// STYLES DESIGN 
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex:1,
    },
    close: {
        margin:10,
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
    },
    textClose: {
        fontSize:20,
        marginStart:15,
    },
    line: {
        borderBottomColor:MODEL_COLORS.main,
        borderBottomWidth:1,
        marginTop:20
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
    viewItem: {
        paddingStart:20,
        paddingEnd:20,
        borderBottomColor: MODEL_COLORS.main,
        borderBottomWidth: 1,
        marginTop:10,
        paddingBottom:10,
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
    },
    textItem: {
        fontSize:18,
    },
    viewAddSubstract: {
        display:"flex",
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        height:50,
    },
    textNumber: {
        marginStart:10,
        marginEnd:10,
        fontSize:20,
    }
})