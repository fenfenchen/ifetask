var downTimes = 0;
var upTimes = 0;

function showData() {
    clear();

    var str = $("#search").value;
    var suggestData = ['test1', 'test2','test3'];

    var ul = document.createElement("ul");
    ul.setAttribute("id", "data");

    var form = $("#dataForm");
    form.appendChild(ul);

    for ( var i = 0; i < suggestData.length; i++) {
        if ( suggestData[i].charAt(0) == str.charAt(0)) {
            var li = document.createElement("li");
            li.setAttribute("class","dataLi");
            li.innerHTML = suggestData[i];
            ul.appendChild(li);
        }
        ul.style.display ="block";
    }
}

function clear() {
    var form = $("#dataForm");
    var ul = $("#data");
    form.removeChild(ul);
}

function selectItem() {
    var search = $("#search");
    var lis = $("#data").getElementsByTagName("li");
    var dataArr = [];

    if ( lis.length > 0) {
        for (var i = 0; i < lis.length; i ++) {
            dataArr[i] = lis[i].innerHTML; 
        }

        if (event.keyCode == 40) {
            for (var j = 0; j < lis.length; j++) {
                lis[j].style.background="none";
            }
            lis[downTimes%dataArr.length].style.background="#c0c0c0";
            downTimes++;
        }

        if (event.keyCode == 38) {
            for (var j = 0; j < lis.length; j++) {
                lis[j].style.background="none";
            }
            lis[(dataArr.length-1-upTimes%dataArr.length)].style.background="#c0c0c0";
            upTimes++;
        }

        if (event.keyCode == 13){ 
            for (var j = 0; j < lis.length; j++) {

                if (lis[j].style.background == 'rgb(192, 192, 192)'){
                    search.value = dataArr[j];
                }
            }
           $("#data").style.display = "none";
        }
    }
}
