const WebSocket = require('ws');

var WSNRTConnect = function() {
    var thiz = this;
    thiz.uid = null;
    thiz.key = null;
    thiz.mac = null;
    thiz.saddr = null;
    thiz.onConnect = null;
    thiz.onConnectLost = null;
    thiz.onmessageArrive = null;

    thiz.setId = function(uid) {
        thiz.uid = uid;
    };
	
    thiz.setKey = function(key) {
        thiz.key = key;
    };

    thiz.setMac = function(mac) {
        thiz.mac = mac;
    };

    thiz.setServerAddr = function(addr) {
        thiz.saddr = addr;
    };
	
    thiz.disconnect = function() {
        if (thiz.wsc) {
            thiz.wsc.close();
        }
    };

    thiz.connect = function() {
        thiz.wsc = new WebSocket('ws://' + thiz.saddr);
        thiz.wsc.onopen = function(event) {
            var auth = {
                method: "authenticate",
                uid: thiz.uid,
                key: thiz.key		
            };
            var dat = JSON.stringify(auth);
            thiz.wsc.send(dat);	
            if (thiz.onConnect) thiz.onConnect();
        };
        
        thiz.wsc.onmessage = function(message) {
            try {
                var msg = JSON.parse(message.data);
                if (msg.method && msg.addr && msg.data) {
                    if (msg.method == 'message') {
                        console.log(msg);
                    }
                }
            } catch (err) {
                
            }
        };
        
        thiz.wsc.onclose = function() {
            if (thiz.onConnectLost) thiz.onConnectLost();
        };
    };

    thiz.sendMessage = function(mac, payload) {
        var msg = {
            method: "control",
            addr: mac,
            data: payload
        };
        var dat = JSON.stringify(msg);
        thiz.wsc.send(dat);
    };
};
