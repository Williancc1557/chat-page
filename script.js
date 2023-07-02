const socket = io.connect('https://willchat-socket-production.up.railway.app/', { transports: ['websocket'] });
const xssFilterConfig = {
    whiteList: {
        h1: ["false"],
    }
}

var url = new URL(window.location.href);
var key = url.searchParams.get("key")


socket.emit("JoinGroup", {
    key
})


socket.emit("ReceiveAllMessages", {
    key
})


const messages = document.querySelector(".messages")
const moveToTheBottom = () => {
    messages.scrollTo(0, messages.scrollHeight)
}

socket.on("ReceiveMessages", (message) => {
    for (let msg of message) {
        renderMessage(msg)
    }

    moveToTheBottom()
})

socket.on("Error", (message) => {
    const div = document.createElement("div")
    div.setAttribute("class", "error")
    div.append(message)
    messages.append(div)
})


const renderMessage = (message) => {
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

    if (!(userName.length && message.length)) return;
    const messageConfig = {
        userName,
        message,
        key,
        userId: "123"
    };

    renderMessage(messageConfig);
    document.querySelector("input[name=message]").value = "";
    socket.emit('SendMessage', messageConfig);
})




/* const muteChatMessage = (messageInput) => {
    document.getElementById("message").disabled = true;
    document.getElementById("message").placeholder = "you was muted for 2 minutes"
}

socket.on("blockChat", (message) => {
    const messageInput = document.getElementById("message")
    muteChatMessage(messageInput)
    renderMessage(message, true)
    setInterval(() => {
        messageInput.disabled = false
        messageInput.placeholder = "Send your message"
    }, 120000);
}) */