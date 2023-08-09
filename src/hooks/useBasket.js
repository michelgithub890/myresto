import React from 'react'

const useBasket = () => {
 
    // TOTAL BASKET 
    const _totalBasket = (baskets, user) => {
        // FOR EACH ITEM =>  QUANTITY * PRICE => TOTAL BASKET
        let totalPrice = 0
    
        baskets?.filter(basket => basket.id === user.uid).forEach(basket => {
            Object.values(basket).forEach(item => {
                if (item.price && item.quantity) {
                    totalPrice += parseInt(item.price) * item.quantity
                }
            })
        })

        return totalPrice
    }

    // GET BASKET 
    const _displayBasket = (baskets, user) => {
        let ids = []  // Temporaire pour stocker les idPlats
        baskets?.filter(basket => basket.id === user.uid && basket.validate !== true).forEach(basket => {
            Object.values(basket).forEach(item => {
                if (item.price && item.quantity) {
                    if(item.idPlat) {
                        ids.push({
                            idPlat:item.idPlat, 
                            title:item.title, 
                            subTitle:item.subTitle, 
                            price:item.price,  
                            quantity:item.quantity, 
                            category:item.category,
                            totalPrice: parseInt(item.price) * parseInt(item.quantity)
                        })
                    }
                }
            })
        })

        return ids

    }

    // GET ALL ITEM FROM BASKET 
    const _displayAllBasket = (basket) => {
        let ids = []  // Temporaire pour stocker les idPlats

        Object.values(basket).forEach(item => {
            if (item.price && item.quantity) {
                if(item.idPlat) {
                    ids.push({
                        idPlat:item.idPlat, 
                        title:item.title, 
                        subTitle:item.subTitle, 
                        price:item.price,  
                        quantity:item.quantity, 
                        category:item.category,
                        totalPrice: parseInt(item.price) * parseInt(item.quantity)
                    })
                }
            }
        })

        return ids

    }

    // TOTAL PRICE BASKET SINGLE 
    const _totalBasketSingle = (basket) => {
        let totalPrice = 0
    
        Object.values(basket).forEach(item => {
            if (item.price && item.quantity) {
                totalPrice += parseInt(item.price) * item.quantity
            }
        })

        return totalPrice
    }

    return {
        _totalBasket,
        _displayBasket,
        _displayAllBasket,
        _totalBasketSingle,
    }
}

export default useBasket