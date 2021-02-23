var firebaseConfig = {
    apiKey: "AIzaSyABdiCYfcSP3WlBxpd4TqFA_e36ketN0Ug",
    authDomain: "todojs-1211c.firebaseapp.com",
    databaseURL: "https://todojs-1211c-default-rtdb.firebaseio.com",
    projectId: "todojs-1211c",
    storageBucket: "todojs-1211c.appspot.com",
    messagingSenderId: "750576293351",
    appId: "1:750576293351:web:984a0a1eecb8c8a1b11942"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
 

//variable Declare
const todoinput = document.getElementById('item')
const todoadd = document.getElementById('add');
const todolist = document.getElementById('List');
const filteroption = document.getElementById('filter-todo');
const deleteall = document.getElementById('dltbtn');
const ckck = document.getElementById('ckck');
const checkFunctionSelector = document.getElementById('drop-check');
let LocalTask=[];
var taskName;

//Event Listner
document.addEventListener("DOMContentLoaded", getTodos);
todoadd.addEventListener('click',addList);
todolist.addEventListener('click',deletecmt); 
filteroption.addEventListener('click',filterItems);
deleteall.addEventListener('click',deleteAll);
checkFunctionSelector.addEventListener('change',checkFunctions);
ckck.addEventListener('click',selectAll);

//For Cookies
function init() {
    // debugger;
    LocalTask = getCookie("LocalTask");
    // debugger;
    if (typeof LocalTask != "" && LocalTask != "") {
        LocalTask = JSON.parse(LocalTask);
    } else {
        LocalTask = [];
    }
}
init()

//Function For Add Cookies
function saveCookies(todo)
{
    console.log(todo);
    var id = LocalTask.length;
    LocalTask.push({"id": id,"name" : todo});
    
    var d = new Date();
    d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = "LocalTask" + "=" + JSON.stringify(LocalTask) + ";" + expires + ";path=/";
}

function getCookie(cName) {
    var name = cName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

//ADD Function
function addList(event)
{
    event.preventDefault();
    
    const todoDiv = document.createElement('div');
    todoDiv.classList.add("todo-item");

    const cmtbox = document.createElement("input");
    cmtbox.setAttribute("type", "checkbox");
    cmtbox.id = "cmtboxs"
    cmtbox.classList.add("cmtbox")

    const newTodo = document.createElement('li');
    newTodo.innerText = todoinput.value;
    newTodo.classList.add('todo-li');

    const cmtBtn = document.createElement('button');
    cmtBtn.innerHTML = "<i class='fa fa-check'></i>"; 
    cmtBtn.classList.add("todo-cmt");

    const edtBtn = document.createElement("button");
    edtBtn.innerHTML = `<div class="fa fa-edit"></div>`;
    edtBtn.classList.add("todo-edit");        

    const delBtn = document.createElement('button');
    delBtn.innerHTML = "<i class='fa fa-times'></i>"; 
    delBtn.classList.add("todo-delete");

    
    
    if(todoinput.value === "")
    {
        alert("Input Is blank...")
    }
    else
    {
        //To Save In Firebase
        saveFirebase(todoinput.value);

        //to Save In Cookies
        saveCookies(todoinput.value);

        //to Save in Local Storage Function
        savelocal(todoinput.value);

        todoDiv.append(cmtbox);
        todoDiv.append(newTodo);
        todoDiv.append(cmtBtn);  
        todoDiv.append(edtBtn);
        todoDiv.append(delBtn);
        todolist.append(todoDiv);
    }

    todoinput.value = "";
}

//Save In firebase Database
function saveFirebase(todo){
    taskName = todo;
    firebase.database().ref('todolist/'+taskName).set({
        taskName : taskName
    });
}
//Savelocal Storage Function
function savelocal(todo){
    let taskobj;
    let webtask = localStorage.getItem("localtask");

    if(webtask == null){
        taskobj = [];
    }
    else{
        taskobj = JSON.parse(webtask);
    }

    taskobj.push(todo);
    localStorage.setItem("localtask",JSON.stringify(taskobj));
    window.setTimeout(function () {
        window.location.reload();
      }, 2000);
}

//Delete & Complated Function
function deletecmt(e)
{
    var item = e.target;

    if(item.classList[0] === "todo-delete")
    {
        const todo = item.parentElement;
        todo.classList.add("fall");

        removeLocalTodos(todo);
        removeCookies(todo);
        removeFirebase(todo);

        todo.addEventListener('transitionend',function(){
            todo.remove();
        });
    }

    if(item.classList[0] === "todo-cmt")
    {
        const todo = item.parentElement;
        todo.classList.toggle("completed");
    }    
}

//Edit Data in Local Storagde
function editing(index) {
    var todos;
    let taskobj = localStorage.getItem("localtask");
    
    if (taskobj === null) {
        todos = [];
    } else {
        todos = JSON.parse(taskobj);
    }
    let pData =  todos[index];
    const retVal = prompt("Input Edit Data : ",todos[index]);
    if(retVal === ""){
        alert("Please Enter Something")
    }
    else{
        todos[index] = retVal;
        localStorage.setItem("localtask",JSON.stringify(todos));

        selectedTask = LocalTask[parseInt(index)];
        editCookies({id: selectedTask.id,name: retVal})
        editFirebase(retVal,pData);

        window.setTimeout(function () {
            window.location.reload();
          }, 2000);
    }
}

//Delete All Data From Local Storage
function deleteAll(){

    var todos;
    
    let taskobj = localStorage.getItem("localtask");
    
    if (taskobj === null) {
        todos = [];
    } else {
        todos = JSON.parse(taskobj);
    }
    todos = [];
    localStorage.setItem("localtask",JSON.stringify(todos));

    document.cookie = "LocalTask=;expires=tru;path=/";

    firebase.database().ref('todolist/').remove();

    window.setTimeout(function () {
        window.location.reload();
      }, 1000);
}

//Filter in Complated And InComplated
function filterItems(e){
    let filterdItems = todolist.childNodes;
    filterdItems.forEach(item => {
        switch (e.target.value) {
            case 'all':
                item.style.display = 'flex'
                break;
            case 'completed':
                item.classList.contains('completed') ? item.style.display = 'flex' : item.style.display = 'none'
                break;
            case 'uncompleted':
                !item.classList.contains('completed') ? item.style.display = 'flex' : item.style.display = 'none' 
                break;
            default:
                break;
        }
    });
}

//Delete Data From Local Storage
function removeLocalTodos(todo) {
    let todos;
    
    let taskobj = localStorage.getItem("localtask");

    if (taskobj === null) {
        todos = [];
    } else {
        todos = JSON.parse(taskobj);
    }

    const todoIndex = todo.children[1].innerText;
    todos.splice(todos.indexOf(todoIndex), 1);
    localStorage.setItem("localtask", JSON.stringify(todos));

}

//To Display Data From Local Storage
function getTodos(t = []) {
    let todos;
    if (t.length > 0) {
        todolist.innerHTML = ""
        todos = t;
    } else {
        if (localStorage.getItem("localtask") === null) {
            todos = [];
        } else {
            todos = JSON.parse(localStorage.getItem("localtask"));
        }
    }

    todos.forEach(function(todo, index) {
        //Create todo div
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo-item");

        //Create CheckBox
        const cmtbox = document.createElement("input");
        cmtbox.setAttribute("type", "checkbox");
        cmtbox.id = 'cmtboxs';
        cmtbox.classList.add("cmtbox");
        cmtbox.addEventListener('click',selectAllCheck);
        todoDiv.appendChild(cmtbox);
       

        //Create list
        const newTodo = document.createElement("li");
        newTodo.innerText = todo;
        newTodo.classList.add("todo-li");
        todoDiv.appendChild(newTodo);

        todoinput.value = "";

        //Create Completed Button
        const cmtBtn = document.createElement("button");
        cmtBtn.innerHTML = `<i class="fa fa-check"></i>`;
        cmtBtn.classList.add("todo-cmt");
        todoDiv.appendChild(cmtBtn);

        //Create Edit Button
        const edtBtn = document.createElement("button");
        edtBtn.innerHTML = `<button type="button" id="bt" onclick="editing(${index})"><i class="fa fa-edit"></i>Edit</button>`;
        edtBtn.classList.add("todo-edit");
        todoDiv.appendChild(edtBtn);

        //Create trash button
        const delBtn = document.createElement("button");
        delBtn.innerHTML = `<i class="fa fa-times"></i>`;
        delBtn.classList.add("todo-delete");
        todoDiv.appendChild(delBtn);

        //attach final Todo
        todolist.appendChild(todoDiv);
    });
}

//Check Function For Delete And Complated
function checkFunctions(e) {
    const item = e.target;
    let cmtbybox = todolist.childNodes;

    switch (e.target.value) {
        case 'dlts':
            cmtbybox.forEach(item=>{
                if(item.childNodes[0].checked)
                {
                    item.classList.add("fall");
                    ckck.checked = false
                    
                    removeLocalTodos(item);
            
                    item.addEventListener('transitionend',function(){
                        item.remove();
                    });
                    checkFunctionSelector.value = ""                    
                };
            })
            break;
        case 'cmts':
            cmtbybox.forEach(item=>{
                if(item.childNodes[0].checked)
                {
                    if(item.classList.contains("completed")){
                        item.children[0].checked = false;
                        ckck.checked = false;
                    }
                    else{
                        item.classList.toggle("completed");
                        item.children[0].checked = false;
                        ckck.checked = false;
                        checkFunctionSelector.value = ""
                    }
                }
            })
            break;
        case 'ucmts':
            cmtbybox.forEach(item=>{
                if(item.childNodes[0].checked)
                {
                    if(!item.classList.contains("completed")){
                        item.children[0].checked = false;
                        ckck.checked = false;
                    }
                    else{
                        item.classList.toggle("completed");
                        item.children[0].checked = false;
                        ckck.checked = false;
                        checkFunctionSelector.value = ""
                    }
                }
            })
            break;
        default:
            break;
    }
    
}

//Select All Checkboxes
function selectAll(e){

    var item = e.target;

    let selectbox = todolist.childNodes;
    if(selectbox.length === 0)
    {
        item.checked = false
        alert("No Task Available...");
    }
    else{
        if(item.checked){
            selectbox.forEach(item=>{
                item.children[0].checked = true;
            })
        }
        else if(item.checked === false){
            selectbox.forEach(item=>{
                item.children[0].checked = false;
            })
        }
    }
}

//function for select all check
function selectAllCheck(){

    var ct = 0;
    let checkboxcheck = todolist.childNodes;

    checkboxcheck.forEach(item=>{
        if(item.childNodes[0].checked){
            ct += 1;
        }
    })

    if(checkboxcheck.length == ct){
        ckck.checked = true
    }
    else{
        ckck.checked = false
    }
}
//Function For Remove Cookies
function removeCookies(todo)
{
    console.log(todo);
    const todoIndex = todo.children[1].innerText;
    console.log(todoIndex);
    LocalTask.splice(todoIndex,1);  

    var d = new Date();
    d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = "LocalTask" + "=" + JSON.stringify(LocalTask) + ";" + expires + ";path=/";
}

//function for Edit task in cookies
function editCookies(task)
{
    if (!task) {
        return
    }

    if(task.id == LocalTask[task.id].id)
    {
        LocalTask[task.id].name = task.name;
    }    
    
    var d = new Date();
    d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = "LocalTask" + "=" + JSON.stringify(LocalTask) + ";" + expires + ";path=/";
}

//function for Remove Task from firebase Database
function removeFirebase(todo)
{
    taskName = todo.children[1].innerText;
    firebase.database().ref('todolist/'+taskName).remove();
}

//function for edit Task from firebase Database
function editFirebase(todo,pData)
{
    taskName = pData;
    firebase.database().ref('todolist/'+taskName).remove();

    taskName = todo;
    firebase.database().ref('todolist/'+taskName).set({
        taskName : taskName
    });
}