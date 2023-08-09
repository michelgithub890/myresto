import React, { useEffect } from 'react'
// REACT NATIVE 
import { View, Text, StyleSheet } from 'react-native'
// ICONS 
import { AntDesign } from '@expo/vector-icons'
// MODEL 
import { MODEL_STRING } from '../../models/modelText'
import { MODEL_COLORS } from '../../models/modelColors'
// FIREBASE 
import useFirebase from '../../firebase/useFirebase'

const Header = () => {
    // FIREBASE 
    const { profil, _readDataProfil } = useFirebase() 

    // READ PROFIL FIREBASE 
    useEffect(() => {
        _readDataProfil(MODEL_STRING.key_uid_firebase)
    },[])
    
    return (
        <View style={styles.container}>

            {/* GET PROFIL RESTAURANT  */}
            {profil.filter(pro => pro.id === 'profil').map(pro => (
                // NAME RESTAURANT 
                <Text style={styles.text} key={pro.id}>{pro.nameEntreprise}</Text>
            ))}
        </View>
    )
}

export default Header

// STYLES DESIGN 
const styles = StyleSheet.create({
    container: {
        height:50,
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
    },
    text: {
        fontSize:20,
        color:MODEL_COLORS.main,
        fontWeight:"bold",
    },
})
