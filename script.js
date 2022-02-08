const socket = io.connect('https://api-chat-page.herokuapp.com', { transports: ['websocket'] });
const messages = document.querySelector(".messages")
const xssFilterConfig = {
    whiteList: {
        h1: ["false"],
    }
}

const renderMessage = (message, error = false) => {
    if (error) {
        const div = document.createElement("div")
        div.setAttribute("class", "error")
        div.append(message)
        return messages.append(div)
    }

    const div = document.createElement("div")
    const strongAuthor = document.createElement("strong")
    strongAuthor.append(filterXSS(message.author, xssFilterConfig) + " : ")

    div.setAttribute("class", "message")
    div.append(strongAuthor)
    div.append(message.message)

    messages.append(div)
    messages.scrollTo(0, messages.scrollHeight)
};

const muteChatMessage = (messageInput) => {
    document.getElementById("message").disabled = true;
    document.getElementById("message").placeholder = "you was muted for 2 minutes"
}


socket.on("sendError", (message) => {
    const messageInput = document.getElementById("message")
    renderMessage(message, true)
})

socket.on("blockChat", (message) => {
    const messageInput = document.getElementById("message")
    muteChatMessage(messageInput)
    renderMessage(message, true)
    setInterval(() => {
        messageInput.disabled = false
        messageInput.placeholder = "Send your message"
    }, 120000);
})

socket.on("previusMessage", (message) => {
    for (message of message) {
        setInterval(renderMessage(message), 300)
    };
    messages.scrollTo(0, messages.scrollHeight)
});


socket.on("receivedMessage", (message) => {
    renderMessage(message);
});

$("#chat").submit((event) => {
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