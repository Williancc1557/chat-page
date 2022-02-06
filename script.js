const socket = io.connect('https://api-chat-page.herokuapp.com', { transports: ['websocket'] });

const renderMessage = (message) => {
    $(".messages").append('<div class="message"><strong>' + message.author + '</strong>: ' + message.message + '</div>')
}
socket.on("previusMessage", (message) => {
    for (message of message) {
        renderMessage(message)
    }
})
socket.on("receivedMessage", (message) => {
    renderMessage(message)
})

$("#chat").submit(event => {
    event.preventDefault();

    const author = $("input[name=username]").val()
    const message = $("input[name=message]").val()

    if (author.length && message.length) {
        const messageConfig = {
            author: author,
            message: message,
        }

        renderMessage(messageConfig)

        socket.emit('sendMessage', messageConfig)
    }
})