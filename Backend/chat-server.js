const ChatService = require('chat-service')
var jwt = require("jsonwebtoken");

const port = 8040

function onConnect (service, id) {
    // Assuming that auth data is passed in a query string.
 
    let { query } = service.transport.getHandshakeData(id)
    let { token } = query;

    var decoded =  jwt.verify(token, 'secret');
    let username = decoded.username;
    return Promise.resolve(username)
}

const chatService = new ChatService({port}, {onConnect})
//chatService.config.enableRoomsManagement = true;
chatService.enableRoomsManagement = true;


chatService.hasRoom('default').then(hasRoom => {
    if (!hasRoom) {
        return chatService.addRoom('default', { owner: 'admin' })
}

    
})
