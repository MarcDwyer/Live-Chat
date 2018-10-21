const messageform = document.querySelector('#messageform');
const message = document.querySelector('.message');
const chat = document.querySelector('#chat');
const userForm = document.querySelector('.listenhere');
const username = document.querySelector('#username');
const status = document.querySelector('.status');

(() => {
const statusDefault = status.texContent;

const setStatus = ((s) => {
status.texContent = s;
if (s !== statusDefault) {
    setTimeout(() => {
        setStatus(statusDefault);
    }, 3000)
}
});

const socket = io.connect('http://localhost:5000');

if(socket) {
socket.on('output', (data) => {
    console.log(data);
    if (data.length > 0) {
        data.forEach(item => {
            const comment = document.createElement('span');
            comment.innerHTML = `<strong>${item.name}:</strong> ${item.message}`;
            chat.classList.add('message');
            chat.appendChild(comment);
       //     chat.insertBefore(comment, chat.firstChild);
        })
    }
})
    socket.on('status', (data) => {
        setStatus((typeof data === 'object')? data.message : data);
        if(data.clear) {
            message.value = '';
        }
    })
    message.addEventListener('keyup', (e) => {
        if (e.keyCode === 13 && e.shiftKey == false) {
            console.log('how many times is this shit running')
            console.log(message.value, username.value)
            socket.emit('input', {
                name: username.value,
                message: message.value
            });
            e.preventDefault();
        }
    })
}
})();
