// 2.JavaScript数据类型及语言基础

// 判断arr是否为一个数组，返回一个bool值
function isArray(arr) {
    
    return  "[object Array]" === Object.prototype.toString.call(arr) ;
}

// 判断fn是否为一个函数，返回一个bool值
function isFunction(fn) {
    
    return "[object Function]" === Object.prototype.toString.call(fn);
}

//判断一个对象是不是字面量对象，即判断这个对象是不是由{}或者new Object类似方式创建
function isPlain(obj){
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        key;
    if(!obj ||
       Object.prototype.toString.call(obj) != "[object Object]" ||
       !("isPrototypeOf" in obj)
    ){
        return false;
    }

    //判断new fun()自定义对象的情况
    //constructor不是继承自原型链的并且原型中有isPrototypeOf方法才是Object
    if(obj.constructor &&
    !hasOwnProperty.call(obj,"constructor")&&
    !hasOwnProperty.call(obj.constructor.prototype,"isPrototypeOf")){
        return false;
    }

    for (key in obj){}
    return key === undefined || hasOwnProperty.call(obj,key);
}

// 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
// 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等
function cloneObject(src) {
    var result = src, i, len;
    if(!src
       || src instanceof Number
       || src instanceof String
       || src instanceof Boolean){
       return result;
    }else if(isArray(src)){
        result = [];
        var resultLen = 0;
        for(i=0,len=src.length;i<len;i++){
            result[resultLen++] = cloneObject(src[i]);
        }
    }else if(isPlain(src)){
        result = {};
        for(i in src){
            if(src.hasOwnProperty(i)){
                result[i] = cloneObject(src[i]);
            }
        }
    }
    return result;
}

/*
// 测试用例：
var srcObj = {
    a: 1,
    b: {
        b1: ["hello", "hi"],
        b2: "JavaScript"
    }
};
var abObj = srcObj;
var tarObj = cloneObject(srcObj);
srcObj.a = 2;
srcObj.b.b1[0] = "Heo";
console.log(abObj.a); 
console.log(abObj.b.b1[0]);
console.log(tarObj.a);      // 1  
console.log(tarObj.b.b1[0]);    // "hello"
*/

// 对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
function uniqArray(arr) {
    var obj = {};
    var reslt = [];
    for(var i = 0,len = arr.length;i < len; i++){
        var key = arr[i];

        if(!obj[key]){
            reslt.push(key);
            obj[key] = true;
        }
    }
    return reslt;
}

/* 
使用示例
var a = [1, 3, 5, 7, 5, 3];
var b = uniqArray(a);
console.log(b); // [1, 3, 5, 7]
*/

// 实现一个简单的trim函数，用于去除一个字符串，头部和尾部的空白字符
// 假定空白字符只有半角空格、Tab
// 练习通过循环，以及字符串的一些基本方法，分别扫描字符串str头部和尾部是否有连续的空白字符，并且删掉他们，最后返回一个完成去除的字符串
function simpleTrim(str) {
    function isEmpty(c){
        return /\s/.test(c); 
    }
    for(var i= 0,l=str.length;i<l;i++){
        if(!isEmpty(str.charAt(i))){ 
            break;
        }
    }
    for(var j=str.length;j>0;j--){
        if(!isEmpty(str.charAt(j-1))){
            break;
        }
    }
    if(i>j){
        return "";
    }
    return str.substring(i,j);
}

/*
使用示例
var str = '   hi!  ';
str = simpleTrim(str);
console.log(str); // 'hi!'
*/

// 接下来，我们真正实现一个trim
// 对字符串头尾进行空格字符的去除、包括全角半角空格、Tab等，返回一个字符串
// 尝试使用一行简洁的正则表达式完成该题目
function trim(str) {
    var trimer = new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)","g");

    return String(str).replace(trimer,"");
}

/*
使用示例
var str = '   hi!  ';
str = trim(str);
console.log(str); // 'hi!'
*/

// 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
function each(arr, fn) {
    for (var i = 0, len = arr.length; i < len; i++) {
        fn(arr[i], i); //一个2个参数都支持
    }
}

// 其中fn函数可以接受两个参数：item和index
// 使用示例
var arr = ['java', 'c', 'php', 'html'];
function output(item) {
    console.log(item)
}
each(arr, output);  // java, c, php, html
// 使用示例
/*
var arr = ['java', 'c', 'php', 'html'];
function output(item, index) {
    console.log(index + ': ' + item)
}
each(arr, output);  // 0:java, 1:c, 2:php, 3:html
*/


// 获取一个对象里面第一层元素的数量，返回一个整数
var getObjectLength = (function(){ 
    'ues strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({
            toString: null
        }).propertyIsEnumerable('toString');
        dontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyeIsEnumerable',
            'constructor'
        ],
        dontEnumsLength = dontEnums.length;
    return function(obj){
        if(typeof obj !== 'object' && (typeof obj !== 'function' || obj ===null)){
            throw new TypeError('getObjectLength called on non-object');
        }

        var result = [],
            prop,i;
        for(prop in obj){
            if(hasOwnProperty.call(obj, prop)){
                result.push(prop);
            }
        }
        if(hasDontEnumBug){
            for(i=0; i<dontEnumsLength; i++){
                if(hasOwnProperty.call(obj, dontEnums[i])){
                    result.push(dontEnums[i]);
                }
            }
        }
        return result.length;
    }
}());

/*
使用示例
var obj = {
    a: 1,
    b: 2,
    c: {
        c1: 3,
        c2: 4
    },
    d:2
};
console.log(getObjectLength(obj)); // 4
*/

// 判断是否为邮箱地址
function isEmail(emailStr) {
   
    return /\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/.test(emailStr);
}

// 判断是否为手机号
function isMobilePhone(phone) {
    
    return /^1\d{10}$/.test(phone);
}

/*
使用示例
var xyz1 = "sdfjls@sdf.com";
console.log(isEmail(xyz1));
var xyz2 = "133333";
console.log(isMobilePhone(xyz2));
*/


// 3.DOM
// 为element增加一个样式名为newClassName的新样式
function addClass(element,value) {
    //判断className属性是否为空
    if(!element.className) {
        element.className = value;
    }
    else {
        //若不为空，把空格和新的class设置值追加到className属性上去
        newClassName = element.className;
        newClassName += " ";
        newClassName += value;
        element.className = newClassName;
    }
}

/**
 * 移除element中的样式oldClassName
 *
 * @class
 */
function removeClass(element, oldClassName) {
    if ( element.className == oldClassName ) {
        try{
            element.removeAttribute("class");
        }
        catch( ex ) {
            element.className = "";
        }
    }
}



// 判断siblingNode和element是否为同一个父元素下的同一级的元素，返回bool值
function isSiblingNode(element, siblingNode) {
    return element.parentNode === siblingNode.parentNode; 
}

// 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
function getPosition(element) {
    var x = 0;
    var y = 0;
    var current = element;
    var pre = null;
    while(current !== null){
        x += current.offsetLeft; 
        y += current.offsetTop;  
        pre = current;
        current = current.offsetParent; 
    }

    return {x:x,y:y};
}

// 使用示例
//console.log(getPosition(document.getElementById("number1")));

// task 3.2
// 实现一个简单的Query
function $(selector) {

    var selItem = selector.split(" ");

    if ( selItem.length === 1 ) {
        var aitem = selItem.toString();
        switch ( aitem.substr(0, 1) ) {
            case "#":
                return document.getElementById( aitem.substr(1) );
                break;
            case ".":
                if (document.getElementsByClassName) {
                    return document.getElementsByClassName(aitem.substr(1))
                }else {
                    var nodes = document.getElementsByTagName("*"),ret = [];
                    for(i = 0; i < nodes.length; i++) {
                        if(hasClass(nodes[i],aitem.substr(1))){
                            ret.push(nodes[i])
                        }
                    }
                    return ret;
                }
                break;
            case "[":
                if ( aitem.charAt( aitem.length - 1 ) === "]" ) {

                    var item = aitem.substring( 1, aitem.length - 1 );
                    var elements = document.getElementsByTagName("*");

                    if ( item.indexOf("=")  != -1 ) {
                        var items = item.split("=");
                        for ( var j = 0; j < elements.length; j++) {
                            if ( elements[j].getAttribute( items[0] ) === items[1] ) {
                                return elements[j];
                            }
                        }
                    }
                    else {
                        for ( var i=0; i < elements.length; i++ ) {
                            if ( elements[i].hasAttribute( item ) ) {
                                return elements[i];
                            }
                        }
                    }
                }
                else
                {
                    throw Error( "']' is missing !" );
                }
                break;
            default :
                return document.getElementsByTagName( aitem );
        }
    }
    else {
        for ( var k = 1; k < selItem.length; i++ ) {

            if ( selItem[0].substr(0, 1) == "#" ) {
                var itemId = document.getElementById( selItem[0].substr(1) );
                switch ( selItem[k].substr(0,1) ) {
                    case ".":
                        return itemId.getElementsByClassName( selItem[k].substr(1) )[0];
                        break;
                    default :
                        return itemId.getElementsByTagName( selItem[k] );
                }
            }
            else if ( selItem[0].substr(0, 1) == "." ) {
                var itemClass = document.getElementsByClassName( selItem[0].substr(1) );
                switch ( selItem[k].substr(0, 1) ) {
                    case "#":
                        return itemClass.getElementById( selItem[k].substr(1) );
                        break;
                    default :
                        return itemId.getElementsByTagName( selItem[k] );
                }
            }
        }
    }
}


/*
// 可以通过id获取DOM对象，通过#标示，例如
$("#adom"); // 返回id为adom的DOM对象
// 可以通过tagName获取DOM对象，例如
$("a"); // 返回第一个<a>对象
// 可以通过样式名称获取DOM对象，例如
$(".classa"); // 返回第一个样式定义包含classa的对象
// 可以通过attribute匹配获取DOM对象，例如
$("[data-log]"); // 返回第一个包含属性data-log的对象
//$("[data-time=2015]"); // 返回第一个包含属性data-time且值为2015的对象
// 可以通过简单的组合提高查询便利性，例如
$("#adom .classa"); // 返回id为adom的DOM所包含的所有子节点中，第一个样式定义包含classa的对象
*/
function hasClass(tagStr,classStr){
    var arr=tagStr.className.split(/\s+/ ); //这个正则表达式是因为class可以有多个,判断是否包含
    for (var i=0;i<arr.length;i++){
        if (arr[i]==classStr){
            return true ;
        }
    }
    return false ;
}


// 4 事件
// 给一个element绑定一个针对event事件的响应，响应函数为listener
function addEvent(element, event, listener) {
    if(element){
        element['on' + event] = listener;
    }
}

// 移除element对象对于event事件发生时执行listener的响应
function removeEvent(element, event, listener) {
    element['on' + event] = null; //[]代表什么意思？
}

// 实现对click事件的绑定
function addClickEvent(element, listener) {
    if ( element.addEventListener ) {
        element.addEventListener( "click", listener, false );
    }
    else if ( element.attachEvent ) {
        element.attachEvent( "onclick", listener );
    }else {
        element["onclick"] = listener;
    }
}

// 实现对于按Enter键时的事件绑定
function addEnterEvent(element, listener) {
    element.onkeydown = function(e) { 
        e = e || window.event; 
        if (e.keyCode === 13) { 
            listener();
        }
    }
}

// 接下来我们把上面几个函数和$做一下结合，把他们变成$对象的一些方法
$.on = addEvent;
$.un = removeEvent;
$.click = addClickEvent;
$.enter = addEnterEvent;

// task 4.2
// 对一个列表里所有的<li>增加点击事件的监听
/*function clickListener(event) {
    console.log(event);
}*/

/*示例 点击打印事件
$.click($("#item1"), clickListener);
$.click($("#item2"), clickListener);
$.click($("#item3"), clickListener);
*/

// 我们通过自己写的函数，取到id为list这个ul里面的所有li，然后通过遍历给他们绑定事件。这样我们就不需要一个一个去绑定了。
/*function clickListener(event) {
    console.log(event);
}*/

/*function renderList() {
    $("#list").innerHTML = '<li>new item</li>';
}*/

function delegateEvent(element, tag, eventName, listener) {
   addEvent(element, eventName, function(e){
        var e = e || window.event;
        var target = e.srcElement ? e.srcElement : e.target; 
        var tname = target.nodeName.toLowerCase();
        if (tname === tag) {
            target['on' + eventName] = listener;
        }
    })
}

$.delegate = delegateEvent;

/*
使用示例
还是上面那段HTML，实现对list这个ul里面所有li的click事件进行响应
$.delegate($("#list"), "li", "click", clickListener);
*/

// 5 BOM
// 判断是否为IE浏览器，返回-1或者版本号
function isIE() {
    
    return /msie (\d+\.\d+)/i.test(navigator.userAgent) 
           ?(document.documentMode || + RegExp['\x241']) : -1; 
}

// 使用示例
//console.log(isIE());

// 设置cookie
function setCookie(cookieName, cookieValue, expiredays) {
   
    if(!isValidCookieName(cookieName)){
        return;
    }
    var expires;
    if(expiredays != null){
        expires = new Date();
        expires.setTime(expires.getTime() + expiredays * 24 * 60 * 60 *1000);
    }
    document.cookie =
        cookieName + '=' + encodeURIComponent(cookieValue) 
        + (expires ? '; expires=' + expires.toGMTSting() : ''); 
}

// 获取cookie值
function getCookie(cookieName) {
    if(isValidCookieName(cookieName)){
        var reg = new RegExp('(^|)' + cookieName + '=([^;]*)(;|\x24'); 
        var result = reg.exec(document.cookie);

        if(result){
            return result[2] || null;
        }
        return null;
    }
}

// 6.Ajax
// 学习Ajax，并尝试自己封装一个Ajax方法。
function ajax(url, options) {
    var options = options || {};
    var data = stringifyData(options.data || {});
    var type = (options.type || 'GET').toUpperCase();
    var xhr;
    var eventHandlers = {
        onsuccess: options.onsuccess,
        onfail: options.onfail
    };

    try { 
        if(type === 'GET' && data){
            url+=(url.indexOf('?') >= 0 ? '&' : '?') + data;
            data = null;
        }

        xhr = getXHR();
        xhr.open(type,url,ture);
        xhr.onreadystatechange = stateChangeHandler; 

        if(type === 'POST'){
            xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        }
        xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');
        xhr.send(data); 
    }
    catch(ex){ 
        fire('fail');
    }
    return xhr;
    function stringifyData(data){
        var param = [];
        for(var key in data){
            if(data.hasOwnProperty(key)){
                param.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
            }
        }
        return param.join('&');
    }
    function stateChangeHandler(){
        var stat;
        if(xhr.readyState === 4){
            try{
                stat = xhr.status;
            }
            catch(ex){
                fire('fail');
                return;
            }
            fire(stat);

            if((stat >= 200 && stat <300)
                || stat === 304
                || stat === 1223){
                fire('success')
            }
            else{
                fire('fail');
            }

            window.setTimeout(
                function(){
                    xhr.onreadystatechange = new Function();
                    xhr = null;
                },
                0
            );
        }
    }
    function getXHR(){
        if(window.ActiveXObject){ 
            try{
                return new ActiveXObject('Msxml2.XMLHTTP');
            }
            catch(e){
                try{
                    return new ActiveXObject('Microsoft.XMLHTTP');
                }
                catch(e){};
            }

        }
        if(window.XMLHttpRequest){
            return new XMLHttpRequest();
        }
    }
    function fire(type){ 
        type = 'on' + type;
        var handler = eventHandlers[type];
        if(!handler){
            return;
        }
        if(type !== 'onsuccess'){
            handler(xhr);
        }
        else{
            try{
                xhr.responseText;
            }
            catch(error){
                return handler(xhr);
            }
            handler(xhr,xhr.responseText); 
        }

    }
}

/*
使用示例：
ajax(
    'prompt.php',
    {
        data: {
            q: 'a'
        },
        onsuccess: function (responseText, xhr) {
            console.log(responseText);
        },
        onfail : function () {
            console.log('fail');
        }
    }
);
*/

/**
 * 阻止事件冒泡
 *
 * @class
 */
function stopBubble(e) {
    // 如果提供了事件对象，则这是一个非IE浏览器
    if ( e && e.stopPropagation ) {
        // 因此它支持W3C的stopPropagation()方法
        e.stopPropagation();
    }
    else {
        // 否则，我们需要使用IE的方式来取消事件冒泡
        window.event.cancelBubble = true;
    }
}

/**
 *功能：阻止事件默认行为
 */
function stopDefault( e ) {
    // 阻止默认浏览器动作(W3C)
    if ( e && e.preventDefault ) {
        e.preventDefault();
    }
    else {
        // IE中阻止函数器默认动作的方式
        window.event.returnValue = false;
    }
    return false;
}

// 兼容IE FF的getElementsByTagName办法
var getElementsByTagName = function(tag,name) {
    var returns = document.getElementsByName(name);
    if (returns.length > 0) return returns;
    returns = [];
    var e = document.getElementsByTagName(tag);
    for (var i = 0; i < e.length; i++) {
        if (e[i].getAttribute("name") == name) {
            returns[returns.length] = e[i];
        }
    }
    return returns;
};


//getNextElement() —— 获取下一个元素节点
function getNextElement(node) {
    if(node.nodeType == 1) {
        return node;
    }
    if(node.nextSibling) {
        return getNextElement(node.nextSibling);
    }
    return null;
}

//遍历元素监听事件
function delegateEleEvent(ele,listener){
    for(var i = 0,len=ele.length;i<len;i++){
        listener(ele[i]);
    }
}

//遍历元素添加鼠标事件
function delegateEleMouseEvent(ele,event,listener){
    for(var i = 0,len=ele.length;i<len;i++){
        addEvent(ele[i],event,listener);
    }
}

//遍历元素添加点击事件
function delegateClickEvent(ele,listener){
    for(var i = 0,len=ele.length;i<len;i++){
        addClickEvent(ele[i],listener);
    }
}

//遍历元素初始化样式
function delegateInitClass(ele,classname){
    var eles = ele.parentNode.children;
    for(var i = 0,len=eles.length;i<len;i++){
        removeClass(eles[i],classname);
    }
    addClass(ele,classname);
}

//addLoadEvent() —— 共享onload事件
function addLoadEvent(func) {
    var oldonload = window.onload;
    if(typeof window.onload != 'function') {
        window.onload = func;
    }
    else {
        window.onload = function(){
            oldonload();
            func();
        }
    }
}

//添加数组原型方法 查找指定位置的元素
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

//添加数组原型方法 去除指定位置的元素
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};