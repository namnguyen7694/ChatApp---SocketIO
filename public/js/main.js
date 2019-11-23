const socket = io();
const {name, room} = $.deparam(window.location.search)

socket.on("connect", () => {
    socket.emit("joinRoom", {
        name,
        room
    })
})

socket.on("serverMsg", msg =>{
    const olTag = $("#messages")
    const template = $("#message-template").html();
    const html = Mustache.render(template, {
        from: msg.from,
        createdAt: moment(msg.createdAt).format("hh:mm a") ,
        content : msg.content
    })
    olTag.append(html);
})

$("#message-form").on("submit", (e) => {
    e.preventDefault();
    socket.emit("sendMsg",
        {
            from: name,
            content: $("[name=message]").val(),
            createdAt: new Date()
        }
    );
    //clear old msg when sent and scroll to bottom msg
    $("[name=message]").val("");
    $("#messages").scrollTop($("#messages").height());
})

$("#send-location").on("click", () =>{
    if (!navigator.geolocation) {
        alert ("Trinh duyet khong tuong thich")
    }
    else {
        navigator.geolocation.getCurrentPosition(pos => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude

            socket.emit("clientLocation",{
                from: name,
                lat, lng
            })
        })
    }
})

socket.on("serverLocation", msg =>{
    const olTag = $("#messages");
    const template = $("#location-template").html();
    const html = Mustache.render(template, {
        from: msg.from,
        createdAt: msg.createdAt,
        href : `https://www.google.com/maps?q=${msg.lat},${msg.lng}`
    })
    olTag.append(html);
})

socket.on("userList", msg=> {
    const olTag = $("<ol></ol>")
    msg.userList.forEach (user => {
        const liTag = $(`<li>${user.name}</li>`)
        olTag.append(liTag)
    })
   $("#user").html(olTag)
})

