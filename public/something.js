const messageform = document.querySelector('#messageform');
const message = document.querySelector('.message');
const chat = document.querySelector('#chat');
const userForm = document.querySelector('.listenhere');
const username = document.querySelector('#username');
const status = document.querySelector('.status');
const form = document.querySelector('#messageform');
const statusDefault = status.textContent;

userForm.querySelector('input').addEventListener('input', getUser);
// userForm.addEventListener('submit', getUser);

function getUser(e) {

    const {value} = e.target;
    let isGore = '';
    if (value === 'Al Gore') {
        isGore = 'the god himself blesses us with his presence';
    }
    const welcomeText = `Welcome ${value} ${isGore}`;
    status.textContent = welcomeText;
    JSON.stringify(localStorage.setItem('user', value));
}
const name = localStorage.getItem('user');
if (name) {
    let isGore = '';
    if (name === 'Al Gore') isMarc = 'the god himself blesses us with his presence';
    userForm.querySelector('input').value = name;
    status.textContent = `Welcome ${name} ${isGore}`;
    userForm.querySelector('label').textContent = 'Username already entered! You can still change it.'
}

(() => {
const statusDefault = status.textContent;

const setStatus = ((s) => {
    if (!s) return;

status.textContent = s;
if (s !== statusDefault) {
    setTimeout(() => {
        setStatus(statusDefault);
    }, 4000)
}
});

const socket = io.connect(`${window.location.hostname}`);

if(socket) {
socket.on('output', (data) => {
   
    if (data.length > 0) {
        data.forEach(item => {
            const comment = document.createElement('span');
            comment.innerHTML = `<strong>${item.name}:</strong> ${item.message}`;
            chat.classList.add('message');
            chat.appendChild(comment);
            scrollBottom();
        })
    }
})
    socket.on('status', (data) => {
        setStatus((typeof data === 'object')? data.message : data);
        if(data.clear) {
            status.value = '';
        }
    })
    socket.on('counter', (data) => {

        const number = document.querySelector('.number');
        number.textContent = `${data} users online`;
    })

    form.addEventListener('submit', (e) => {

            socket.emit('input', {
                name: username.value,
                message: message.value
            });
            message.value = '';
            scrollBottom();
            e.preventDefault();
    //    }
    })
}
})();

function scrollBottom() {
    chat.scrollTo(0, 1000);
}