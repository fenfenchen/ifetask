window.onload = function(){
    var container = $("#container");
    var list = $("#list");
    var buttons= $("#buttons").getElementsByTagName("span");
    var prev = $("#prev");
    var next = $("#next");
    var index = 1;
    var len =5;
    var animated = false;
    var interval = 2000;
    var timer;

    function animate(offset){
        if(offset == 0){
            return;
        }
        animated = true;
        var time = 200;
        var interval = 10;
        var speed = offset/(time/interval);
        var left = parseInt(list.style.left) + offset;

        var go = function(){
            if((speed > 0 && parseInt(list.style.left) <left) || (speed < 0 && parseInt(list.style.left) > left)){
               list.style.left = parseInt(list.style.left) + speed + "px";
                setTimeout(go, interval);
            }

            else{
                list.style.left = left + "px";

                if(left > -400){
                    list.style.left = -1280*len + "px";
                }

                if(left < (-1280 * len)){
                    list.style.left = -1280 + "px";
                }

                animated = false;
            }

        }

        go();

    }

    function showButton(){
        for(var i= 0;i < buttons.length; i++){
            if(buttons[i].className == "on"){
                buttons[i].className = "";
                break;
            }
        }

        buttons[index -1].className = "on";
    }

    function play(){
        stop();
        timer = setTimeout(function(){
            next.onclick();
            play();
        },interval);
    }

    function stop(){
        clearTimeout(timer);
    }

    function rtl(){
        stop();
        timer = setTimeout(function(){
            prev.onclick();
            rtl();
        },interval);
    }

    next.onclick = function() {
        if (animated) {
            return;
        }

        if (index == 5) {
            index = 1;
        }

        else {
            index += 1;
        }

        animate(-1280);
        showButton();
    }

    prev.onclick = function(){
        if(animated){
            return;
        }

        if(index == 1){
            index =5;
        }

        else{
            index -= 1;
        }

        animate(1280);
        showButton();
    }

    for(var i = 0; i < buttons.length; i++){
        buttons[i].onclick = function(){
            if(animated){
                return;
            }

            if(this.className == "on"){
                return;
            }

            var myIndex = parseInt(this.getAttribute("index"));
            var offset = -1280* (myIndex - index);

            animate(offset);
            index = myIndex;
            showButton();
        }
    }

    $.on($('.playLtr'), 'click', play);
    $.on($('.playRtl'), 'click', rtl);
    $.on($('.stop'), 'click', stop);
}