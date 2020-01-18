import socketio from 'socket.io-client';

const socket = socketio('http://192.168.0.7:3333', {
    autoConnect: false,
})

function connect(latitude, longitude, techs) {
    socket.io.opts.query = {
        latitude,
        longitude,
        techs
    }
    socket.connect()
    socket.on('message', text => {
        console.warn(text);
    })


}
function disconnect() {
    if (socket.connected) {
        socket.disconnect();
    }
}

export {
    connect,
    disconnect
}
