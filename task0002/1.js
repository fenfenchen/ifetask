window.onload = function(){
    $.on($('.step1 .submit'), 'click', step1);
    $.on($('.step2 .submit'), 'click', step2);
    $.on($('.step3 .submit'), 'click', step3);
    $.on($('.step1 .reset'), 'click', reset);
    $.on($('.step2 .reset'), 'click', reset);
    $.on($('.step3 .reset'), 'click', reset);
}

//在最后显示结果
function insertAfter(newElement, existElement){
    var existParent = existElement.parentNode;
    if(existParent.parentNode){
        existParent.parentNode.insertBefore(newElement, existParent.nextSibling); 
    }
    return newElement;
}

//去空
function filterArray(arr){
    var result = [];
    each(arr, function(item){ 
        if(item){
            result.push(item);
        }
    });
    return result;
}

//step1
function step1(e){
    var input = trim($('.step1 .myinput').value);
    var arr = input.split(',');
    arr = uniqArray(arr);
    arr = filterArray(arr); 
    var output = arr.join(',');
    var p = document.createElement('p');
    p.innerHTML = output;
    insertAfter(p, e.target);
}

//step2
function step2(e){
    var input = trim($('.step2 .myTextArea').value);
    var arr = input.split(/[,，、；;\s]/); 
    arr = uniqArray(arr);
    arr = filterArray(arr);
    var output = arr.join(',');
    var p = document.createElement('p');
    p.innerHTML = output;
    insertAfter(p, e.target);
}

//step3
function showErr(msg){
    if(msg){
        $('.error').innerHTML = msg;
    }
    else{
        $('.error').innerHTML = '';
    }
}

function step3(e){
    var input = trim($('.step3 .myTextArea').value);
    if(!input){
        return showErr('输入不能为空');
    }
    var arr = input.split(/[,，、；;\s]/);
    arr = uniqArray(arr);
    arr = filterArray(arr);

    if(arr.length >10){
        return showErr('用户输入的爱好数量不能超过10个');
    }
    var p = document.createElement('p');
    each(arr, function(item, i){
        var checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', 'checkboxid' +i);
        var label = document.createElement('label');
        label.setAttribute('for', 'checkboxid' +i);
        label.innerHTML = item;
        p.appendChild(checkbox);
        p.appendChild(label);
    })
    insertAfter(p, e.target);
}

function reset(e) {
    $('.error').innerHTML = '';
    event.target.parentNode.previousSibling.previousSibling.value = ''; 
    event.target.parentNode.parentNode.removeChild($('p'));
}

