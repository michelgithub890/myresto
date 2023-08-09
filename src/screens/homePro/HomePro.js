import React, { useState, useEffect, createRef } from 'react'
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
} from 'react-native-paper'
// FIREBASE 
import useFirebase from '../../firebase/useFirebase'
// MODELS 
import { MODEL_COLORS } from '../../models/modelColors'
import { MODEL_STRING } from '../../models/modelText'
// USE BASKET 
import useBasket from '../../hooks/useBasket'

// ARRAY CATEGORY
const menuArray = ["Formule", "Entree", "Plat", "Dessert", "Boisson"]

const HomePro = ({ navigation }) => {
    // FIREBASE AUTH + REALTIME 
    const { _readDataBaskets, baskets, _updateData, _deleteData } = useFirebase()
    // USE REF 
    const scrollViewRef = createRef(null)
    // USE BASKET 
    const { _displayAllBasket, _totalBasketSingle } = useBasket()
    // CONST 
    const [inProgress, setInProgress] = useState(true)

    
    // GET DATA FROM FIREBASE 
    useEffect(() => {
        _readDataBaskets(MODEL_STRING.key_uid_firebase)
        _handleScrollToTop()
    },[])

    // SCROLL TO TOP 
    const _handleScrollToTop = () => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true })
    }

    // TO DO => READY
    const _handleInProgress = () => {
        setInProgress(!inProgress)
    }

    // HANDLE ORDER => READY 
    const _handleOrderReady = (id) => {
        const data = {
            ready:true
        }
        _updateData(`entreprises/${MODEL_STRING.key_uid_firebase}/baskets/${id}`, data)
    }

    // HANDLE DELIVER  
    const _handleOrderDeliver = (id) => {
        _deleteData(`entreprises/${MODEL_STRING.key_uid_firebase}/baskets/${id}`)
    }

    return (
        <View>

            <View style={styles.container}>

                {/* BUTTON TO DO */}
                <TouchableOpacity style={[styles.button, { backgroundColor: inProgress ? MODEL_COLORS.orange : MODEL_COLORS.grey }]} onPress={_handleInProgress}>
                    <Text style={styles.buttonText}>A FAIRE</Text>
                </TouchableOpacity>

                {/* BUTTON READY */}
                <TouchableOpacity style={[styles.button, { backgroundColor: !inProgress ? MODEL_COLORS.orange : MODEL_COLORS.grey }]} onPress={_handleInProgress}>
                    <Text style={styles.buttonText}>PRÊTES</Text>
                </TouchableOpacity>

            </View>

            {inProgress ? 

                <ScrollView>

                    {baskets?.filter(basket => basket.validate === true && basket.ready !== true).length === 0 && <Text style={styles.textEmpty}>Rien pour l'instant</Text>}


                    {/* BASKET IN PROGRESS */}
                    {baskets?.filter(basket => basket.validate === true && basket.ready !== true).map(basket => (
                        <Card key={basket.id} mode='outlined' style={styles.card}>

                            {/* NAME CLIENT - EMAIL CLIENT */}
                            <Card.Title title={`${basket.nameClient} - ${basket.emailClient}`} />

                            {/* CARD */}
                            <Card.Content>

                                {/* ARRAY CATEGORY */}
                                {menuArray.map(category => (
                                    <View key={category}>
                                        {_displayAllBasket(basket)
                                            .sort((a, b) => a.title.localeCompare(b.title))
                                            .filter(item => item.category === category)
                                            .map(item => (

                                                // ITEM BASKET 
                                                <View key={item.idPlat} style={styles.viewItem}>
                                                    <Text style={styles.textItem}>{item.title}</Text>
                                                </View>
                                            ))
                                        }
                                    </View>
                                ))}

                            </Card.Content>

                            <View style={{ borderTopColor:MODEL_COLORS.orange, borderTopWidth:1, marginStart:15, marginEnd:15, marginBottom:10 }} />

                            {/* BUTTON ORDER READY */}
                            <Card.Actions>
                                <Button mode='outlined' textColor={MODEL_COLORS.main} onPress={() => _handleOrderReady(basket.id)}>Commande prête</Button>
                            </Card.Actions>
                        </Card> 
                    ))}
                </ScrollView>

            :

                <ScrollView>

                    {/* NO ORDER TO DELIVER */}
                    {baskets?.filter(basket => basket.validate === true && basket.ready === true).length === 0 && <Text style={styles.textEmpty}>Rien pour l'instant</Text>}

                    {/* BASKET READY */}
                    {baskets?.filter(basket => basket.validate === true && basket.ready === true).map(basket => (
                        <Card key={basket.id} mode='outlined' style={styles.card}>

                            {/* NAME CLIENT - EMAIL CLIENT */}
                            <Card.Title title={`${basket.nameClient} - ${basket.emailClient}`} />
                            <Card.Content>

                                {/* PRICE TOTAL */}
                                <Text>total = {_totalBasketSingle(basket)}€</Text>
                            </Card.Content>

                            {/* BUTTON DELIVER */}
                            <Card.Actions>
                                <Button mode='outlined' textColor={MODEL_COLORS.main} onPress={() => _handleOrderDeliver(basket.id)}>Commande livré</Button>
                            </Card.Actions>
                        </Card>
                    ))}
                    
                </ScrollView>

            }

        </View>
    
    )
}

export default HomePro

// STYLES DESIGN 
const styles = StyleSheet.create({
    container: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height:45,
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    card: {
        marginStart:10,
        marginEnd:10,
        marginTop:10,
        backgroundColor:MODEL_COLORS.ultraLight,
    },
    viewItem: {
        borderTopColor:MODEL_COLORS.orange, 
        borderTopWidth:1, 
        paddingTop:10, 
        paddingBottom:10,
    },
    textItem: {
        marginStart:10,
    },
    textTotalPrice: {
        borderTopColor:MODEL_COLORS.main, 
        borderTopWidth:1, 
        paddingTop:10, 
        marginStart:10,
    },
    textEmpty: {
        textAlign:"center",
        marginTop:100,
        fontSize:20,
    }

})