import React, { useState } from 'react'
import { ref, set, onValue, push, remove, update, query, orderByChild, equalTo } from 'firebase/database'
import database from './base'

const useFirebase = () => {
    const [plats, setPlats] = useState([])
    const [menu, setMenu] = useState([])
    const [baskets, setBaskets] = useState([])
    const [profil, setProfil] = useState([]) 
    const [tokens, setTokens] = useState([])
    const [clients, setClients] = useState([])
    const [messagesPush, setMessagesPush] = useState([])

    // MENU
    const _readDataMenu = (keyUid) => {
        setMenu([])
        const starCountRef = ref(database, 'entreprises/'+keyUid+'/menu')
        try {
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val()
                const dataList = []
                for (let id in data) {
                  dataList.push({id,...data[id]})
                }
                setMenu(dataList)
            })
        } catch {
            alert('il y a une erreur dans la lecture')
        }
    }

    // CLIENTS
    const _readDataClients = (keyUid) => {
        setClients([])
        const starCountRef = ref(database, 'entreprises/'+keyUid+'/clients')
        try {
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val()
                const dataList = []
                for (let id in data) {
                  dataList.push({id,...data[id]})
                }
                setClients(dataList)
            })
        } catch {
            alert('il y a une erreur dans la lecture')
        }
    }

    // BASKET
    const _readDataBaskets = (keyUid) => {
        setBaskets([])
        const starCountRef = ref(database, 'entreprises/'+keyUid+'/baskets')
        try {
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val()
                const dataList = []
                for (let id in data) {
                  dataList.push({id,...data[id]})
                }
                setBaskets(dataList)
            })
        } catch {
            alert('il y a une erreur dans la lecture')
        }
    }

    // PROFIL
    const _readDataProfil = (keyUid) => {
        setProfil([])
        const starCountRef = ref(database, 'entreprises/'+keyUid)  
        try {
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val() 
                const dataList = []
                for (let id in data) { 
                  dataList.push({id,...data[id]})
                }
                setProfil(dataList)
            })
        } catch {
            alert('il y a une erreur dans la lecture')
        }
    }

    // PUSH
    const _readDataPush = (keyUid) => {
        setMessagesPush([])
        const starCountRef = ref(database, 'entreprises/'+keyUid+'/messagesPush')
        try {
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val()
                const dataList = []
                for (let id in data) {
                  dataList.push({id,...data[id]})
                }
                setMessagesPush(dataList)
            })
        } catch {
            alert('il y a une erreur dans la lecture')
        }
    }

    // TOKENS
    const _readDataTokens = (keyUid) => {
        setTokens([])
        const starCountRef = ref(database, '/entreprises/'+keyUid+'/tokens')
        try {
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val()
                const dataList = []
                for (let id in data) {
                  dataList.push({id,...data[id]})
                }
                setTokens(dataList)
            })
        } catch {
            alert('il y a une erreur dans la lecture')
        }
    }

    // WRITE DATA 
    const _writeData = (id,data) => {
        console.log("useFirebase _writeData", id, data)
        try {
            const postListRef = ref(database, '/' + id)
            const newPostRef = push(postListRef)
            set(newPostRef, data)
        } catch (error) {
            console.log('Il y a une erreur dans l ecriture', error)
        }
    }

    // DELETE DATA 
    const _deleteData = (id) => {
        const todoRef = ref(database, '/' + id)
        remove(todoRef)  
    }

    // UPDATE DATA 
    const _updateData = (id,data) => { 
        console.log('userFirebase updateData ', id, data)
        const todoRef = ref(database, '/' + id)
        update(todoRef, data)
    }

    return {
        _writeData, 
        _updateData,
        _deleteData,
        plats,
        _readDataPush,
        messagesPush,
        _readDataProfil,
        profil,
        _readDataTokens,
        tokens,
        _readDataMenu,
        menu,
        _readDataBaskets,
        baskets,
        _readDataClients,
        clients,
    }
}

export default useFirebase