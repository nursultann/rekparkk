import Pusher from 'pusher-js'
import eventBus from './event_bus';
import { message } from 'antd';

const pusher = new Pusher('a93eea2d3346ba7f82c9', {
    cluster: 'ap2',
});

export const subscribeToPusher = (userId) => {
    var channel = pusher.subscribe(`chat.${userId}`);
    channel.bind('message-event', function(data) {
        console.log('message', data);
        /*
        {
            user: {},
            // receiver: {},
            message: {
                id: int,
                text: string,
                created_at: datetime,
            },
        }
        */
        const messag = JSON.stringify(data);
        eventBus.dispatch('chat-message', messag);
        if(messag!=null){
        message.info("Вам пришло сообщение!");
        // alert(messag);
        }
    });
}

export const unsubscribeFromPusher = (userId) => {
    pusher.unsubscribe(`user.${userId}`);
}

