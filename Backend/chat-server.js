const ChatService = require('chat-service')
var jwt = require("jsonwebtoken");

const port = 8040

function onConnect (service, id) {
    // Assuming that auth data is passed in a query string.
    let { query } = service.transport.getHandshakeData(id)
    let { userName } = query
    // Actually check auth data.
    jwt.verify(token, 'secret', function(err, decoded) {
        if (err) {
            return Promise.reject("Expired or non valid token!"); 
        }

        return Promise.resolve(userName)
    });
}


const chatService = new ChatService({port}, {onConnect})


    chatService.hasRoom('default').then(hasRoom => {
        if (!hasRoom) {
            return chatService.addRoom('default', { owner: 'admin' })
    }

    
})
