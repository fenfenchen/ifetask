
var init = {
    CateList: $(".category-list")[0],  //分类列表
    taskInventory: $(".inventory-detail")[0],   //目录列表
    Detail: $("dd"), //说明详情

    Default: (function(){  //默认说明
        var taskTitle = $("#default-title");
        var taskTime = $("#default-time");
        var taskContent = $("#default-content");

        return [taskTitle, taskTime, taskContent];
    })(),

    Edit: (function(){  //编辑说明
        var taskTitle = $("#task-title");
        var taskTime = $("#task-time");
        var taskContent = $("#task-content");
        taskTitle.style.display = "none";
        taskTime.style.display = "none";
        taskContent.style.display = "none";

        return [taskTitle, taskTime, taskContent];
    })(),

    SpecEdit: $(".spec-edit")[0],  //编辑说明
    EditIcon: $(".fa-pencil-square-o")[0], //说明显示时，编辑按钮
    CheckIcon: $(".fa-check-square-o")[0], //说明显示时，完成按钮
    UndoEle: $(".fa-undo")[0],  //说明编辑时，撤销按钮
    CheckEle: $(".fa-check")[0],  //说明编辑时，确认按钮
    AddTask: $("#add-task"),
    Total: $("#total-count"),

    Inventory: $(".inventory-category")[0].children,
    CateBtn: $("#add-category"),
    CateAll: $(".category-total")[0],
    AllBtn: $("#all"),

    addCateSelect: $("#add-cate-main"),
    addCateName: $("#add-cate-name"),
    addCateCancel: $("#add-cate-cancel"),
    addCateCheck: $("#add-cate-check"),

    TaskItem: (function(){
        var TaskList = $(".task-list");
        var Item = [];
        for(var j = 0, len = TaskList.length; j < len; j++){
            var TaskItem = TaskList[j].getElementsByTagName("li");
            each(TaskItem, function(item){
                Item.push(item);
            });
        }

        return Item;
    })(),

    removeIcon: (function(){
        var removeListIcon = $(".fa-trash-o");
        var removeItem = [];
        each(removeListIcon, function(item){
            removeItem.push(item);
        });
        return removeItem;
    })(),

    TaskList: $(".task-list"),

    classToggle: function(e){  //选中状态切换
        e = e || window.event;
        var target = e.target || e.srcElement;
        stopBubble(e); //阻止事件冒泡，操作只与当前项有关。
        var classname = "";
        if(target.parentNode){
            switch (target.parentNode.className){
                case "inventory-detail":
                    classname = "detail-selected";
                    break;
                case "inventory-category":
                    classname = "inventory-selected";
                    break;
                case "task-list":  //task-list含有多个ul，而其他二个只有一个ul，不需要判断其他列表。
                    classname = "task-selected";
                    for(var j = 0, len = init.TaskItem.length; j < len; j++){
                        removeClass(init.TaskItem[j], classname);
                    }
                    break;
            }
            delegateInitClass(target, classname);  //将所有同辈元素selected类去掉，并为自己添加selected
        }
    }
};

(function(){
    each(data.cates, addCate);
    each(data.lists, addList);
    addInventory(data.tasks[0]);  //添加说明目录
    addContent(data.tasks[0]);  //添加说明内容

    var listFirst = $(".task-list")[0].getElementsByTagName("li")[0];
    if(listFirst){
        addClass(listFirst, "task-selected");
    }

    var titleFirst = $("dd")[0];
    if(titleFirst){
        addClass(titleFirst, "detail-selected");
    }

    init.Total.innerHTML = "(" + Count("data.tasks", "all") + ")";

    delegateClickEvent(init.Inventory, init.classToggle);
    delegateClickEvent(init.TaskItem, init.classToggle);
    delegateClickEvent(init.Detail, init.classToggle);
})();

//计算所有任务，某子分类任务数量，某主分类任务数量
function Count(arr, type){
    var count = 0;
    switch (arr){
        case "data.tasks":  //所有任务数量
            each(data.tasks, function(item){
                if(!item.isDone){
                    count++;
                }
            });
            return count;
            break;
        case "data.lists":  //子分类下任务数量
            each(data.tasks, function(item){
                if(!item.isDone && item.cateList[1] === type){
                    count++;
                }
            });
            return count;
            break;
        case "data.cates":  //主分类下任务数量
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

            spanCateDefault.innerHTML = "<i class='fa fa-folder-open fa-fw'></i>"
                                        + obj.category
                                        + "("
                                        + Count("data.cates", obj.category)
                                        + ")";
            var removeSpan = document.createElement("span");
            addClass(removeSpan, "remove-cate");
            var removeItem = document.createElement("i");
            addClass(removeItem, "fa fa-trash-o");
            removeSpan.appendChild(removeItem);
            spanCateDefault.appendChild(removeSpan);
            init.removeIcon.push(removeItem);

            liCate.appendChild(spanCateDefault);
            init.CateList.appendChild(liCate);
        }
        delegateClickEvent(init.removeIcon, removeClick);
    }
}

function addList(obj){
    var liCate = $("[data-cate-id=" + obj[0] + "]");
    if (obj[1]){
        if(!(liCate.getElementsByTagName("ul")[0])){
            var ulTask = document.createElement("ul");
            addClass(ulTask, "task-list");
            liCate.appendChild(ulTask);
        }
        if(liCate.getElementsByTagName("ul")[0]){
            ulTask = liCate.getElementsByTagName("ul")[0]
            if(ulTask.hasAttribute("class", "task-list")){
                var liList = $("[data-list-id=" + obj[1] + "]");
                if(!liList || liList.nodeName !== "LI"){
                    var liTaskList = document.createElement("li");
                    liTaskList.setAttribute("data-list-id", obj[1]);
                    liTaskList.innerHTML = "<i class='fa fa-file-o fa-fw'></i>"
                                            + obj[1]
                                            + "("
                                            + Count("data.lists", obj[1])
                                            + ")";
                    var removeSpan = document.createElement("span");
                    addClass(removeSpan, "remove-list");
                    var removeItem = document.createElement("i");
                    addClass(removeItem, "fa fa-trash-o");
                    removeSpan.appendChild(removeItem);
                    liTaskList.appendChild(removeSpan);
                    init.removeIcon.push(removeItem);

                    ulTask.appendChild(liTaskList);
                    init.TaskItem.push(liTaskList);
                }
            }

        }
        delegateClickEvent(init.TaskItem, init.classToggle);
        delegateClickEvent(init.TaskItem, taskItemClick);
        delegateClickEvent(init.removeIcon, removeClick);
    }
}

//删除按钮点击绑定分类及子分类删除事件
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

//删除主分类
function removeCate(item){
    if(item.parentNode.parentNode.nodeName === "LI"){  //item=remove-cate
        var liCate = item.parentNode.parentNode.getAttribute("data-cate-id");
        if(confirm("是否删除主分类" + liCate)){
            var removeItem = [];
            //查找主分类中目标项
            each(data.cates, function(item){
                if(item.category === liCate){
                    removeItem.push(item);
                }
            });
            //删除数据中目标项
            each(removeItem, function(item) {
                data.cates.remove(item);
            });

            removeItem.length = 0;
            //查找并移除目标项下的子分类
            each(data.lists, function(item, i){
                if(item[0] === liCate){
                    removeItem.push(item);
                }
            });
            each(removeItem, function(item){
                data.lists.remove(item);
            });
            //查找并移除目标项下的任务
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

//选中并删除子分类
function removeList(item){
    if(item.parentNode.nodeName === "LI" && hasClass(item.parentNode, "task-selected")){
        var liList = item.parentNode.getAttribute("data-list-id");
        if(confirm("是否删除列表" + liList)){
            var removeItem = [];
            //查找并移除目标项
            each(data.lists, function(item, i){
                if(item[1] === liList){
                    removeItem.push(item);
                }
            });
            each(removeItem, function(item){
                data.lists.remove(item);
            });
            //查找并移除目标项下的任务
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

//刷新主分类列表
function listCates(arr){
    init.CateList.innerHTML = "";
    initSelect();

    each(arr, function(item){
        addCate(item);
        addCateOption(item.category);
    });

    delegateClickEvent(init.removeIcon, removeClick);
    listInventory(data.tasks, "all", "all");
    delegateClickEvent(init.TaskItem, taskItemClick);
    init.Total.innerHTML = "(" + Count("data.tasks", "all") + ")";
    addContent(data.tasks[0]);
}

//刷新子分类列表
function listLists(arr){
    //每个主分类下都有一个tasklist
    each(init.TaskList, function(item){
        item.innerHTML = "";
    });
    each(arr, function(item){
        addList(item);
    })

    delegateClickEvent(init.removeIcon, removeClick);
    listInventory(data.tasks, "all", "all");
    delegateClickEvent(init.TaskItem, taskItemClick);
    delegateClickEvent(init.TaskItem, init.classToggle);
    init.Total.innerHTML = "(" + Count("data.tasks", "all") + ")";
    addContent(data.tasks[0]);
}

addClickEvent(init.CateBtn, function(){
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

//确认并添加主分类或子分类
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

//取消选中的子分类，并显示所有的任务
addClickEvent(init.CateAll, function(){
    each(init.TaskItem, function(item){
        removeClass(item, "task-selected");
    });

    listInventory(data.tasks, "all", "all");
})

//子分类选中后列出该分类下所有任务
delegateClickEvent(init.TaskItem, taskItemClick);

function taskItemClick(e){
    e = e || window.event;
    var target = e.target || e.srcElement;
    if (target.nodeName === "LI") {
        var listId = target.getAttribute("data-list-id");
        listInventory(data.tasks, listId, "all");
    }
}

//添加任务目录，显示事件、标题
function addInventory(obj){
    if (obj.cateList){
        if (obj.time){
            var dtTimeStr = new Date(obj.time) - 0;
            var dtTime = $("[data-list-time=" + dtTimeStr + "]");
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

                init.Detail = $("dd");
            }
        }
        delegateClickEvent(init.Detail, init.classToggle);
    }
}

//在选中子分类下创建任务
addClickEvent(init.AddTask, function(){
    var taskSelected = $(".task-selected")[0];
    var cateList = [];
    if (taskSelected && taskSelected.nodeName === "LI") {
        var dataListId = taskSelected.getAttribute("data-list-id");
        each(data.lists, function(item){
            if (item[1] === dataListId) {
                if (confirm("将在【" + item[0] + "】分类下的【" + dataListId + "】列表新增任务")) {
                    editIcon("edit");
                    delegateEleEvent(init.Default, function(ele){
                        ele.style.display = "none";
                    });
                    delegateEleEvent(init.Edit, function(ele){
                        ele.style.display = "inline-block";
                        ele.value = "";
                    });
                }
                cateList = [item[0], dataListId];
            }
        });

        init.CheckEle.onclick = function(){
            if (checkTask(init.Edit[0], init.Edit[1], init.Edit[2])) {
                if (confirm("确认新建" + init.Edit[0].value + "吗？")) {
                    var newTask = checkTask(init.Edit[0], init.Edit[1], init.Edit[2]);
                    data.tasks.push(new TaskDetail(cateList, newTask[0], newTask[1], newTask[2], false));
                    each(data.tasks,function(item, i){
                        item.id = i;
                    });

                    updateData();
                    init.Total.innerHTML = "(" + Count("data.tasks", "all") + ")";
                    listCates(data.cates);
                    listLists(data.lists);
                    listInventory(data.tasks,dataListId,"all");
                    editIcon("check");
                    delegateEleEvent(init.Default, function(ele){
                        ele.style.display = "inline";
                        init.Default[init.Default.length - 1].style.display = "block";
                        each(data.tasks, function(item){
                            if (item.id === data.tasks.length - 1) {
                                addContent(item);
                            }
                        });
                    });
                    delegateEleEvent(init.Edit, function(ele){
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

//排序显示任务目录，任务数量有所有任务及子分类任务，任务类型按所有、未完成、已完成分。
function listInventory(arr,list,isDone){
    init.taskInventory.innerHTML = ""; //inventory-deatil
    arr.sort(compare("time"));

    switch (typeof isDone) { //all,true和false
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
    init.Detail = $("dd");
    delegateClickEvent(init.Detail,showTaskDetail);
}

//显示任务对应的内容
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

//all,doing,done点击显示
delegateClickEvent(init.Inventory, function(e){
    e = e || window.event;
    var target = e.target || e.srcElement;
    var listSelected = $(".task-selected")[0];
    if (listSelected) {
        var listId = listSelected.getAttribute("data-list-id");
    }
    else {
        listId = "all";
    }
    switch (target.getAttribute("id")) {
        case "all":
            listInventory(data.tasks,listId,"all");
            break;
        case "doing":
            listInventory(data.tasks,listId,false);
            break;
        case "done":
            listInventory(data.tasks,listId,true);
            break;
    }
});

//设置任务显示内容
function addContent(obj){
    if(obj){
        init.Default[1].innerHTML = formatTime(obj);
        init.Default[0].setAttribute("data-task-id",obj.id);
        init.Default[0].innerHTML = obj.title;
        init.Default[2].innerHTML = obj.content;
    }
}

//点击完成按钮，完成任务
addClickEvent(init.CheckIcon,function(){
    var taskId = init.Default[0].getAttribute("data-task-id");

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
                    init.Total.innerHTML = "(" + Count("data.tasks","all") + ")";
                    listCates(data.cates);
                    listLists(data.lists);
                    delegateInitClass(init.AllBtn,"inventory-selected");
                }
            }
        }
    }
});

//点击编辑按钮，编辑内容，并提交内容
addClickEvent(init.EditIcon,function(){
    var taskId = init.Default[0].getAttribute("data-task-id");
    if (isTaskDefault(taskId)) {
        var itemTask = isTaskDefault(taskId);
        if (itemTask.isDone) {
            alert("该任务已完成，不能编辑");
        }
        else {
            if (confirm("确认编辑"+itemTask.title+"任务吗？")) {
                editIcon("edit");
                delegateEleEvent(init.Default,function(ele){
                    ele.style.display = "none";
                });
                delegateEleEvent(init.Edit,function(ele){
                    ele.style.display = "inline-block";
                    for (var i = 0; i < init.Edit.length; i++) {
                        init.Edit[i].value = init.Default[i].innerHTML;
                    }
                });
            }
        }

        init.CheckEle.onclick = function(){
            if (checkTask(init.Edit[0],init.Edit[1],init.Edit[2])) {
                if (confirm("任务编辑完成，确认提交吗？")) {
                    var editTask = checkTask(init.Edit[0],init.Edit[1],init.Edit[2]);
                    itemTask.title = editTask[0];
                    itemTask.time = editTask[1];
                    itemTask.content = editTask[2];
                    updateData();
                    listInventory(data.tasks,itemTask.cateList[1],"all");
                    init.Total.innerHTML = "(" + Count("data.tasks","all") + ")";
                    listCates(data.cates);
                    listLists(data.lists);
                    editIcon("check");
                    delegateEleEvent(init.Default,function(ele){
                        ele.style.display = "inline";
                        init.Default[init.Default.length-1].style.display = "block";
                        addContent(itemTask);
                    });
                    delegateEleEvent(init.Edit,function(ele){
                        ele.style.display = "none";
                    });
                }
            }
        };
    }
});

//通过id获取任务项
function isTaskDefault(i){
    var taskItem = "";
    each(data.tasks,function(item){
        if (item.id == i) {
            taskItem = item;
        }
    });
    return taskItem;
}

//点击按钮，撤销编辑
addClickEvent(init.UndoEle,reback);

//撤销编辑操作
function reback(){
    if (confirm("取消任务编辑吗？")) {
        var taskId = init.Default[0].getAttribute("data-task-id");
        editIcon("check");
        delegateEleEvent(init.Default,function(ele){
            ele.style.display = "inline";
            init.Default[init.Default.length-1].style.display = "block";
            each(data.tasks,function(item){
                if (item.id == taskId) {
                    addContent(item);
                }
            });
        });
        delegateEleEvent(init.Edit,function(ele){
            ele.style.display = "none";
        });
    }
}

//日期按如2016-02-01格式
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

//添加分类对话框样式设置
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

//检查任务日期，不允许比当前日期早
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

//设置按钮显示，edit显示撤销和确认按钮，check显示编辑和完成按钮
function editIcon(status){
    switch (status) {
        case "edit":
            init.EditIcon.style.display = "none";
            init.CheckIcon.style.display = "none";
            init.UndoEle.style.display = "block";
            init.CheckEle.style.display = "block";
            break;
        case "check":
            init.EditIcon.style.display = "block";
            init.CheckIcon.style.display = "block";
            init.UndoEle.style.display = "none";
            init.CheckEle.style.display = "none";
            break;
    }
}

//输入长度判断，并返回该项
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

//初始化添加分类框，主分类下拉列表
function initSelect(){
    init.addCateSelect.innerHTML = "";
    var defaultOption = document.createElement("option");
    defaultOption.setAttribute("value","null");
    defaultOption.innerHTML = "新增主分类";
    init.addCateSelect.appendChild(defaultOption);
}

