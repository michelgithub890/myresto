import { format } from 'date-fns'

const usePush = () => {

    // trigger:1000, 

    // Can use this function below, OR use Expo's Push Notification Tool-> https://expo.dev/notifications
    async function _sendPushNotification(expoPushToken,titlePush,messagePush) { 
 
        // token super mario d5Zt97BGJaZEvptlEnz_fx  

        const message = {
            to: 'ExponentPushToken[' + expoPushToken + ']', 
            "priority": "high", 
            sound: 'default',
            title: titlePush,
            body: ' '+messagePush,
            data: { someData: 'goes here' },
        };  
    
        await fetch('https://exp.host/--/api/v2/push/send', { 
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*', 
            },
            body: JSON.stringify(message),
            mode:'no-cors', 
        })

        console.log('usePush _sendPushNotification ', expoPushToken, titlePush, messagePush)
    }

    return { _sendPushNotification }
}

export default usePush 