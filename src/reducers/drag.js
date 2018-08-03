import update from 'react-addons-update';

import { SOURCE_MOUSE_DOWN, SOURCE_MOUSE_UP, SOURCE_DRAG_START, SOURCE_DRAG_END } from '../actions';
import { MOUSE_DOWN, DRAG, DRAG_START, DRAG_END } from '../actions';
import { RESIZE_DRAG, RESIZE_DRAG_START, RESIZE_DRAG_END } from '../actions';
import { RESIZE_WINDOW } from '../actions';

import { dragInitialState } from './dragInitialState';

import { getContainerRect, insideof, checkSnapDrag, checkSnapResize } from './helpFunctions';

Object.from = arr => Object.assign(...arr.map( ([k, v]) => ({[k]: v}) ));
Object.filter = (obj, predicate) => Object.from(Object.entries(obj).filter(predicate));

const drag = (state = dragInitialState, action) => {
    switch(action.type) {
        //source box
        case SOURCE_MOUSE_DOWN:{
            return state;

        }
        case SOURCE_MOUSE_UP:{
            return state;

        }

        //todo : 시작할때 helper 만들고, display 바꿔서 나타내기
        //todo delete key 'x' 'y' at source drag end
        case SOURCE_DRAG_START:{
            return state;
        }
        //todo
        case SOURCE_DRAG_END:{
            if(!insideof(action.x,action.y,"dragArea")){
                return state;
            }

            let newBox=Object.assign({},state.boxSourceList[action.key]);
            newBox.top=action.y-state.layout.top-50;
            newBox.left=action.x-state.layout.left-50;

            return Object.assign({},state,{
                boxList:Object.assign({},state.boxList,{
                    [state.idCount]:newBox
                }),
                boxIds:[...state.boxIds,state.idCount],
                idCount:state.idCount+1
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

        //target box
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

        case RESIZE_WINDOW:{
            return Object.assign( {}, state, {
                layout:update(
                    state.layout,
                    {
                        screenWidth:{$set:action.screenWidth},
                        screenHeight:{$set:action.screenHeight}
                    }
                )
            });
        }
       
        default:{
            return state;
        }
    }
}

export default drag;