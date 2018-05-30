const ChatService = require('chat-service')
var jwt = require("jsonwebtoken");

const port = 8040

function onConnect (service, id) {
    // Assuming that auth data is passed in a query string.
    let { query } = service.transport.getHandshakeData(id)
    let { userName } = query
    // Actually check auth data.
    // ...
    // Return a promise that resolves with a login string.
    return Promise.resolve(userName)
}


const chatService = new ChatService({port}, {onConnect})


    chatService.hasRoom('default').then(hasRoom => {
        if (!hasRoom) {
            return chatService.addRoom('default', { owner: 'admin' })
    }

    
})
