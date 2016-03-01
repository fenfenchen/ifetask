
var Category = function(category) {
    this.category = category;

    return {category: this.category};
}

Category.prototype = {category: "默认分类"};

var TaskList = function(category, taskList) {
    this.category = category;
    this.taskList = taskList;

    return [this.category, this.taskList];
}

TaskList.prototype = ["默认分类", "使用说明"];

var TaskDetail = function(taskList, title, time, content, isDone) {

    this.id = 0;
    this.taskList = taskList;
    this.title = title;
    this.time = time;
    this.content = content;
    this.isDone = isDone;

    return {
        id: this.id,
        cateList: this.taskList,
        title: this.title,
        time: this.time,
        content: this.content,
        isDone: this.isDone
    };
}

TaskDetail.prototype = {
    id:0,
    cateList: ["默认分类", "使用说明"],
    title: "默认标题",
    time: new Date(2016,1,1),
    content: "默认内容",
    isDone: true
};

var defaultCate = Category.prototype;
var defaultList = TaskList.prototype;
var defaultDetail = TaskDetail.prototype;

var cate1 = new Category("分类");

var list1 = new TaskList("分类", "task0001");
var list2 = new TaskList("分类", "task0002");
var list3 = new TaskList("分类", "task0003");

var detail1 = new TaskDetail(["分类", "task0001"], "todo1", new Date(2016,1,2), "task0001", true);
var detail2 = new TaskDetail(["分类", "task0002"], "todo2", new Date(2016,1,22), "task0002", true);
var detail3 = new TaskDetail(["分类", "task0003"], "todo3", new Date(2016,2,2), "task0003", false);

var cates = [defaultCate, cate1];
var lists = [defaultList, list1, list2, list3];
var tasks = [defaultDetail, detail1, detail2, detail3];

each(tasks, function(item, i){
    item.id = i;
});

var data = {
    tasks: getData("tasks"),
    lists: getData("lists"),
    cates: getData("cates")
};

function getData(key){
    try{
        if(window.localStorage){
            var storage = window.localStorage;
            if(!storage.getItem(key)){
                switch (key){
                    case "cates":
                        storage.setItem("cates", JSON.stringify(cates));
                        return JSON.parse(storage.getItem("cates"));
                        break;

                    case "lists":
                        storage.setItem("lists", JSON.stringify(lists));
                        return JSON.parse(storage.getItem("lists"));
                        break;

                    case "tasks":
                        storage.setItem("tasks", JSON.stringify(tasks));
                        return JSON.parse(storage.getItem("tasks"));
                        break;
                }
            }
            return JSON.parse(storage.getItem(key));
        }
    }
    catch(e){
        console.log(e);
    }
}

function setData(key,val){
    try{
        if(window.localStorage){
            var storage = window.localStorage;
            if(storage.getItem(key)){
                switch (key){
                    case "cates":
                        storage.setItem("cates", JSON.stringify(val));
                        break;
                    case "lists":
                        storage.setItem("lists", JSON.stringify(val));
                        break;
                    case "tasks":
                        storage.setItem("tasks", JSON.stringify(val));
                        break;

                }
            }
        }
    }
    catch(e){
        console.log(e);
    }
}
