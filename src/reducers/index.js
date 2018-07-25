import { SOURCE_MOUSE_DOWN, SOURCE_MOUSE_UP, SOURCE_DRAG_START, SOURCE_DRAG_END } from '../actions';
import { MOUSE_DOWN, MOUSE_UP, DRAG, DRAG_START, DRAG_END } from '../actions';
import { RESIZE_DRAG, RESIZE_DRAG_START, RESIZE_DRAG_END } from '../actions';
import { combineReducers } from 'redux';
import update from 'react-addons-update';

import { dragInitialState } from './dragInitialState';

Object.from = arr => Object.assign(...arr.map( ([k, v]) => ({[k]: v}) ));
Object.filter = (obj, predicate) => Object.from(Object.entries(obj).filter(predicate));


function getContainerRect(boxList){
    let ret={top:10000,bottom:-1,left:10000,right:-1};
    for(let boxId in boxList){
        ret.top=Math.min(ret.top,boxList[boxId].top);
        ret.bottom=Math.max(ret.bottom,boxList[boxId].top+boxList[boxId].height);
        ret.left=Math.min(ret.left,boxList[boxId].left);
        ret.right=Math.max(ret.right,boxList[boxId].left+boxList[boxId].width);
    }
    return ret;
}

function insideof(x,y,id){
    let rect=document.getElementById(id).getBoundingClientRect();
    if(x<rect.left||x>rect.left+rect.width||y<rect.top||y>rect.top+rect.height)
        return false;
    else return true;
}

//두개 차이점은 middle line 에서 *2 뿐... 싫으면 인자로 주던가
function checkSnapDrag(top,left,width,height,selectedBoxIdList,boxList,snapSize){
    let ret={top:{diff:0,line:-1},bottom:{diff:0,line:-1},left:{diff:0,line:-1},right:{diff:0,line:-1}};
    for(let boxId in boxList){
        if(selectedBoxIdList.includes(boxId)) continue;
        let box=boxList[boxId];
        let horizonalLineList=[box.top, box.top+box.height];
        let verticalLineList=[box.left, box.left+box.width];
        let horizonalMiddleLineList=[box.top+0.5*box.height];
        let verticalMiddleLineList=[box.left+0.5*box.width];

        for(let horizonalMiddleLine of horizonalMiddleLineList){
            if(Math.abs(horizonalMiddleLine-(top+0.5*height))<snapSize){
                ret.top={diff:horizonalMiddleLine-(top+0.5*height),line:horizonalMiddleLine};
                ret.bottom={diff:horizonalMiddleLine-(top+0.5*height),line:horizonalMiddleLine};
            }
        }
        for(let horizonalLine of horizonalLineList){
            if(Math.abs(horizonalLine-top)<snapSize){
                ret.top={diff:horizonalLine-top,line:horizonalLine};
            }
            if(Math.abs(horizonalLine-(top+height))<snapSize){
                ret.bottom={diff:horizonalLine-(top+height),line:horizonalLine};
            }
        }
        
        for(let verticalMiddleLine of verticalMiddleLineList){
            if(Math.abs(verticalMiddleLine-(left+0.5*width))<snapSize){
                ret.left={diff:verticalMiddleLine-(left+0.5*width),line:verticalMiddleLine};
                ret.right={diff:verticalMiddleLine-(left+0.5*width),line:verticalMiddleLine};
            }
        }
        for(let verticalLine of verticalLineList){
            if(Math.abs(verticalLine-left)<snapSize){
                ret.left={diff:verticalLine-left,line:verticalLine};
            }
            if(Math.abs(verticalLine-(left+width))<snapSize){
                ret.right={diff:verticalLine-(left+width),line:verticalLine};
            }
        }
    }
    return ret;
}
function checkSnapResize(top,left,width,height,selectedBoxIdList,boxList,snapSize){
    let ret={top:{diff:0,line:-1},bottom:{diff:0,line:-1},left:{diff:0,line:-1},right:{diff:0,line:-1}};
    for(let boxId in boxList){
        if(selectedBoxIdList.includes(boxId)) continue;
        let box=boxList[boxId];
        let horizonalLineList=[box.top, box.top+box.height];
        let verticalLineList=[box.left, box.left+box.width];
        let horizonalMiddleLineList=[2*box.top+box.height];
        let verticalMiddleLineList=[2*box.left+box.width];

        for(let horizonalMiddleLine of horizonalMiddleLineList){
            if(Math.abs(horizonalMiddleLine-(2*top+height))<snapSize){
                ret.top={diff:horizonalMiddleLine-(2*top+height),line:horizonalMiddleLine/2};
                ret.bottom={diff:horizonalMiddleLine-(2*top+height),line:horizonalMiddleLine/2};
            }
        }
        for(let horizonalLine of horizonalLineList){
            if(Math.abs(horizonalLine-top)<snapSize){
                ret.top={diff:horizonalLine-top,line:horizonalLine};
            }
            if(Math.abs(horizonalLine-(top+height))<snapSize){
                ret.bottom={diff:horizonalLine-(top+height),line:horizonalLine};
            }
        }
        
        for(let verticalMiddleLine of verticalMiddleLineList){
            if(Math.abs(verticalMiddleLine-(2*left+width))<snapSize){
                ret.left={diff:verticalMiddleLine-(2*left+width),line:verticalMiddleLine/2};
                ret.right={diff:verticalMiddleLine-(2*left+width),line:verticalMiddleLine/2};
            }
        }
        for(let verticalLine of verticalLineList){
            if(Math.abs(verticalLine-left)<snapSize){
                ret.left={diff:verticalLine-left,line:verticalLine};
            }
            if(Math.abs(verticalLine-(left+width))<snapSize){
                ret.right={diff:verticalLine-(left+width),line:verticalLine};
            }
        }
    }
    return ret;
}




const drag = (state = dragInitialState, action) => {
    switch(action.type) {
        //source box
        case SOURCE_MOUSE_DOWN:{
            return Object.assign({}, state, {
                selectedBoxIdList:[action.id]
            });
        }
        case SOURCE_MOUSE_UP:{
            return Object.assign({}, state, {
                selectedBoxIdList:[]
            });
        }

        //todo : 시작할때 helper 만들고, display 바꿔서 나타내기
        //todo delete key 'x' 'y' at source drag end
        case SOURCE_DRAG_START:{
            return Object.assign({},state,{
                boxSourceList:update(
                    state.boxSourceList,{
                        [state.selectedBoxIdList[0]]:{$set:{...state.boxSourceList[state.selectedBoxIdList[0]],...{x:action.x,y:action.y}}}
                    }
                )
            });
        }
        //todo
        case SOURCE_DRAG_END:{
            if(!insideof(action.x,action.y,"dragArea")){
                return state;
            }
            
            let targetSourceBox=state.boxSourceList[state.selectedBoxIdList[0]];
            return Object.assign({},state,{
                boxList:Object.assign({},state.boxList,{
                        [state.idCount++]:{
                            isDragging:false,
                            top:targetSourceBox.top+action.y-targetSourceBox.y,
                            //todo : remove 400 and make it scalable
                            left:targetSourceBox.left+action.x-targetSourceBox.x-400,
                            width:state.boxSourceList[action.id].width,
                            height:state.boxSourceList[action.id].height
                        }
                    }
                )
            });
        }

        //normal box    
        case MOUSE_DOWN:{
            if(action.id==="dragArea"){
                return Object.assign({}, state, {
                    selectedBoxIdList:[],
                    targetBox:{top:-1,left:-1,width:0,height:0,x:-1,y:-1,realTop:-1,realLeft:-1,realWidth:0,realHeight:0}
                });
            }
            if(action.id.includes("Resizer")) return state;
            if(action.id==="0") return state;

            let newSelectedBoxIdList=(action.shift===true)?state.selectedBoxIdList.concat(action.id):[action.id];
            let selectedBoxList=Object.filter(state.boxList, ([id,box])=>newSelectedBoxIdList.includes(id));
            let ret=getContainerRect(selectedBoxList);

            return Object.assign({}, state, {
                selectedBoxIdList:newSelectedBoxIdList,
                targetBox:update(
                    state.targetBox,{
                        top:{$set:ret.top},
                        left:{$set:ret.left},
                        width:{$set:ret.right-ret.left},
                        height:{$set:ret.bottom-ret.top},
                        realTop:{$set:ret.top},
                        realLeft:{$set:ret.left},
                        realWidth:{$set:ret.right-ret.left},
                        realHeight:{$set:ret.bottom-ret.top}
                    }
                )
            });
        }
        case MOUSE_UP:{
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
        }
        case DRAG_START:{
            let newBoxList=state.boxList;
            for(let boxId in newBoxList){
                if(state.selectedBoxIdList.includes(boxId)){
                    newBoxList[boxId]={
                        ...newBoxList[boxId],
                        ...{orgTop:newBoxList[boxId].top,
                            orgLeft:newBoxList[boxId].left,
                            orgWidth:newBoxList[boxId].width,
                            orgHeight:newBoxList[boxId].height}
                    }
                }
            }
            return Object.assign({},state,{
                targetBox:update(
                    state.targetBox,{
                        x:{$set:action.x},
                        y:{$set:action.y},
                    }
                ),
                boxList:newBoxList
            });
        }
        case DRAG:{
            if(action.id.includes("Resizer")) return state;
            //smooth in outside
            if(action.x===0 || action.y===0) return state;
            
            let dragAreaRect=document.getElementById("dragArea").getBoundingClientRect();
            action.x=Math.min(Math.max(action.x,dragAreaRect.left),dragAreaRect.left+dragAreaRect.width);
            action.y=Math.min(Math.max(action.y,dragAreaRect.top),dragAreaRect.top+dragAreaRect.height);

            let targetBox=state.targetBox;

            let dragAmount={left:action.x-targetBox.x, top:action.y-targetBox.y};
            let topDiff=state.targetBox.realTop-state.targetBox.top;
            let leftDiff=state.targetBox.realLeft-state.targetBox.left;

            //snap top/left/width/height/selectedBoxIdList/boxlist/snapsize
            let ret=checkSnapDrag(targetBox.realTop+dragAmount.top, targetBox.realLeft+dragAmount.left,targetBox.realWidth, targetBox.realHeight, state.selectedBoxIdList,state.boxList,5);
            let topDiff2=ret.top.diff===0?ret.bottom.diff:ret.top.diff;
            let leftDiff2=ret.left.diff===0?ret.right.diff:ret.left.diff;

            let newTargetBox=targetBox;
            newTargetBox.realTop=newTargetBox.realTop+dragAmount.top;
            newTargetBox.realLeft=newTargetBox.realLeft+dragAmount.left;
            newTargetBox.top=newTargetBox.top+dragAmount.top+topDiff+topDiff2;
            newTargetBox.left=newTargetBox.left+dragAmount.left+leftDiff+leftDiff2;
            newTargetBox.x=action.x;
            newTargetBox.y=action.y;

            let changeBoxList={}
            for(let boxId in state.boxList){
                if(state.selectedBoxIdList.includes(boxId)){
                    changeBoxList={...changeBoxList,...{[boxId]:{
                        top:{$set:state.boxList[boxId].top+dragAmount.top+topDiff+topDiff2},
                        left:{$set:state.boxList[boxId].left+dragAmount.left+leftDiff+leftDiff2}
                    }}};
                }
            }
            let newBoxList=update(state.boxList,changeBoxList);

            return Object.assign({},state,{
                boxList:newBoxList,
                targetBox:newTargetBox,
                snapLine:{top:ret.top.line, bottom:ret.bottom.line, left:ret.left.line, right:ret.right.line}
            });
        }
        case DRAG_END:{
            return Object.assign({},state,{
                snapLine:{top:-1,bottom:-1,left:-1,right:-1}
            });
        }

        case RESIZE_DRAG_START:{
            let selectedBoxList=Object.filter(state.boxList, ([id,box])=>state.selectedBoxIdList.includes(id));
            let ret=getContainerRect(selectedBoxList);

            return Object.assign({}, state, {
                targetBox:update(
                    state.targetBox,{
                        top:{$set:ret.top},
                        left:{$set:ret.left},
                        width:{$set:ret.right-ret.left},
                        height:{$set:ret.bottom-ret.top},
                        realTop:{$set:ret.top},
                        realLeft:{$set:ret.left},
                        realWidth:{$set:ret.right-ret.left},
                        realHeight:{$set:ret.bottom-ret.top},
                        x:{$set:action.x},
                        y:{$set:action.y}
                    }
                )
            });
        }
        case RESIZE_DRAG:{
            if(!action.id.includes("Resizer")) return state;
            //smooth in outside
            if(action.x===0 || action.y===0) return state;
            
            let dragAreaRect=document.getElementById("dragArea").getBoundingClientRect();
            action.x=Math.min(Math.max(action.x,dragAreaRect.left),dragAreaRect.left+dragAreaRect.width);
            action.y=Math.min(Math.max(action.y,dragAreaRect.top),dragAreaRect.top+dragAreaRect.height);

            let targetBox=Object.assign({},state.targetBox);

            let dragAmount={left:action.x-targetBox.x, top:action.y-targetBox.y};
            let topDiff=state.targetBox.realTop-state.targetBox.top;
            let leftDiff=state.targetBox.realLeft-state.targetBox.left;
            let heightDiff=state.targetBox.realHeight-state.targetBox.height;
            let widthDiff=state.targetBox.realWidth-state.targetBox.width;

            //snap top/left/width/height/selectedBoxIdList/boxlist/snapsize
            let ret=checkSnapResize(targetBox.realTop+dragAmount.top, targetBox.realLeft+dragAmount.left,targetBox.realWidth, targetBox.realHeight, state.selectedBoxIdList,state.boxList,5);
            let topDiff2=ret.top.diff===0?ret.bottom.diff:ret.top.diff;
            let leftDiff2=ret.left.diff===0?ret.right.diff:ret.left.diff;

            let newTargetBox=Object.assign({},state.targetBox);
            if(action.id==="topResizer"){
                if(newTargetBox.realHeight-dragAmount.top<2) return state;
                newTargetBox.realTop=newTargetBox.realTop+dragAmount.top;
                newTargetBox.realHeight=newTargetBox.realHeight-dragAmount.top;
                newTargetBox.top=newTargetBox.top+dragAmount.top+topDiff+topDiff2;
                newTargetBox.height=newTargetBox.height-dragAmount.top+heightDiff-topDiff2;
            }
            else if(action.id==="bottomResizer"){
                if(newTargetBox.realHeight+dragAmount.top<2) return state;
                newTargetBox.realHeight=newTargetBox.realHeight+dragAmount.top;
                newTargetBox.height=newTargetBox.height+dragAmount.top+heightDiff+topDiff2;
            }
            else if(action.id==="leftResizer"){
                if(newTargetBox.realWidth-dragAmount.left<2) return state;
                newTargetBox.realLeft=newTargetBox.realLeft+dragAmount.left;
                newTargetBox.realWidth=newTargetBox.realWidth-dragAmount.left;
                newTargetBox.left=newTargetBox.left+dragAmount.left+leftDiff+leftDiff2;
                newTargetBox.width=newTargetBox.width-dragAmount.left+widthDiff-leftDiff2;
            }
            else if(action.id==="rightResizer"){
                if(newTargetBox.realWidth+dragAmount.left<2) return state;
                newTargetBox.realWidth=newTargetBox.realWidth+dragAmount.left;
                newTargetBox.width=newTargetBox.width+dragAmount.left+widthDiff+leftDiff2;
            }
            newTargetBox.x=action.x;
            newTargetBox.y=action.y;

            let changeBoxList={}
            for(let boxId in state.boxList){
                if(state.selectedBoxIdList.includes(boxId)){
                    changeBoxList={...changeBoxList,...{[boxId]:{
                        top:{$set:(state.boxList[boxId].top-targetBox.top)*(newTargetBox.height/targetBox.height)+newTargetBox.top},
                        left:{$set:(state.boxList[boxId].left-targetBox.left)*(newTargetBox.width/targetBox.width)+newTargetBox.left},
                        height:{$set:(newTargetBox.height/targetBox.height)*state.boxList[boxId].height},
                        width:{$set:(newTargetBox.width/targetBox.width)*state.boxList[boxId].width}
                    }}};
                }
            }
            let newBoxList=update(state.boxList,changeBoxList);

            return Object.assign({},state,{
                boxList:newBoxList,
                targetBox:newTargetBox,
                snapLine:{top:ret.top.line, bottom:ret.bottom.line, left:ret.left.line, right:ret.right.line}
            });
        }

        case RESIZE_DRAG_END:{
            let newTargetBox=Object.assign({},state.targetBox);
            newTargetBox.realWidth=newTargetBox.width;
            newTargetBox.realHeight=newTargetBox.height;

            return Object.assign({},state,{
                targetBox:newTargetBox
            });
        }
       
        default:{
            return state;
        }
    }
}

const counterApp = combineReducers({
    drag
});

export default counterApp;