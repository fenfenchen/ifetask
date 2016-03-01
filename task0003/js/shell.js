
var init = {
    todoCateList: $(".todo-category-list")[0],
    taskInventory: $(".todo-inventory-detail")[0],
    todoDetail: $("dd"),

    todoDefault: (function(){
        var taskTitle = $("#todo-default-title");
        var taskTime = $("#todo-default-time");
        var taskContent = $("#todo-default-content");

        return [taskTitle, taskTime, taskContent];
    })(),

    todoEdit: (function(){
        var taskTitle = $("#todo-task-title");
        var taskTime = $("#todo-task-time");
        var taskContent = $("#todo-task-content");
        taskTitle.style.display = "none";
        taskTime.style.display = "none";
        taskContent.style.display = "none";

        return [taskTitle, taskTime, taskContent];
    })(),

    todoSpecEdit: $(".todo-spec-edit")[0],
    todoEditIcon: $(".fa-pencil-square-o")[0],
    todoCheckIcon: $(".fa-check-square-o")[0],
    todoUndoEle: $(".fa-undo")[0],
    todoCheckEle: $(".fa-check")[0],
    todoAddTask: $("#todo-add-task"),
    todoTotal: $("#todo-total-count"),

    todoInventory: $(".todo-inventory-category")[0].children,
    todoCateBtn: $("#todo-add-category"),
    todoCateAll: $(".todo-category-total")[0],
    todoAllBtn: $("#todo-all"),

    addCateSelect: $("#add-cate-main"),
    addCateName: $("#add-cate-name"),
    addCateCancel: $("#add-cate-cancel"),
    addCateCheck: $("#add-cate-check"),

    todoTaskItem: (function(){
        var todoTaskList = $(".todo-task-list");
        var todoItem = [];
        for(var j = 0, len = todoTaskList.length; j < len; j++){
            var todoTaskItem = todoTaskList[j].getElementsByTagName("li");
            each(todoTaskItem, function(item){
                todoItem.push(item);
            });
        }

        return todoItem;
    })(),

    removeIcon: (function(){
        var removeListIcon = $(".fa-trash-o");
        var removeItem = [];
        each(removeListIcon, function(item){
            removeItem.push(item);
        });
        return removeItem;
    })(),

    todoTaskList: $(".todo-task-list"),

    classToggle: function(e){
        e = e || window.event;
        var target = e.target || e.srcElement;
        stopBubble(e);
        var classname = "";
        if(target.parentNode){
            switch (target.parentNode.className){
                case "todo-inventory-detail":
                    classname = "todo-detail-selected";
                    break;

                case "todo-inventory-category":
                    classname = "todo-inventory-selected";
                    break;

                case "todo-task-list":
                    classname = "todo-task-selected";
                    for(var j = 0, len = init.todoTaskItem.length; j < len; j++){
                        removeClass(init.todoTaskItem[j], classname);
                    }
                    break;
            }
            delegateInitClass(target, classname);
        }
    }
};

(function(){
    each(data.cates, addCate);
    each(data.lists, addList);
    addInventory(data.tasks[0]);
    addContent(data.tasks[0]);

    var listFirst = $(".todo-task-list")[0].getElementsByTagName("li")[0];
    if(listFirst){
        addClass(listFirst, "todo-task-selected");
    }

    var titleFirst = $("dd")[0];
    if(titleFirst){
        addClass(titleFirst, "todo-detail-selected");
    }

    init.todoTotal.innerHTML = "(" + todoCount("data.tasks", "all") + ")";

    delegateClickEvent(init.todoInventory, init.classToggle);
    delegateClickEvent(init.todoTaskItem, init.classToggle);
    delegateClickEvent(init.todoDetail, init.classToggle);
})();

function todoCount(arr, type){
    var count = 0;
    switch (arr){
        case "data.tasks":
            each(data.tasks, function(item){
                if(!item.isDone){
                    count++;
                }
            });
            return count;
            break;

        case "data.lists":
            each(data.tasks, function(item){
                if(!item.isDone && item.cateList[1] === type){
                    count++;
                }
            });
            return count;
            break;

        case "data.cates":
            each(data.tasks, function(item){
                if(!item.isDone && item.cateList[0] === type){
                    count++;
                }
            });
            return count;
            break;
    }
}

function addCate(obj){
    if(obj.category){
        var liCate = $("[data-cate-id=" + obj.category + "]");
        if(!liCate){
            liCate = document.createElement("li");
            liCate.setAttribute("data-cate-id", obj.category);
            var spanCateDefault = document.createElement("span");
            if(obj.category === "默认分类"){
                spanCateDefault.innerHTML = "<i class='fa fa-folder-open fa-fw'></i>"
                                            + obj.category
                                            + "("
                                            + todoCount("data.cates", obj.category)
                                            + ")";
            }
            else{
                spanCateDefault.innerHTML = "<i class='fa fa-folder-open fa-fw'></i>"
                                            + obj.category
                                            + "("
                                            + todoCount("data.cates", obj.category)
                                            + ")";
                var removeSpan = document.createElement("span");
                addClass(removeSpan, "remove-cate");
                var removeItem = document.createElement("i");
                addClass(removeItem, "fa fa-trash-o");
                removeSpan.appendChild(removeItem);
                spanCateDefault.appendChild(removeSpan);
                init.removeIcon.push(removeItem);
            }
            liCate.appendChild(spanCateDefault);
            init.todoCateList.appendChild(liCate);
        }
        delegateClickEvent(init.removeIcon, removeClick);
    }
}

function addList(obj){
    var liCate = $("[data-cate-id=" + obj[0] + "]");
    if (obj[1]){
        if(!(liCate.getElementsByTagName("ul")[0])){
            var ulTask = document.createElement("ul");
            addClass(ulTask, "todo-task-list");
            liCate.appendChild(ulTask);
        }
        if(liCate.getElementsByTagName("ul")[0]){
            ulTask = liCate.getElementsByTagName("ul")[0]
            if(ulTask.hasAttribute("class", "todo-task-list")){
                var liList = $("[data-list-id=" + obj[1] + "]");
                if(!liList || liList.nodeName !== "LI"){
                    var liTaskList = document.createElement("li");
                    liTaskList.setAttribute("data-list-id", obj[1]);
                    if(obj[1] === "使用说明"){
                        liTaskList.innerHTML = "<i class='fa fa-file-o fa-fw'></i>"
                                                + obj[1]
                                                + "("
                                                + todoCount("data.lists", obj[1])
                                                + ")"
                    }
                    else{
                        liTaskList.innerHTML = "<i class='fa fa-file-o fa-fw'></i>"
                            + obj[1]
                            + "("
                            + todoCount("data.lists", obj[1])
                            + ")";
                        var removeSpan = document.createElement("span");
                        addClass(removeSpan, "remove-list");
                        var removeItem = document.createElement("i");
                        addClass(removeItem, "fa fa-trash-o");
                        removeSpan.appendChild(removeItem);
                        liTaskList.appendChild(removeSpan);
                        init.removeIcon.push(removeItem);
                    }
                    ulTask.appendChild(liTaskList);
                    init.todoTaskItem.push(liTaskList);
                }
            }

        }
        delegateClickEvent(init.todoTaskItem, init.classToggle);
        delegateClickEvent(init.todoTaskItem, taskItemClick);
        delegateClickEvent(init.removeIcon, removeClick);
    }
}

function removeClick(e){
    e = e || window.event;
    var target = e.target || e.srcElement;
    if(target.parentNode.nodeName == "SPAN"){
        var removeSpanClass = target.parentNode.getAttribute("class");
        switch (removeSpanClass){
            case "remove-list":
                removeList(target.parentNode);
                break;

            case "remove-cate":
                removeCate(target.parentNode);
                break;
        }
    }
}

function updateData(){
    setData("cates", data.cates);
    setData("lists", data.lists);
    setData("tasks", data.tasks);
}

function removeCate(item){
    if(item.parentNode.parentNode.nodeName === "LI"){
        var liCate = item.parentNode.parentNode.getAttribute("data-cate-id");
        if(confirm("是否删除主分类" + liCate)){
            var removeItem = [];
            each(data.cates, function(item){
                if(item.category === liCate){
                    removeItem.push(item);
                }
            });

            each(removeItem, function(item) {
                data.cates.remove(item);
            });

            removeItem.length = 0;
            each(data.lists, function(item, i){
                if(item[0] === liCate){
                    removeItem.push(item);
                }
            });

            each(removeItem, function(item){
                data.lists.remove(item);
            });

            removeItem.length = 0;
            each(data.tasks, function(item, i){
                if(item.cateList[0] === liCate){
                    removeItem.push(item);
                }
            });

            each(removeItem, function(item){
                data.tasks.remove(item);
            });

            updateData();
            listCates(data.cates);
            listLists(data.lists);
        }
    }
}

function removeList(item){
    if(item.parentNode.nodeName === "LI" && hasClass(item.parentNode, "todo-task-selected")){
        var liList = item.parentNode.getAttribute("data-list-id");
        if(confirm("是否删除列表" + liList)){
            var removeItem = [];
            each(data.lists, function(item, i){
                if(item[1] === liList){
                    removeItem.push(item);
                }
            });
            each(removeItem, function(item){
                data.lists.remove(item);
            });

            removeItem.length = 0;
            each(data.tasks, function(item, i){
                if(item.cateList[1] === liList){
                    removeItem.push(item);
                }
            });
            each(removeItem, function(item){
                data.tasks.remove(item);
            });

            updateData();
            listCates(data.cates);
            listLists(data.lists);
        }
    }
    else{
        alert("选中列表后才能删除");
    }
}

function listCates(arr){
    init.todoCateList.innerHTML = "";
    initSelect();

    each(arr, function(item){
        addCate(item);
        addCateOption(item.category);
    });

    delegateClickEvent(init.removeIcon, removeClick);
    listInventory(data.tasks, "all", "all");
    delegateClickEvent(init.todoTaskItem, taskItemClick);
    init.todoTotal.innerHTML = "(" + todoCount("data.tasks", "all") + ")";
    addContent(data.tasks[0]);
}

function listLists(arr){
    each(init.todoTaskList, function(item){
        item.innerHTML = "";
    });
    each(arr, function(item){
        addList(item);
    })

    delegateClickEvent(init.removeIcon, removeClick);
    listInventory(data.tasks, "all", "all");
    delegateClickEvent(init.todoTaskItem, taskItemClick);
    delegateClickEvent(init.todoTaskItem, init.classToggle);
    init.todoTotal.innerHTML = "(" + todoCount("data.tasks", "all") + ")";
    addContent(data.tasks[0]);

}


addClickEvent(init.todoCateBtn, function(){
    addCatePanel("block");
    if(init.addCateCheck){
        addClickEvent(init.addCateCheck, function(){
            var mainCateName = init.addCateSelect.value;
            var newCateName = init.addCateName.value;
            addCateCheck(mainCateName, newCateName);
        });

        if(init.addCateCancel){
            addClickEvent(init.addCateCancel, function(){
                init.addCateName.value = "";
                addCatePanel("none");
            });
        }
    }
});

each(data.cates, function(item){
    addCateOption(item.category);
});

function addCateOption(cate){
    var cateOption = document.createElement("option");
    cateOption.setAttribute("value", cate);
    cateOption.innerHTML = cate;
    init.addCateSelect.appendChild(cateOption);
}

function addCateCheck(main, name){
    if (getByteVal(name, 20)) {
        var cateName = getByteVal(name, 20);

        if (main === "null") {
            if (confirm("确认创建新分类【" + cateName + "】吗？")) {
                data.cates.push(new Category(cateName));
                updateData();
                listCates(data.cates);
                listLists(data.lists);
            }
        }
        else {
            if(confirm("确认在【" + main + "】分类下创建新列表【" + cateName + "】吗？")) {
                data.lists.push(new TaskList(main, cateName));
                updateData();
                listCates(data.cates);
                listLists(data.lists);
            }
        }

        init.addCateName.value = "";
        addCatePanel("none");
    }
}

addClickEvent(init.todoCateAll, function(){
    each(init.todoTaskItem, function(item){
        removeClass(item, "todo-task-selected");
    });

    listInventory(data.tasks, "all", "all");
})

delegateClickEvent(init.todoTaskItem, taskItemClick);
function taskItemClick(e){
    e = e || window.event;
    var target = e.target || e.srcElement;
    if (target.nodeName === "LI") {
        var listId = target.getAttribute("data-list-id");
        listInventory(data.tasks, listId, "all");
    }
}

function addInventory(obj){
    if (obj.cateList){

        if (obj.time){
            var dtTimeStr = new Date(obj.time) - 0;
            var dtTime = $("[data-list-time=" + dtTimeStr + "]");
            if (dtTime){
                addTitle(obj);
            }
            if (!dtTime){
                var dtTaskTime = document.createElement("dt");
                dtTaskTime.setAttribute("data-list-time", dtTimeStr);
                dtTaskTime.innerHTML = "<time>" + formatTime(obj) + "</time>";
                init.taskInventory.appendChild(dtTaskTime);
                addTitle(obj);
            }
        }

        function addTitle(obj){
            if (obj.title){
                var ddTaskTitle = document.createElement("dd");
                if (obj.isDone) {
                    ddTaskTitle.setAttribute("data-task-done", "1");
                    ddTaskTitle.innerHTML = obj.title + '<i class="fa fa-smile-o"></i>';
                }
                else{
                    ddTaskTitle.setAttribute("data-task-done", "0");
                    ddTaskTitle.innerHTML = obj.title;
                }
                ddTaskTitle.setAttribute("data-list-id", obj.cateList[1]);
                ddTaskTitle.setAttribute("data-task-id", obj.id);
                init.taskInventory.appendChild(ddTaskTitle);

                init.todoDetail = $("dd");
            }
        }

        delegateClickEvent(init.todoDetail, init.classToggle);
    }
}

addClickEvent(init.todoAddTask, function(){

    var taskSelected = $(".todo-task-selected")[0];
    var cateList = [];
    if (taskSelected && taskSelected.nodeName === "LI") {
        var dataListId = taskSelected.getAttribute("data-list-id");

        if (dataListId === "使用说明") {
            alert("使用说明】不能新建子任务");
        }
        else {
            each(data.lists, function(item){
                if (item[1] === dataListId) {
                    if (confirm("将在【" + item[0] + "】分类下的【" + dataListId + "】列表新增任务")) {

                        editIcon("edit");
                        delegateEleEvent(init.todoDefault, function(ele){
                            ele.style.display = "none";
                        });
                        delegateEleEvent(init.todoEdit, function(ele){
                            ele.style.display = "inline-block";
                            ele.value = "";
                        });
                    }
                    cateList = [item[0], dataListId];
                }
            });
        }

        init.todoCheckEle.onclick = function(){
            if (checkTask(init.todoEdit[0], init.todoEdit[1], init.todoEdit[2])) {
                if (confirm("确认新建" + init.todoEdit[0].value + "吗？")) {

                    var newTask = checkTask(init.todoEdit[0], init.todoEdit[1], init.todoEdit[2]);

                    data.tasks.push(new TaskDetail(cateList, newTask[0], newTask[1], newTask[2], false));

                    each(data.tasks,function(item, i){
                        item.id = i;
                    });

                    updateData();

                    init.todoTotal.innerHTML = "(" + todoCount("data.tasks", "all") + ")";

                    listCates(data.cates);

                    listLists(data.lists);

                    listInventory(data.tasks,dataListId,"all");

                    editIcon("check");
                    delegateEleEvent(init.todoDefault, function(ele){
                        ele.style.display = "inline";
                        init.todoDefault[init.todoDefault.length - 1].style.display = "block";
                        each(data.tasks, function(item){
                            if (item.id === data.tasks.length - 1) {
                                addContent(item);
                            }
                        });
                    });
                    delegateEleEvent(init.todoEdit, function(ele){
                        ele.style.display = "none";
                    });
                }
            }
        };
    }
    else {
        alert("【新增任务】需要选中【目标分类】");
    }
});

function listInventory(arr,list,isDone){

    init.taskInventory.innerHTML = "";

    arr.sort(compare("time"));

    switch (typeof isDone) {
        case "string":
            if (list === "all") {
                each(arr,function(item){
                    addInventory(item);
                });
            }
            else{
                each(arr,function(item){
                    if (item.cateList[1] === list) {
                        addInventory(item);
                    }
                })
            }
            break;
        case "boolean":
            if (isDone) {
                if (list === "all") {
                    each(arr,function(item){
                        if (item.isDone) {
                            addInventory(item);
                        }
                    });
                }
                else{
                    each(arr,function(item){
                        if (item.isDone && item.cateList[1] === list) {
                            addInventory(item);
                        }
                    });
                }
            }
            else{
                if (list === "all") {
                    each(arr,function(item){
                        if (!item.isDone) {
                            addInventory(item);
                        }
                    });
                }
                else {
                    each(arr,function(item){
                        if (!item.isDone && item.cateList[1] === list) {
                            addInventory(item);
                        }
                    });
                }
            }
            break;
    }

    init.todoDetail = $("dd");
    delegateClickEvent(init.todoDetail,showTaskDetail);
}

function showTaskDetail(e){
    e = e ||window.event;
    var target = e.target || e.srcElement;
    var taskId = target.getAttribute("data-task-id");
    each(data.tasks,function(item){
        if (item.id == taskId) {
            addContent(item);
        }
    });
}

delegateClickEvent(init.todoInventory, function(e){
    e = e || window.event;
    var target = e.target || e.srcElement;
    var listSelected = $(".todo-task-selected")[0];
    if (listSelected) {
        var listId = listSelected.getAttribute("data-list-id");
    }
    else {
        listId = "all";
    }
    switch (target.getAttribute("id")) {
        case "todo-all":
            listInventory(data.tasks,listId,"all");
            break;
        case "todo-doing":
            listInventory(data.tasks,listId,false);
            break;
        case "todo-done":
            listInventory(data.tasks,listId,true);
            break;
    }
});

function addContent(obj){
    if(obj){
        init.todoDefault[1].innerHTML = formatTime(obj);
        init.todoDefault[0].setAttribute("data-task-id",obj.id);
        init.todoDefault[0].innerHTML = obj.title;
        init.todoDefault[2].innerHTML = obj.content;
    }
}

addClickEvent(init.todoCheckIcon,function(){
    var taskId = init.todoDefault[0].getAttribute("data-task-id");

    for (var i = 0; i < data.tasks.length; i++) {
        if (data.tasks[i].id == taskId) {
            if (data.tasks[i].isDone) {
                alert("该任务已经完成");
            }
            else {
                if (confirm("任务完成后不能修改")) {
                    data.tasks[i].isDone = true;
                    updateData();
                    listInventory(data.tasks,data.tasks[i].cateList[1],"all");
                    init.todoTotal.innerHTML = "(" + todoCount("data.tasks","all") + ")";
                    listCates(data.cates);
                    listLists(data.lists);
                    delegateInitClass(init.todoAllBtn,"todo-inventory-selected");
                }
            }
        }
    }
});

addClickEvent(init.todoEditIcon,function(){
    var taskId = init.todoDefault[0].getAttribute("data-task-id");
    if (isTaskDefault(taskId)) {
        var itemTask = isTaskDefault(taskId);
        if (itemTask.isDone) {
            alert("该任务已完成，不能编辑");
        }
        else {
            if (confirm("确认编辑"+itemTask.title+"任务吗？")) {
                editIcon("edit");
                delegateEleEvent(init.todoDefault,function(ele){
                    ele.style.display = "none";
                });
                delegateEleEvent(init.todoEdit,function(ele){
                    ele.style.display = "inline-block";
                    for (var i = 0; i < init.todoEdit.length; i++) {
                        init.todoEdit[i].value = init.todoDefault[i].innerHTML;
                    }
                });
            }
        }

        init.todoCheckEle.onclick = function(){
            if (checkTask(init.todoEdit[0],init.todoEdit[1],init.todoEdit[2])) {
                if (confirm("任务编辑完成，确认提交吗？")) {
                    var editTask = checkTask(init.todoEdit[0],init.todoEdit[1],init.todoEdit[2]);
                    itemTask.title = editTask[0];
                    itemTask.time = editTask[1];
                    itemTask.content = editTask[2];
                    updateData();
                    listInventory(data.tasks,itemTask.cateList[1],"all");
                    init.todoTotal.innerHTML = "(" + todoCount("data.tasks","all") + ")";
                    listCates(data.cates);
                    listLists(data.lists);
                    editIcon("check");
                    delegateEleEvent(init.todoDefault,function(ele){
                        ele.style.display = "inline";
                        init.todoDefault[init.todoDefault.length-1].style.display = "block";
                        addContent(itemTask);
                    });
                    delegateEleEvent(init.todoEdit,function(ele){
                        ele.style.display = "none";
                    });
                }
            }
        };
    }
});

function isTaskDefault(i){
    var taskItem = "";
    if (i==0) {
        alert("使用说明不能修改");
        return false;
    }
    else {
        each(data.tasks,function(item){
            if (item.id == i) {
                taskItem = item;
            }
        });
        return taskItem;
    }
}

addClickEvent(init.todoUndoEle,reback);

function reback(){
    if (confirm("取消任务编辑吗？")) {
        var taskId = init.todoDefault[0].getAttribute("data-task-id");
        editIcon("check");
        delegateEleEvent(init.todoDefault,function(ele){
            ele.style.display = "inline";
            init.todoDefault[init.todoDefault.length-1].style.display = "block";
            each(data.tasks,function(item){
                if (item.id == taskId) {
                    addContent(item);
                }
            });
        });
        delegateEleEvent(init.todoEdit,function(ele){
            ele.style.display = "none";
        });
    }
}

function formatTime(obj) {
    var taskTime = new Date(obj.time);
    if (taskTime) {
        var year = taskTime.getFullYear();
        var month = taskTime.getMonth() + 1;
        var date = taskTime.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (date < 10) {
            date = "0" + date;
        }
        return [year, month, date].join("-");
    }
}

function addCatePanel(display){
    var addCatePanel = $(".add-cate-panel")[0];
    if (addCatePanel) {
        var cWidth = document.documentElement.clientWidth || document.body.clientWidth;
        var cHeight = document.documentElement.clientHeight || document.body.clientHeight;
        var oWidth = addCatePanel.offsetWidth;
        var oHeight = addCatePanel.offsetHeight;
        addCatePanel.style.position = "absolute";
        addCatePanel.style.left = Math.round((cWidth - oWidth) / 3.2) + "px";
        addCatePanel.style.top = Math.round((cHeight - oHeight) / 3.2) + "px";
        addCatePanel.style.display = display;
    }
}

function compare(properyName){
    return function(obj1,obj2) {
        var val1 = obj1[properyName];
        var val2 = obj2[properyName];
        if (val1 < val2) {
            return -1;
        }
        else if (val1 > val2) {
            return 1;
        }
        else {
            return 0;
        }
    }
}

function checkTask(title,time,content){
    var timeRex = /^(\d{4})\-(\d{2})\-(\d{2})$/;
    if(title.value == ""
        || time.value == ""
        || content.value == ""
    ) {
        alert("请仔细检查任务，查看是否填写完整");
        return false;
    }
    if (getByteVal(title.value,20)) {
        var taskTitle = getByteVal(title.value,20);
    }
    else {
        return false;
    }
    if (timeRex.test(time.value)
        && checkTime(time.value)
    ) {
        var taskTime = checkTime(time.value);
    }
    else {
        return false;
    }

    return [taskTitle, taskTime, content.value];
}

function checkTime(time){
    var dates = time.split("-");
    var year = parseInt(dates[0]);
    var month = parseInt(dates[1] - 1);
    var day = parseInt(dates[2]);
    var curDate = new Date();
    var taskDate = new Date(year,month,day);
    if (curDate > taskDate) {
        alert("任务完成日期太超前");
        return false;
    }
    else {
        return taskDate;
    }
}

function editIcon(status){
    switch (status) {
        case "edit":
            init.todoEditIcon.style.display = "none";
            init.todoCheckIcon.style.display = "none";
            init.todoUndoEle.style.display = "block";
            init.todoCheckEle.style.display = "block";
            break;
        case "check":
            init.todoEditIcon.style.display = "block";
            init.todoCheckIcon.style.display = "block";
            init.todoUndoEle.style.display = "none";
            init.todoCheckEle.style.display = "none";
            break;
    }
}

function getByteVal(val, max){
    var returnValue = '';
    var byteValLen = 0;
    for (var i = 0; i < val.length; i++) {
        if (val[i].match(/[^\x00-\xff]/ig) != null) {
            byteValLen += 2;
        }
        else{
            byteValLen += 1;
        }
        if (byteValLen > max) {
            alert("名称不能超过十位汉字！");
            init.addCateName.value = "";
            return false;
        }
        if (byteValLen == 0) {
            alert("名称不能为空！");
            init.addCateName.value = "";
            return false;
        }
        returnValue += val[i];
    }
    return returnValue;
}

function initSelect(){
    init.addCateSelect.innerHTML = "";
    var defaultOption = document.createElement("option");
    defaultOption.setAttribute("value","null");
    defaultOption.innerHTML = "新增主分类";
    init.addCateSelect.appendChild(defaultOption);
}
