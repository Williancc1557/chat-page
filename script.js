$(".messages").animate({ scrollTop: 20000000 }, "slow");

/* const socket = io.connect('https://api-chat-page.herokuapp.com', { transports: ['websocket'] });
 */

const socket = io.connect('http://localhost:3000', { transports: ['websocket'] });

const renderMessage = (message) => {
    $(".messages").append('<div class="message"><strong>' + filterXSS(message.author) + '</strong>: ' + filterXSS(message.message) + '</div>')
};


socket.on("previusMessage", (message) => {
    for (message of message) {
        renderMessage(message)
    };
});
socket.on("receivedMessage", (message) => {
    renderMessage(message);
});

$("#chat").submit(event => {
    event.preventDefault();
    $(".messages").animate({ scrollTop: 20000000 }, "slow");

    const author = $("input[name=username]").val();
    const message = $("input[name=message]").val();

    if (author.length && message.length) {
        const messageConfig = {
            author: author,
            message: message,
        };

        renderMessage(messageConfig);
        document.querySelector("input[name=message]").value = "";
        socket.emit('sendMessage', messageConfig);
    };
})