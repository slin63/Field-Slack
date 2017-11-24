// Connection socket
io.on('connection', (socket) => {
    console.log('user connected');
});

// Send message socket
socket.on('new-message', (message) => {
    console.log(message);
});