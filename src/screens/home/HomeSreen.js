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
import { Ionicons } from '@expo/vector-icons'
// MODELS 
import { MODEL_COLORS } from '../../models/modelColors'
import { MODEL_STRING } from '../../models/modelText'
// FIREBASE 
import useFirebase from '../../firebase/useFirebase'
// CONTEXT 
import { AppContext } from '../../../App'
// USE BASKET
import useBasket from '../../hooks/useBasket'

// 43GuBLnLuyYCWPXru1jXtJBNFdy2

const HomeSreen = ({ navigation }) => {
    // USER 
    const { user } = useContext(AppContext)
    // FIREBASE 
    const { _readDataProfil, _readDataBaskets, baskets, profil, _updateData } = useFirebase()
    // USE BASKET 
    const { _totalBasket } = useBasket()

    // REACT BASKET AND PROFIL 
    useEffect(() => {
        _readDataBaskets(MODEL_STRING.key_uid_firebase)
        _readDataProfil(MODEL_STRING.key_uid_firebase)
    },[])

    // EDIT ORDER + NAVIGATION FOOD PAGE
    const _handleEditOrder = () => {
        const data = {
            validate:null
        }
        _updateData(`entreprises/${MODEL_STRING.key_uid_firebase}/baskets/${user.uid}`, data)
        navigation.navigate('Order', { screen: 'Food' })
    }

    return (
        <View style={styles.container}>

            {/* IF ORDER */}
            {baskets?.filter(basket => basket.id === user.uid && basket.validate === true).length !== 0 && 
                <View style={styles.viewOrder}>

                    {/* BUTTON EDIT ORDER */}
                    <TouchableOpacity style={styles.viewEdit} onPress={_handleEditOrder}>
                        <Text style={styles.edit}>modifier</Text>
                        <Ionicons name="ios-pencil-outline" size={24} color={MODEL_COLORS.white} />
                    </TouchableOpacity>

                    {/* TEXT + TOTAL PRICE */}
                    <Text style={styles.textOrder}>Commande à récupérer</Text>
                    <Text style={styles.textOrder}>{_totalBasket(baskets, user)} €</Text>
                    
                </View>
            }

            {/* GET PROFIL FROM FIREBASE */}
            {profil?.filter(pro => pro.id === 'profil').map(pro => (
                <ScrollView key={pro.id}>

                    {/* DESCRIBE RESTAURANT */}
                    <Text style={styles.text}>{pro.describe}</Text>

                    {/* HOURS OPEN */}
                    <View style={styles.viewBorder}>
                        <Text style={styles.text}>Ouvertures</Text>
                        <Text style={styles.text}>{pro.hours}</Text>
                    </View>

                    {/* ADDRESS */}
                    <View style={styles.viewBorder}>
                        <Text style={styles.text}>Adresse</Text>
                        <Text style={styles.text}>{pro.address}</Text>
                    </View>

                </ScrollView>
            ))}
            
        </View>
    )
}

export default HomeSreen

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: MODEL_COLORS.ultraLight,
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
    },
    text: {
        marginTop:15, 
        textAlign:"center", 
        fontSize:18,
    },
    viewBorder: {
        borderColor:MODEL_COLORS.main,
        borderWidth:1,
        margin:10,
        paddingBottom:15,
        borderRadius:10,
        marginTop:20
    },
})

/*

    const _handleAddRestaurant = () => {
        const data = {
            name:"values.name",
            describe:"values.describe",
            price:"values.price"
        }
        _writeData(`entreprises/${MODEL_STRING.key_uid}/plats`,data)
        console.log("HomeSreen _handleAddRestaurant")
    }

    <Button onPress={_handleAddRestaurant}>enregistrement database</Button>


*/