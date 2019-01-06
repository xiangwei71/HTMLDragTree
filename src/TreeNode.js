function TreeNode(id) {
  this.id = id;
  this.childs = [];

  this.addChild = function (node) {
    this.childs.push(node);
  }

  this.render = function () {

    var content = "";
    this.childs.forEach(element => {
      content += element.render();
    });

    return "<div id='treeNode_@id' style='left:20px'> \
              <span id='treeNode_@id_draggable' draggable='true' ondragstart ='DraggableTree_dragStart(event)'>🍕@id</span> \
              <span id='treeNode_@id_droppable' class='droppable' onclick='DraggableTree_toggle(\"treeNode_@id\")' ondrop='DraggableTree_drop(event)' ondragover='DraggableTree_dragOver(event)' ondragleave ='DraggableTree_dragOut(event)'>💼</span> \
              <div id='treeNode_@id_content' class='close'> \
                @content \
              </div> \
            </div > ".replace(/@id/g, id).replace("@content", content);
  }
}

function buildTree(obj) {
  var node = new TreeNode(obj.name);
  for (var i = 0; i < obj.childs.length; ++i) {
    var element = obj.childs[i];
    node.addChild(buildTree(element));
  }
  return node;
}

function DraggableTree_toggle(key) {
  var id = key + "_content";
  var dom = document.getElementById(id);
  dom.className = dom.className == "open" ? "close" : "open";
}

function DraggableTree_dragOver(ev) {
  ev.preventDefault();
  document.getElementById(ev.target.id).className = "dropping";
}

function DraggableTree_dragOut(ev) {
  // ev.preventDefault();
  document.getElementById(ev.target.id).className = "droppable";
}

function DraggableTree_dragStart(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function DraggableTree_drop(ev) {
  ev.preventDefault();
  document.getElementById(ev.target.id).className = "droppable";

  var draggable_id = ev.dataTransfer.getData("text").replace("_draggable", "");
  var droppable_id = ev.target.id.replace("_droppable", "")
  console.log(draggable_id + " to " + droppable_id);

  var dropTarget = document.getElementById(droppable_id);
  var dragTarget = document.getElementById(draggable_id);
  var content = document.getElementById(droppable_id + "_content");

  // 擋掉: cannot set parent to child
  if (DraggableTree_findDomById(dragTarget, droppable_id)) {
    alert("cannot set parent to child");
    return;
  }

  // 放進去
  content.appendChild(dragTarget);

  // 打開
  content.className = "open";
}

function DraggableTree_findDomById(dom, id) {
  if (dom.id == id)
    return true;

  if (dom.children.length == 0)
    return false;

  //有子node就往下找
  for (var i = 0; i < dom.children.length; ++i) {
    var node = dom.children[i];
    if (DraggableTree_findDomById(node, id))
      return true;
  }

  return false;
}
