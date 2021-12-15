const img = document.getElementById("img");
const HOST_IP='192.168.0.236';
const HOST_PORT=9998;

let Joy1
let donkey
let managePosition
let joy1IinputPosX
let joy1InputPosY
let defaultSpeed

window.onload=async function(){
    joy1IinputPosX = document.getElementById("joy1PosizioneX");
    joy1InputPosY = document.getElementById("joy1PosizioneY");
    defaultSpeed=document.getElementById('defaultSpeed');

    class JoyStick {
        constructor(t, e) { var n = void 0 === (e = e || {}).title ? "joystick" : e.title, i = void 0 === e.width ? 0 : e.width, o = void 0 === e.height ? 0 : e.height, r = void 0 === e.internalFillColor ? "#00AA00" : e.internalFillColor, d = void 0 === e.internalLineWidth ? 2 : e.internalLineWidth, h = void 0 === e.internalStrokeColor ? "#003300" : e.internalStrokeColor, a = void 0 === e.externalLineWidth ? 2 : e.externalLineWidth, f = void 0 === e.externalStrokeColor ? "#008000" : e.externalStrokeColor, c = void 0 === e.autoReturnToCenter || e.autoReturnToCenter, u = document.getElementById(t), l = document.createElement("canvas"); l.id = n, 0 === i && (i = u.clientWidth), 0 === o && (o = u.clientHeight), l.width = i, l.height = o, u.appendChild(l); var s = l.getContext("2d"), g = 0, v = 2 * Math.PI, m = (l.width - (l.width / 2 + 10)) / 2, p = m + 5, C = m + 30, w = l.width / 2, L = l.height / 2, E = l.width / 10, P = -1 * E, S = l.height / 10, k = -1 * S, W = w, T = L; function G() { s.beginPath(), s.arc(w, L, C, 0, v, !1), s.lineWidth = a, s.strokeStyle = f, s.stroke(); } function x() { s.beginPath(), W < m && (W = p), W + m > l.width && (W = l.width - p), T < m && (T = p), T + m > l.height && (T = l.height - p), s.arc(W, T, m, 0, v, !1); var t = s.createRadialGradient(w, L, 5, w, L, 200); t.addColorStop(0, r), t.addColorStop(1, h), s.fillStyle = t, s.fill(), s.lineWidth = d, s.strokeStyle = h, s.stroke(); } "ontouchstart" in document.documentElement ? (l.addEventListener("touchstart", function (t) { g = 1; }, !1), document.addEventListener("touchmove", function (t) { t.preventDefault(), 1 === g && t.targetTouches[0].target === l && (W = t.targetTouches[0].pageX, T = t.targetTouches[0].pageY, "BODY" === l.offsetParent.tagName.toUpperCase() ? (W -= l.offsetLeft, T -= l.offsetTop) : (W -= l.offsetParent.offsetLeft, T -= l.offsetParent.offsetTop), s.clearRect(0, 0, l.width, l.height), G(), x()); }, !1), document.addEventListener("touchend", function (t) { g = 0, c && (W = w, T = L); s.clearRect(0, 0, l.width, l.height), G(), x(); }, !1)) : (l.addEventListener("mousedown", function (t) { g = 1; }, !1), document.addEventListener("mousemove", function (t) { 1 === g && (W = t.pageX, T = t.pageY, "BODY" === l.offsetParent.tagName.toUpperCase() ? (W -= l.offsetLeft, T -= l.offsetTop) : (W -= l.offsetParent.offsetLeft, T -= l.offsetParent.offsetTop), s.clearRect(0, 0, l.width, l.height), G(), x()); }, !1), document.addEventListener("mouseup", function (t) { g = 0, c && (W = w, T = L); s.clearRect(0, 0, l.width, l.height), G(), x(); }, !1)), G(), x(), this.GetWidth = function () { return l.width; }, this.GetHeight = function () { return l.height; }, this.GetPosX = function () { return W; }, this.GetPosY = function () { return T; }, this.GetX = function () { return ((W - w) / p * 100).toFixed(); }, this.GetY = function () { return ((T - L) / p * 100 * -1).toFixed(); }, this.GetDir = function () { var t = "", e = W - w, n = T - L; return n >= k && n <= S && (t = "C"), n < k && (t = "N"), n > S && (t = "S"), e < P && ("C" === t ? t = "W" : t += "W"), e > E && ("C" === t ? t = "E" : t += "E"), t; }; }
    }
    Joy1=new JoyStick('joy1Div')
    donkey=socket(HOST_IP,HOST_PORT)
}

managePosition=function(){
    console.log("manage")
    let defSpeed=83;
    let dir='c';
    let speed=defSpeed;
    let x;
    let y;
    return{
        updateX:function(){
            x=Joy1.GetPosX();
            console.log(x)
            joy1IinputPosX.value=x;
        },
        updateY:function(){
            y=Joy1.GetPosY();
            joy1InputPosY.value=y;
        },
        calDir:function(){
            if(x<93){
                dir='l'
            }
            else if(x<107){
                dir='c'
            }
            else{
                dir='r'
            }
        },
        calSpeed:function(){
            if(x==100&&y==100){
                speed=0.0;
                return;
            }
            let calX=x-100;
            let calY=y-100;
            if(calX<0){
                calX=calX*-1;
            }
            if(calY<0){
                calY=calY*-1;
            }
            let w=(Math.sqrt(calX*calX+calY*calY)/5)
            console.log(w)
            speed=w;
        },
        updatePosition:function(){
            this.updateX()
            this.updateY()
            this.calDir()
            this.calSpeed();
        },
        setDefSpeed:function(){
            let value=defaultSpeed.value
            if(isNaN(value)){
                return
            }
            defSpeed=parseFloat(defaultSpeed.value);
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
        //영상 받으면 조향값 주는 방식임
        //전송은 따로 interval를 가지고 전송하는 것도 좋음
        setTimeout(function(){
            console.log("socket")
            let data=JSON.stringify(managePosition.getJSON())
            console.log(data)
            webSocket.send(data);
        },10)
    };
    webSocket.on
}

