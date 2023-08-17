const socket = io.connect('http://54.147.250.151:7070', { transports: ['websocket'] });
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
    const strongAuthor = document.createElement("strong")
    strongAuthor.append(filterXSS(message.userName, xssFilterConfig))

    const dualPoint = document.createElement("div")
    dualPoint.append(" : ")

    strongAuthor.append(dualPoint)

    const paragraph = document.createElement("p")
    paragraph.append(message.message)

    const div = document.createElement("div")
    div.setAttribute("class", "message")
    div.append(strongAuthor)
    div.appendChild(paragraph)

    messages.append(div)
    messages.scrollTo(0, messages.scrollHeight)
};


$("#chat").submit((event) => {
    event.preventDefault();

    const userName = $("input[name=username]").val()
    const message = $("input[name=message]").val()

    if (!(userName.replaceAll(" ", "").length && message.replaceAll(" ", "").length)) return;
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