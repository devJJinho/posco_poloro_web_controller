let joy1IinputPosX = document.getElementById("joy1PosizioneX");
let joy1InputPosY = document.getElementById("joy1PosizioneY");
let joy1Direzione = document.getElementById("joy1Direzione");
let joy1X = document.getElementById("joy1X");
let joy1Y = document.getElementById("joy1Y");
let img = document.getElementById("img");
let defaultSpeed=document.getElementById('defaultSpeed');

const HOST_IP='192.168.0.236';
const HOST_PORT=9998;

class JoyStick {
    constructor(t, e) { var n = void 0 === (e = e || {}).title ? "joystick" : e.title, i = void 0 === e.width ? 0 : e.width, o = void 0 === e.height ? 0 : e.height, r = void 0 === e.internalFillColor ? "#00AA00" : e.internalFillColor, d = void 0 === e.internalLineWidth ? 2 : e.internalLineWidth, h = void 0 === e.internalStrokeColor ? "#003300" : e.internalStrokeColor, a = void 0 === e.externalLineWidth ? 2 : e.externalLineWidth, f = void 0 === e.externalStrokeColor ? "#008000" : e.externalStrokeColor, c = void 0 === e.autoReturnToCenter || e.autoReturnToCenter, u = document.getElementById(t), l = document.createElement("canvas"); l.id = n, 0 === i && (i = u.clientWidth), 0 === o && (o = u.clientHeight), l.width = i, l.height = o, u.appendChild(l); var s = l.getContext("2d"), g = 0, v = 2 * Math.PI, m = (l.width - (l.width / 2 + 10)) / 2, p = m + 5, C = m + 30, w = l.width / 2, L = l.height / 2, E = l.width / 10, P = -1 * E, S = l.height / 10, k = -1 * S, W = w, T = L; function G() { s.beginPath(), s.arc(w, L, C, 0, v, !1), s.lineWidth = a, s.strokeStyle = f, s.stroke(); } function x() { s.beginPath(), W < m && (W = p), W + m > l.width && (W = l.width - p), T < m && (T = p), T + m > l.height && (T = l.height - p), s.arc(W, T, m, 0, v, !1); var t = s.createRadialGradient(w, L, 5, w, L, 200); t.addColorStop(0, r), t.addColorStop(1, h), s.fillStyle = t, s.fill(), s.lineWidth = d, s.strokeStyle = h, s.stroke(); } "ontouchstart" in document.documentElement ? (l.addEventListener("touchstart", function (t) { g = 1; }, !1), document.addEventListener("touchmove", function (t) { t.preventDefault(), 1 === g && t.targetTouches[0].target === l && (W = t.targetTouches[0].pageX, T = t.targetTouches[0].pageY, "BODY" === l.offsetParent.tagName.toUpperCase() ? (W -= l.offsetLeft, T -= l.offsetTop) : (W -= l.offsetParent.offsetLeft, T -= l.offsetParent.offsetTop), s.clearRect(0, 0, l.width, l.height), G(), x()); }, !1), document.addEventListener("touchend", function (t) { g = 0, c && (W = w, T = L); s.clearRect(0, 0, l.width, l.height), G(), x(); }, !1)) : (l.addEventListener("mousedown", function (t) { g = 1; }, !1), document.addEventListener("mousemove", function (t) { 1 === g && (W = t.pageX, T = t.pageY, "BODY" === l.offsetParent.tagName.toUpperCase() ? (W -= l.offsetLeft, T -= l.offsetTop) : (W -= l.offsetParent.offsetLeft, T -= l.offsetParent.offsetTop), s.clearRect(0, 0, l.width, l.height), G(), x()); }, !1), document.addEventListener("mouseup", function (t) { g = 0, c && (W = w, T = L); s.clearRect(0, 0, l.width, l.height), G(), x(); }, !1)), G(), x(), this.GetWidth = function () { return l.width; }, this.GetHeight = function () { return l.height; }, this.GetPosX = function () { return W; }, this.GetPosY = function () { return T; }, this.GetX = function () { return ((W - w) / p * 100).toFixed(); }, this.GetY = function () { return ((T - L) / p * 100 * -1).toFixed(); }, this.GetDir = function () { var t = "", e = W - w, n = T - L; return n >= k && n <= S && (t = "C"), n < k && (t = "N"), n > S && (t = "S"), e < P && ("C" === t ? t = "W" : t += "W"), e > E && ("C" === t ? t = "E" : t += "E"), t; }; }
}
const Joy1 = new JoyStick('joy1Div');
const donkey=socket(HOST_IP,HOST_PORT)

setInterval(function(){ joy1IinputPosX.value=Joy1.GetPosX(); }, 50);
setInterval(function(){ joy1InputPosY.value=Joy1.GetPosY(); }, 50);

const managePosition=function(){
    let defSpeed=0.55;
    let dir='c';
    let speed=defSpeed;
    let x;
    let y;
    return{
        updateX:function(){
            x=Joy1.GetPosX();
            joy1IinputPosX.value=x;
        },
        updateY:function(){
            y=Joy1.GetPosY();
            joy1IinputPosX.value=y;
        },
        calDir:function(){
            if(x<83){
                dir='l'
            }
            else if(x<117){
                dir='c'
            }
            else{
                dir='r'
            }
        },
        calSpeed:function(){
            let w=((y-100)*-1)/5;
            speed=defSpeed+w;
        },
        updatePosition:function(){
            this.updateX()
            this.updateY()
            this.calDir()
            this.calSpeed();
        },
        setDefSpeed:function(){
            defSpeed=defaultSpeed.value;
        },
        getJSON:function(){
            this.updatePosition();
            let steeringData={
                'dir':dir,
                'def_speed':defSpeed,
                'speed':speed
            }
            return steeringData;
        }
    }
}();

function socket(host,port){
    var webSocket = new WebSocket("ws://"+host+":"+port);
    webSocket.binaryType = "blob";
    webSocket.onopen = function(message){
        console.log("Server connect...\n");
    };
    webSocket.onclose = function(message){
        console.log("Server Disconnect...\n");
    };
    webSocket.onerror = function(message){
        console.log("error...\n");
    };
    webSocket.onmessage = function(msg){
        var blob = msg.data;
        var reader = new FileReader();
        reader.onloadend = function() {
            var string = reader.result;
            var data = "data:image/jpeg;base64,"+string;
            var img = document.getElementById('img');
            img.src = data;
        };
        reader.readAsBinaryString(blob);
        setTimeout(function(){
            let data=JSON.stringify(managePosition.getJSON())
            console.log(data)
            webSocket.send(data);
        },10)
    };
}

