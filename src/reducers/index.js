import { SOURCE_MOUSE_DOWN, SOURCE_MOUSE_UP, SOURCE_DRAG_START, SOURCE_DRAG_END } from '../actions';
import { MOUSE_DOWN, MOUSE_UP, DRAG, DRAG_START, DRAG_END } from '../actions';
import { combineReducers } from 'redux';
import update from 'react-addons-update';

function insideof(x,y,id){
    let rect=document.getElementById(id).getBoundingClientRect();
    if(x<rect.left||x>rect.left+rect.width||y<rect.top||y>rect.top+rect.height)
        return false;
    else return true;
}

function checkSnap(top,left,width,height,selectedBoxIdList,boxList,snapSize){
    let ret={top:top,left:left,topDiff:0,leftDiff:0,
        topLine:-1,bottomLine:-1,leftLine:-1,rightLine:-1};

    for(let boxId in boxList){
        if(selectedBoxIdList.includes(boxId)) continue;
        let box=boxList[boxId];
        if(Math.abs(top-box.top)<snapSize) {ret.top=box.top; ret.topDiff=ret.top-top; ret.topLine=box.top;}
        else if(Math.abs(top-(box.top+box.height))<snapSize) {ret.top=box.top+box.height; ret.topDiff=ret.top-top; ret.topLine=box.top+box.height;}
        
        if(Math.abs((top+height)-box.top)<snapSize) {ret.top=box.top-height; ret.topDiff=ret.top-top; ret.bottomLine=box.top;}
        else if(Math.abs((top+height)-(box.top+box.height))<snapSize) {ret.top=box.top+box.height-height; ret.topDiff=ret.top-top; ret.bottomLine=box.top+box.height;}

        if(Math.abs(left-box.left)<snapSize) {ret.left=box.left; ret.leftDiff=ret.left-left; ret.leftLine=box.left;}
        else if(Math.abs(left-(box.left+box.width))<snapSize) {ret.left=box.left+box.width; ret.leftDiff=ret.left-left; ret.leftLine=box.left+box.width;}
        
        if(Math.abs((left+width)-box.left)<snapSize) {ret.left=box.left-width; ret.leftDiff=ret.left-left; ret.rightLine=box.left;}
        else if(Math.abs((left+width)-(box.left+box.width))<snapSize) {ret.left=box.left+box.width-width; ret.leftDiff=ret.left-left; ret.rightLine=box.left+box.width;}
    }
    if(ret.topLine===-1 && ret.leftLine===-1 && ret.bottomLine===-1 && ret.rightLine===-1) return false;
    return ret;
}

const dragInitialState={
    boxSourceList:{
//{id:1, isDragging:false, top:300, left:50, width:100, height:100},,,,
        1:{isDragging:false, top:300, left:50, width:100, height:100},
        2:{isDragging:false, top:100, left:100, width:50, height:120}
    },
    boxList:{
//{id:1112, isDragging:false, top:300, left:550, width:100, height:100},,,,
        1112:{isDragging:false, top:300, left:550, width:100, height:100},
        1113:{isDragging:false, top:100, left:600, width:100, height:100},
        1114:{isDragging:false, top:100, left:600, width:300, height:400}
    },
    selectedBoxIdList:[
//{id:1111},,,,
    ],
    currentDragStart:{
        orgTop:-1, orgLeft:-1, orgX:-1, orgY:-1, orgWidth:-1, orgHeight:-1
    },
    idCount:1115,
    snapLine:{
        top:-1,
        bottom:-1,
        left:-1,
        right:-1
    }
}


const drag = (state = dragInitialState, action) => {
    let ui;
    switch(action.type) {
        //source box
        case SOURCE_MOUSE_DOWN:
            return Object.assign({}, state, {
                boxSourceList:update(
                    state.boxSourceList,
                    {
                        [action.id]:{
                            isDragging:{$set:true}
                        }
                    }
                )
            });

        case SOURCE_MOUSE_UP:
            return Object.assign({}, state, {
                boxSourceList:update(
                    state.boxSourceList,
                    {
                        [action.id]:{
                            isDragging:{$set:false}
                        }
                    }
                )
            });

        case SOURCE_DRAG_START:
        //todo : 시작할때 helper 만들고, display 바꿔서 나타내기
            return Object.assign({},state,{
                currentDragStart:{
                    orgTop:parseInt(document.getElementById(action.id).style.top,10),
                    orgLeft:parseInt(document.getElementById(action.id).style.left,10),
                    orgX:action.x,
                    orgY:action.y,
                    orgWidth:parseInt(document.getElementById(action.id).style.width,10),
                    orgHeight:parseInt(document.getElementById(action.id).style.height,10)
                }
            });
            
        case SOURCE_DRAG_END:
            if(!insideof(action.x,action.y,"dragArea")){
                return state;
            }
            
            ui=state.currentDragStart;
            return Object.assign({},state,{
                boxList:Object.assign({},state.boxList,{
                        [state.idCount++]:{
                            isDragging:false,
                            top:ui.orgTop+action.y-ui.orgY,
                            left:ui.orgLeft+action.x-ui.orgX,
                            width:state.boxSourceList[action.id].width,
                            height:state.boxSourceList[action.id].height
                        }
                    }
                )
            });

        //normal box    
        case MOUSE_DOWN:
            if(action.id==="dragArea"){
                return Object.assign({}, state, {
                    selectedBoxIdList:[]
                });
            }
            if(action.id==="0") return state;
            return Object.assign({}, state, {
                selectedBoxIdList:(action.shift===true)?state.selectedBoxIdList.concat(action.id):[action.id]
            });
 
        case MOUSE_UP:
            return Object.assign({}, state, {
                boxList:update(
                    state.boxList,
                    {
                        [action.id]:{
                            isDragging:{$set:false}
                        }
                    }
                )
            });

        case DRAG_START:
            let newBoxList=state.boxList;
            for(let boxId in newBoxList){
                if(state.selectedBoxIdList.includes(boxId)){
                    newBoxList[boxId]={
                        ...newBoxList[boxId],
                        ...{orgTop:newBoxList[boxId].top,orgLeft:newBoxList[boxId].left}
                    }
                }
            }
            return Object.assign({},state,{
                currentDragStart:{
                    orgTop:parseInt(document.getElementById(action.id).style.top,10),
                    orgLeft:parseInt(document.getElementById(action.id).style.left,10),
                    orgX:action.x,
                    orgY:action.y,
                    orgWidth:parseInt(document.getElementById(action.id).style.width,10),
                    orgHeight:parseInt(document.getElementById(action.id).style.height,10)
                },
                boxList:newBoxList
            });
            
        case DRAG:
        //todo smooth in outside
            if(!insideof(action.x,action.y,"dragArea")){
                return state;
            }
            if(action.x===0 || action.y===0){
                return state;
            }

            ui=state.currentDragStart;

            let topDiff=action.y-ui.orgY,leftDiff=action.x-ui.orgX,topLine=-1,bottomLine=-1,leftLine=-1,rightLine=-1;
            //snap top/left/width/height/selectedBoxIdList/boxlist/snapsize
            let ret=checkSnap(ui.orgTop+action.y-ui.orgY,ui.orgLeft+action.x-ui.orgX,
                ui.orgWidth,ui.orgHeight,state.selectedBoxIdList,
                state.boxList,5);
            if(ret!==false){
                topDiff+=ret.topDiff;
                leftDiff+=ret.leftDiff;
                topLine=ret.topLine;
                bottomLine=ret.bottomLine;
                leftLine=ret.leftLine;
                rightLine=ret.rightLine;
            }

            let changeBoxList={}
            for(let boxId in state.boxList){
                if(state.selectedBoxIdList.includes(boxId)){
                    changeBoxList={...changeBoxList,...{[boxId]:{
                        top:{$set:state.boxList[boxId].orgTop+topDiff},
                        left:{$set:state.boxList[boxId].orgLeft+leftDiff}
                    }}};
                }
            }
            return Object.assign({},state,{
                boxList:update(
                    state.boxList,
                    changeBoxList
                ),
                snapLine:update(
                    state.snapLine,
                    {
                        top:{$set:topLine},
                        bottom:{$set:bottomLine},
                        left:{$set:leftLine},
                        right:{$set:rightLine}
                    }
                )
            });
        
        case DRAG_END:
            return Object.assign({},state,{
                snapLine:update(
                    state.snapLine,
                    {
                        top:{$set:-1},
                        bottom:{$set:-1},
                        left:{$set:-1},
                        right:{$set:-1}
                    }
                )
            });
       
        default:
            return state;
    }
}

const counterApp = combineReducers({
    drag
});

export default counterApp;