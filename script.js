const socket = io.connect('http://localhost:3000', { transports: ['websocket'] });
const messages = document.querySelector(".messages")
const xssFilterConfig = {
    whiteList: {
        h1: ["false"],
    }
}

const renderMessage = (message) => {
    const div = document.createElement("div")
    const strongAuthor = document.createElement("strong")
    strongAuthor.append(filterXSS(message.author, xssFilterConfig) + " : ")

    div.setAttribute("class", "message")
    div.append(strongAuthor)
    div.append(message.message)

    messages.append(div)
    messages.scrollTo(0, messages.scrollHeight)
};


socket.on("previusMessage", (message) => {
    for (message of message) {
        setInterval(renderMessage(message), 300)
    };
    messages.scrollTo(0, messages.scrollHeight)
});


socket.on("receivedMessage", (message) => {
    renderMessage(message);
});

$("#chat").submit(event => {
    event.preventDefault();

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