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

function checkSnap(top,left,width,height,id,boxList,snapSize){
    
    let ret={top:top,left:left,
        topLine:-1,bottomLine:-1,leftLine:-1,rightLine:-1};

    boxList.forEach((box)=>{
        if(box.id===parseInt(id,10)) return;
        if(Math.abs(top-box.top)<snapSize) {ret.top=box.top; ret.topLine=box.top;}
        else if(Math.abs(top-(box.top+box.height))<snapSize) {ret.top=box.top+box.height; ret.topLine=box.top+box.height;}
        
        if(Math.abs((top+height)-box.top)<snapSize) {ret.top=box.top-height; ret.bottomLine=box.top;}
        else if(Math.abs((top+height)-(box.top+box.height))<snapSize) {ret.top=box.top+box.height-height; ret.bottomLine=box.top+box.height;}

        if(Math.abs(left-box.left)<snapSize) {ret.left=box.left; ret.leftLine=box.left;}
        else if(Math.abs(left-(box.left+box.width))<snapSize) {ret.left=box.left+box.width; ret.leftLine=box.left+box.width;}
        
        if(Math.abs((left+width)-box.left)<snapSize) {ret.left=box.left-width; ret.rightLine=box.left;}
        else if(Math.abs((left+width)-(box.left+box.width))<snapSize) {ret.left=box.left+box.width-width; ret.rightLine=box.left+box.width;}
    });
    if(ret.topLine===-1 && ret.leftLine===-1 && ret.bottomLine===-1 && ret.rightLine===-1) return false;
    return ret;
}

const dragInitialState={
    boxSourceList:[
        {id:1, isDragging:false, top:300, left:50, width:100, height:100},
        {id:2, isDragging:false, top:100, left:100, width:50, height:120}
    ],
    boxList:[
        {id:1112, isDragging:false, top:300, left:550, width:100, height:100},
        {id:1113, isDragging:false, top:100, left:600, width:100, height:100}
    ],
    selectedBoxList:[

    ],
    currentDragStart:[
        {id:-1, orgTop:-1, orgLeft:-1, orgX:-1, orgY:-1, orgWidth:-1, orgHeight:-1}
    ],
    idCount:1114,
    snapLine:{
        top:-1,
        bottom:-1,
        left:-1,
        right:-1
    }
}


const drag = (state = dragInitialState, action) => {
    let id,ui;
    switch(action.type) {
        //source box
        case SOURCE_MOUSE_DOWN:
            //find index of id
            id=state.boxSourceList.findIndex((box)=>box.id===parseInt(action.id,10))

            return Object.assign({}, state, {
                boxSourceList:update(
                    state.boxSourceList,
                    {
                        [id]:{
                            isDragging:{$set:true}
                        }
                    }
                )
            });

        case SOURCE_MOUSE_UP:
            //find index of id
            id=state.boxSourceList.findIndex((box)=>box.id===parseInt(action.id,10))

            return Object.assign({}, state, {
                boxSourceList:update(
                    state.boxSourceList,
                    {
                        [id]:{
                            isDragging:{$set:false}
                        }
                    }
                )
            });

        case SOURCE_DRAG_START:
        //todo : 시작할때 helper 만들고, display 바꿔서 나타내기
            return Object.assign({},state,{
                currentDragStart:[
                    {
                        id:action.id,
                        orgTop:parseInt(document.getElementById(action.id).style.top,10),
                        orgLeft:parseInt(document.getElementById(action.id).style.left,10),
                        orgX:action.x,
                        orgY:action.y,
                        orgWidth:parseInt(document.getElementById(action.id).style.width,10),
                        orgHeight:parseInt(document.getElementById(action.id).style.height,10)
                    }
                ]
            });
            
        case SOURCE_DRAG_END:
            if(!insideof(action.x,action.y,"dragArea")){
                return state;
            }
            //find index of id
            id=state.boxSourceList.findIndex((box)=>box.id===parseInt(action.id,10))

            ui=state.currentDragStart[0];
            return Object.assign({},state,{
                boxList:state.boxList.concat({
                    id:state.idCount++,
                    isDragging:false,
                    top:ui.orgTop+action.y-ui.orgY,
                    left:ui.orgLeft+action.x-ui.orgX,
                    width:state.boxSourceList[id].width,
                    height:state.boxSourceList[id].height
                })
            });

        //normal box    
        case MOUSE_DOWN:
            //find index of id
            id=state.boxList.findIndex((box)=>box.id===parseInt(action.id,10))

            return Object.assign({}, state, {
                boxList:update(
                    state.boxList,
                    {
                        [id]:{
                            isDragging:{$set:true}
                        }
                    }
                )
            });
 
        case MOUSE_UP:
            //find index of id
            id=state.boxList.findIndex((box)=>box.id===parseInt(action.id,10))

            return Object.assign({}, state, {
                boxList:update(
                    state.boxList,
                    {
                        [id]:{
                            isDragging:{$set:false}
                        }
                    }
                )
            });

        case DRAG_START:
            return Object.assign({},state,{
                currentDragStart:[
                    {
                        id:action.id,
                        orgTop:parseInt(document.getElementById(action.id).style.top,10),
                        orgLeft:parseInt(document.getElementById(action.id).style.left,10),
                        orgX:action.x,
                        orgY:action.y,
                        orgWidth:parseInt(document.getElementById(action.id).style.width,10),
                        orgHeight:parseInt(document.getElementById(action.id).style.height,10)
                    }
                ]
            });
            
        case DRAG:
        //todo smooth in outside
            if(!insideof(action.x,action.y,"dragArea")){
                return state;
            }
            if(action.x===0 || action.y===0){
                return state;
            }

            //find index of id
            id=state.boxList.findIndex((box)=>box.id===parseInt(action.id,10))

            ui=state.currentDragStart[0];

            //snap top/left/width/hiehgt/boxlist/snapsize
            let ret=checkSnap(ui.orgTop+action.y-ui.orgY,ui.orgLeft+action.x-ui.orgX,
                ui.orgWidth,ui.orgHeight,ui.id,
                state.boxList,5);
            if(false!==ret){
                return Object.assign({},state,{
                    boxList:update(
                        state.boxList,
                        {
                            [id]:{
                                top:{$set:ret.top},
                                left:{$set:ret.left}
                            }
                        }
                    ),
                    snapLine:update(
                        state.snapLine,
                        {
                            top:{$set:ret.topLine},
                            bottom:{$set:ret.bottomLine},
                            left:{$set:ret.leftLine},
                            right:{$set:ret.rightLine}
                        }
                    )
                });
            }

            return Object.assign({},state,{
                boxList:update(
                    state.boxList,
                    {
                        [id]:{
                            top:{$set:ui.orgTop+action.y-ui.orgY},
                            left:{$set:ui.orgLeft+action.x-ui.orgX}
                        }
                    }
                ),
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