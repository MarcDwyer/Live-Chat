const messageform = document.querySelector('#messageform');
const message = document.querySelector('.message');
const chat = document.querySelector('#chat');
const userForm = document.querySelector('.listenhere');
const username = document.querySelector('#username');
const status = document.querySelector('.status');
const form = document.querySelector('form');


userForm.querySelector('input').addEventListener('input', getUser);
userForm.addEventListener('submit', getUser);

function getUser(e) {
    if (e.type === 'submit') e.preventDefault();
    if (e.target.value) {
        JSON.stringify(localStorage.setItem('user', e.target.value));
        return;
    }
    const getVal = userForm.querySelector('input').value;
    JSON.stringify(localStorage.setItem('user', getVal));
}
const name = localStorage.getItem('user');
if (name) {
    userForm.querySelector('input').value = name;
    status.textContent = `Welcome ${name}.`;
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

const socket = io.connect('/');

if(socket) {
socket.on('output', (data) => {
   
    if (data.length > 0) {
        data.forEach(item => {
            const comment = document.createElement('span');
            comment.innerHTML = `<strong>${item.name}:</strong> ${item.message}`;
            chat.classList.add('message');
            chat.appendChild(comment);
            
       //     chat.insertBefore(comment, chat.firstChild);
        })
        chat.scrollTo(0, 1000);
    }
})
    socket.on('status', (data) => {
        setStatus((typeof data === 'object')? data.message : data);
        if(data.clear) {
            status.value = '';
        }
    })
    form.addEventListener('submit', (e) => {
     //   if (e.keyCode === 13 && e.shiftKey == false) {
            socket.emit('input', {
                name: username.value,
                message: message.value
            });
            chat.scrollTo({top: 1000, behavior: "smooth"});
            message.value = '';
            e.preventDefault();
    //    }
    })
}
})();
