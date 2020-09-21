import io from 'socket.io-client';
import Cfg from "./cfg.js";

const socket = io(Cfg.env().host);

socket.on('connect', () => {
    console.log('Successfully connected!');
});


socket.on("messageToClients", async (message, chatId, productId) => {
    const { isAuthenticated } = socket.appStore.users.isAuthenticated;
    if (isAuthenticated) {
        let product = socket.appStore.products.getStoresProduct(productId);
        !product && await socket.appStore.products.getProduct(productId); 
        const chatExist = socket.appStore.chats.list.some(chat => chat._id === chatId);
        !chatExist && socket.appStore.chats.getChat(chatId);
        socket.appStore.chats.updateCorrespondenceChat({ message, chatId });
        socket.appStore.chats.sortChatList();
    }
});

export {
    socket
};