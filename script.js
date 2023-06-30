const socket = io.connect('https://willchat-socket-production.up.railway.app/', { transports: ['websocket'] });
const messages = document.querySelector(".messages")
const xssFilterConfig = {
    whiteList: {
        h1: ["false"],
    }
}

var url = new URL(window.location.href);
var key = url.searchParams.get("key")

console.log(key)

socket.emit("ReceiveAllMessages", {
    key
})

socket.on("ReceiveMessages", (message) => {
    console.log(message)
    if (message[0].key && message[0].key != key) return
    for (let msg of message) {
        renderMessage(msg)
    }
})



const renderMessage = (message, error = false) => {
    if (error) {
        const div = document.createElement("div")
        div.setAttribute("class", "error")
        div.append(message)
        return messages.append(div)
    }

    const div = document.createElement("div")
    const strongAuthor = document.createElement("strong")
    strongAuthor.append(filterXSS(message.userName, xssFilterConfig) + " : ")

    div.setAttribute("class", "message")
    div.append(strongAuthor)
    div.append(message.message)

    messages.append(div)
    messages.scrollTo(0, messages.scrollHeight)
};


$("#chat").submit((event) => {
    event.preventDefault();

    const userName = $("input[name=username]").val();
    const message = $("input[name=message]").val();

    if (userName.length && message.length) {
        const messageConfig = {
            userName,
            message,
            key,
            userId: "123"
        };

        renderMessage(messageConfig);
        document.querySelector("input[name=message]").value = "";
        socket.emit('SendMessage', messageConfig);
    };
})
















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
