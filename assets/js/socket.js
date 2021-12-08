const HOST_IP='192.168.0.236';
const HOST_PORT=9998;

socket(HOST_IP,HOST_PORT)

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
            w=((y-100)*-1)/5;
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
            steeringData={
                'dir':dir,
                'def_speed':defSpeed,
                'speed':speed
            }
            return steeringData;
        }
    }
}();

function socket(host,port){
    this.host=host
    this.port=port
    var webSocket = new WebSocket("ws://"+host+port);
    webSocket.binaryType = "blob";
    webSocket.onopen = function(message){
        messageTextArea.value += "Server connect...\n";
    };
    webSocket.onclose = function(message){
        messageTextArea.value += "Server Disconnect...\n";
    };
    webSocket.onerror = function(message){
        messageTextArea.value += "error...\n";
    };
    webSocket.onmessage = function(msg){
        var blob = msg.data;
        var reader = new FileReader();
        reader.onloadend = function() {
            var string = reader.result;
            var data = "data:image/jpeg;base64,"+string;
            var im = document.getElementById('img');
            img.src = data;
        };
        reader.readAsBinaryString(blob);
        setTimeout(function(){
            webSocket.send(JSON.stringify(managePosition.getJSON));
        },10)
    };
}