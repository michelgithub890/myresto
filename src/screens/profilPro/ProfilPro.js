import React, { useContext, useEffect, useRef } from 'react'
// REACT NATIVE 
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
} from 'react-native' 
// REACT NATIVE PAPER 
import { 
    Button,
    TextInput,
} from 'react-native-paper'
// MODELS 
import { MODEL_COLORS } from '../../models/modelColors'
import { MODEL_STRING } from '../../models/modelText'
// FIREBASE 
import useFirebase from '../../firebase/useFirebase'
// FORMULAIRE 
import useForm from '../../hooks/useForm'

const INITIAL_STATE = {
    nameEntreprise:'',
    phonePrivate:'',
    phoneRestaurant:'',
    address:'',
    hours:'',
    describe:'',
    mapRestaurant:'',
}


const ProfilPro = () => {
    // FORM 
    const { _handleChange, values, setValues } = useForm(INITIAL_STATE)
    // FIREBASE 
    const { _updateData, profil, _readDataProfil } = useFirebase()
    // USE REF 
    const scrollViewRef = useRef(null)

    useEffect(() => {
        _readDataProfil(MODEL_STRING.key_uid_firebase)
        _handleScrollToTop()
    },[])

    useEffect(() => {
        if (profil) {
            profil.filter(p => p.id === 'profil').map(p => {
                setValues(prev => ({
                    ...prev,
                    nameEntreprise:p.nameEntreprise,
                    phonePrivate:p.phonePrivate,
                    phoneRestaurant:p.phoneRestaurant,
                    address:p.address,
                    hours:p.hours,
                    describe:p.describe,
                    mapRestaurant:p.mapRestaurant
                }))
            })
        }
    },[profil])

    const _handleSave = () => {
        const text = values.mapRestaurant;
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const textAsString = text ? text.toString() : '';
        const match = textAsString.match(urlRegex)
        
        if (match) { 
          const urlMap = match[0];
          console.log(urlMap); // "https://maps.app.goo.gl/DsEVurLfax65SKY39"
        } else {
          console.log("URL not found");
        }
    
        const data = { 
            nameEntreprise:values.nameEntreprise ? values.nameEntreprise : '',
            phonePrivate:values.phonePrivate ? values.phonePrivate : '',
            phoneRestaurant:values.phoneRestaurant ? values.phoneRestaurant : '',
            address:values.address ? values.address : '',
            describe:values.describe ? values.describe : '',
            hours:values.hours ? values.hours : '',
            mapRestaurant:values.mapRestaurant ? values.mapRestaurant : '',
            googleMap:match ? match : '',
        }
        console.log('ProfilPro _handleSave ', data)
        _updateData(`entreprises/${MODEL_STRING.key_uid_firebase}/profil/`,data)
        _handleScrollToTop()
    }

    // SCROLL TO TOP 
    const _handleScrollToTop = () => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true })
    }

    return (
        <ScrollView keyboardShouldPersistTaps="always" ref={scrollViewRef}>

            <Text style={styles.title}>Fiche Restaurant</Text>

            {/* NAME ENTREPRISE */}
            <TextInput
                value={values.nameEntreprise}
                onChangeText={(text) => _handleChange('nameEntreprise', text)}
                placeholder="Nom entreprise"
                autoCompleteType="name"
                autoCorrect={false}
                returnKeyType="next"
                style={styles.input}
            />

            {/* PHONE PRIVATE */}
            <TextInput
                value={values.phonePrivate}
                onChangeText={(text) => _handleChange('phonePrivate', text)}
                placeholder="Téléphone privé"
                keyboardType="numeric"
                autoCompleteType="tel"
                autoCorrect={false}
                returnKeyType="next"
                style={styles.input}
            />

            {/* PHONE RESTAURANT */}
            <TextInput
                value={values.phoneRestaurant}
                onChangeText={(text) => _handleChange('phoneRestaurant', text)}
                placeholder="Téléphone restaurant"
                keyboardType="numeric"
                autoCompleteType="tel"
                autoCorrect={false}
                returnKeyType="next"
                style={styles.input}
            />

            {/* ADDRESS */}
            <TextInput
                value={values.address}
                onChangeText={(text) => _handleChange('address', text)}
                placeholder="Adresse"
                autoCompleteType="name"
                autoCorrect={false}
                returnKeyType="default"
                multiline={true}
                mode='outlined'
                style={[styles.input, { height: 100 }]}  // ajustez la hauteur selon vos besoins
            />

            {/* HOURS */}
            <TextInput
                value={values.hours}
                onChangeText={(text) => _handleChange('hours', text)}
                placeholder="Heures d'ouvertures"
                autoCompleteType="name"
                autoCorrect={false}
                returnKeyType="default"
                multiline={true}
                mode='outlined'
                style={[styles.input, { height: 100 }]}  // ajustez la hauteur selon vos besoins
            />

            {/* DESCRIB */}
            <TextInput
                value={values.describe}
                onChangeText={(text) => _handleChange('describe', text)}
                placeholder="Description"
                autoCompleteType="name"
                autoCorrect={false}
                returnKeyType="default"
                multiline={true}
                mode='outlined'
                style={[styles.input, { height: 100 }]}  // ajustez la hauteur selon vos besoins
            />

            {/* MAP RESTAURANT */}
            <TextInput
                value={values.mapRestaurant}
                onChangeText={(text) => _handleChange('mapRestaurant', text)}
                placeholder="Map restaurant"
                autoCompleteType="name"
                autoCorrect={false}
                returnKeyType="next"
                style={styles.input}
            />

            {/* BUTTON SAVE */}
            <Button style={styles.button} mode='contained' onPress={_handleSave} buttonColor={MODEL_COLORS.main}>ENREGISTRER</Button>

            <View style={{ height:60 }} />

        </ScrollView>
    )
}
 
export default ProfilPro

// STYLE DESIGN
const styles = StyleSheet.create({
    title:{
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
    },
})