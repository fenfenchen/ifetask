
var startX;        // 点击滑块时鼠标的坐标
var startY;
var startLeft;     // 拖动前滑块中心的坐标
var startTop;
var wrap = document.getElementsByClassName('drag-wrap');
var dragh = document.getElementsByClassName('drag')[0].offsetHeight; //42
var dragw = document.getElementsByClassName('drag')[0].offsetWidth; //152
console.log($('.drag-wrap'));
console.log(document.getElementsByClassName('drag-wrap'));

function nextDrag(element) {                     
    var brother = element.nextSibling;
    while (brother && brother.nodeName === '#text') {  
        brother = nextDrag(brother);
    }
    return brother;
}

function moveDrag(element, move) {              
    while (element) {
        element.style.top = parseInt(element.style.top) + move + 'px';
        element = nextDrag(element);
    }
}

function getLocation(event) {                    
    var location = [];                          
    var moveY = event.clientY - startY;
    var y = startTop + moveY;
    var mid = (wrap[0].offsetLeft + wrap[1].offsetLeft +150)/2;

    if (event.clientX < mid ) {                               
        location[0] = 0;
    }
    else if (event.clientX >= mid) {
        location[0] = 1;
    }

    location[1] = Math.floor(y / dragh);     
    var dragNum = wrap[location[0]].getElementsByClassName('drag').length;  
    location[1] = Math.max(location[1], 0);
    location[1] = Math.min(location[1], dragNum);

    return location;
}


function dragStart(e) {                                    
    e = e || window.event;                                 

    startX = e.clientX;                                      
    startY = e.clientY;

    startTop = this.offsetTop + dragh/2;                
    startLeft = this.offsetLeft + dragw/2;          

    this.style.zIndex = 1;                                   

    moveDrag(nextDrag(this), -dragh);                           
}

function draging(e) {                                       
    if (this.className !== 'dragging') {
        this.className = 'dragging';
    }
}

function dragOver(e) {                                     
    e.preventDefault();                                     
}

function drop(e) {                                           
    e = e || window.event;
    e.preventDefault();                                         
    var location = getLocation(e);                               
    var myWrap = wrap[location[0]];
    var myDrag = myWrap.getElementsByClassName('drag')[location[1]];  
    if (myDrag) {
        var myTop = myDrag.style.top;
    }
    else {                                                      
        var beforeDrag = myWrap.getElementsByClassName('drag')[location[1] - 1];
        if (beforeDrag) {
            var beforeTop = parseInt(beforeDrag.style.top);
        }
        else {                                                   
            beforeTop = -dragh;
        }
        var myTop = beforeTop + dragh + 'px';
    }

    moveDrag(myDrag, dragh);   

    var block = document.getElementsByClassName('dragging')[0];  
    block.style.top = myTop;
    block.style.zIndex = 0;
    block.className = 'drag';
    myWrap.insertBefore(block, myDrag);
}

window.onload = function () {
    var drag = document.getElementsByClassName('drag');
    for (var i = 0, len = drag.length; i < len; i++) {
        drag[i].draggable = true;
        drag[i].style.top = (i % (len/2) * (drag[i].offsetHeight)) + 'px';  

        $.on(drag[i], 'dragstart', dragStart);                      
        $.on(drag[i], 'drag', draging);                              
    }

    $.on(document.body, 'dragover', dragOver);    
    $.on(document.body, 'drop', drop);                               
}


