import { Map, List } from 'immutable'

import { 
  SOURCE_MOUSE_DOWN, SOURCE_MOUSE_UP,
  SOURCE_DRAG_START, SOURCE_DRAG_END,
  MOUSE_DOWN,
  DRAG, DRAG_START, DRAG_END,
  CONTEXT_MENU, MAKE_GROUP, UNMAKE_GROUP, COPY_BOX, PASTE_BOX, DELETE_BOX,
  RESIZE_DRAG, RESIZE_DRAG_START, RESIZE_DRAG_END,
  RESIZE_WINDOW } from '../actions'

import { dragInitialState, targetBoxInitialState, snapLineInitialState, contextMenuInitialState } from './dragInitialState'

import { getContainerRect, getChildBoxIds, insideof, checkSnapDrag, checkSnapResize } from './helpFunctions'

const drag = (state = dragInitialState, action) => {
  switch (action.type) {
    // source box
    case SOURCE_MOUSE_DOWN: {
      return state
    }
    case SOURCE_MOUSE_UP: {
      return state
    }

    // todo : 시작할때 helper 만들고, display 바꿔서 나타내기
    // todo delete key 'x' 'y' at source drag end
    case SOURCE_DRAG_START: {
      return state
    }
    // todo
    case SOURCE_DRAG_END: {
      if (!insideof(action.x, action.y, 'dragArea')) {
        return state
      }

      let newBox = state.getIn(['boxSourceList',action.key])
      .set('top',action.y - state.get('layout').get('top') - 50)
      .set('left',action.x - state.get('layout').get('left') - 50)

      return state
      .setIn(['boxList',String(state.get('idCount'))],newBox)
      .update('boxIds',boxIds=>boxIds.push(String(state.get('idCount'))))
      .update('idCount',idCount=>idCount+1)
    }

    // normal box
    case MOUSE_DOWN: {
      if (action.id === '' || action.id === undefined) {
        return state
        .set('contextMenu',contextMenuInitialState)
      }
      if (action.id === 'dragArea') {
        return state
        .set('selectedBoxIds',List())
        .set('targetBox',targetBoxInitialState)
        .set('contextMenu',contextMenuInitialState)
      }
      if (action.id.includes('Resizer')) {
        return state
        .set('contextMenu',contextMenuInitialState)
      }
      if (action.id === '0') {
        return state
        .set('contextMenu',contextMenuInitialState)
      }

      
      let newSelectedBoxIds = (action.shift === true) ? state.get('selectedBoxIds').push(action.id) : List([action.id])
      let selectedBoxList = state.get('boxList').filter((value,key)=>newSelectedBoxIds.includes(key))
      let ret = getContainerRect(selectedBoxList)

      return state
      .set('selectedBoxIds',newSelectedBoxIds)
      .setIn(['targetBox','top'],ret.top)
      .setIn(['targetBox','left'],ret.left)
      .setIn(['targetBox','width'],ret.right-ret.left)
      .setIn(['targetBox','height'],ret.bottom-ret.top)
      .setIn(['targetBox','realTop'],ret.top)
      .setIn(['targetBox','realLeft'],ret.left)
      .setIn(['targetBox','realWidth'],ret.right-ret.left)
      .setIn(['targetBox','realHeight'],ret.bottom-ret.top)
      .set('contextMenu',contextMenuInitialState)
    }

    case CONTEXT_MENU: {
      let newOptions={
        'group':false,
        'ungroup':false,
        'copy':false,
        'paste':false,
        'delete':false
      }
      if(state.get('selectedBoxIds').size>=2){
        newOptions.group=true
      }
      if(state.get('selectedBoxIds').size===1){
        let idx=state.get('selectedBoxIds').get(0)
        if(state.getIn(['boxList',idx,'childBoxIds'])!==undefined){
          newOptions.ungroup=true
        }
      }
      if(state.get('selectedBoxIds').size>=1){
        newOptions.copy=true
        newOptions.paste=true
        newOptions.delete=true
      }

      return state
      .setIn(['contextMenu','style','top'],action.y-state.getIn(['layout','top']))
      .setIn(['contextMenu','style','left'],action.x-state.getIn(['layout','left']))
      .setIn(['contextMenu','style','visible'],true)
      .setIn(['contextMenu','options','group'],newOptions.group)
      .setIn(['contextMenu','options','ungroup'],newOptions.ungroup)
      .setIn(['contextMenu','options','copy'],newOptions.copy)
      .setIn(['contextMenu','options','paste'],newOptions.paste)
      .setIn(['contextMenu','options','delete'],newOptions.delete)
    }
    case MAKE_GROUP: {
      if (state.get('selectedBoxIds').size < 2) return state

      let tempStyle = { top: 10000, left: 10000, right: 0, bottom: 0 }
      for (let boxId of state.get('selectedBoxIds').toArray()) {
        tempStyle.top = Math.min(state.getIn(['boxList',boxId,'top']), tempStyle.top)
        tempStyle.left = Math.min(state.getIn(['boxList',boxId,'left']), tempStyle.left)
        tempStyle.right = Math.max(state.getIn(['boxList',boxId,'left']) + state.getIn(['boxList',boxId,'width']), tempStyle.right)
        tempStyle.bottom = Math.max(state.getIn(['boxList',boxId,'top']) + state.getIn(['boxList',boxId,'height']), tempStyle.bottom)
      }

      let newBox = Map({ top: tempStyle.top, left: tempStyle.left, width: tempStyle.right - tempStyle.left, height: tempStyle.bottom - tempStyle.top, background: 'transparent', childBoxIds: state.get('selectedBoxIds') })

      return state
      .set('selectedBoxIds',List([String(state.get('idCount'))]))
      .setIn(['targetBox','top'],tempStyle.top)
      .setIn(['targetBox','left'],tempStyle.left)
      .setIn(['targetBox','width'],tempStyle.right-tempStyle.left)
      .setIn(['targetBox','height'],tempStyle.bottom-tempStyle.top)
      .setIn(['targetBox','realTop'],tempStyle.top)
      .setIn(['targetBox','realLeft'],tempStyle.left)
      .setIn(['targetBox','realWidth'],tempStyle.right-tempStyle.left)
      .setIn(['targetBox','realHeight'],tempStyle.bottom-tempStyle.top)
      .set('contextMenu',contextMenuInitialState)
      .setIn(['boxList',String(state.get('idCount'))],newBox)
      .update('boxIds',boxIds=>boxIds.push(String(state.get('idCount'))))
      .update('idCount',idCount=>idCount+1)
    }
    case UNMAKE_GROUP: {
      if(state.get('selectedBoxIds').size!==1 | state.getIn(['boxList',state.getIn(['selectedBoxIds',0]),'childBoxIds'])===undefined){
        return state;
      }
      let boxId=state.getIn(['selectedBoxIds',0])

      return state
      .set('selectedBoxIds',List())
      .set('targetBox',targetBoxInitialState)
      .set('contextMenu',contextMenuInitialState)
      .update('boxIds',boxIds=>boxIds.filter((value)=>value!==boxId))
      .update('boxList',boxList=>boxList.filter((value,id)=>id!==boxId))
    }
    case DELETE_BOX: {
      if(state.get('selectedBoxIds').size===0){
        return state;
      }
      let newBoxIds=getChildBoxIds(state.get('boxList'),state.get('selectedBoxIds'))

      return state
      .set('selectedBoxIds',List())
      .set('targetBox',targetBoxInitialState)
      .set('contextMenu',contextMenuInitialState)
      .update('boxIds',boxIds=>boxIds.filter((value)=>!newBoxIds.includes(value)))
      .update('boxList',boxList=>boxList.filter((value,id)=>!newBoxIds.includes(id)))
    }

    // target box
    case DRAG_START: {
      return state
      .setIn(['targetBox','x'],action.x)
      .setIn(['targetBox','y'],action.y)
      .update('boxList',boxList=>boxList.map((value,key)=>{
        if(state.get('selectedBoxIds').includes(key)){
          return value
          .set('orgTop',state.getIn(['boxList',key,'top']))
          .set('orgLeft',state.getIn(['boxList',key,'left']))
          .set('orgWidth',state.getIn(['boxList',key,'width']))
          .set('orgHeight',state.getIn(['boxList',key,'height']))
        }
        return value
      }))
    }
    case DRAG: {
      if (action.id.includes('Resizer')) return state
      if (action.x === 0 || action.y === 0) return state

      let dragAreaRect = document.getElementById('dragArea').getBoundingClientRect()
      action.x = Math.min(Math.max(action.x, dragAreaRect.left), dragAreaRect.left + dragAreaRect.width)
      action.y = Math.min(Math.max(action.y, dragAreaRect.top), dragAreaRect.top + dragAreaRect.height)

      let targetBox = state.get('targetBox').toObject()
      let dragAmount = { left: action.x - targetBox.x, top: action.y - targetBox.y }
      let topDiff = targetBox.realTop - targetBox.top
      let leftDiff = targetBox.realLeft - targetBox.left

      let allSelectedBoxIds = getChildBoxIds(state.get('boxList'),state.get('selectedBoxIds'))
      let ret = checkSnapDrag(targetBox.realTop + dragAmount.top, targetBox.realLeft + dragAmount.left, targetBox.realWidth, targetBox.realHeight, allSelectedBoxIds, state.get('boxList'), 5)
      let topDiff2 = ret.top.diff === 0 ? ret.bottom.diff : ret.top.diff
      let leftDiff2 = ret.left.diff === 0 ? ret.right.diff : ret.left.diff

      let newState= state
      .updateIn(['targetBox','realTop'],realTop=>realTop+dragAmount.top)
      .updateIn(['targetBox','realLeft'],realLeft=>realLeft+dragAmount.left)
      .updateIn(['targetBox','top'],top=>top+dragAmount.top+topDiff+topDiff2)
      .updateIn(['targetBox','left'],left=>left+dragAmount.left+leftDiff+leftDiff2)
      .setIn(['targetBox','x'],action.x)
      .setIn(['targetBox','y'],action.y)
      .setIn(['snapLine','top'],ret.top.line)
      .setIn(['snapLine','topBottom'],ret.topBottom.line)
      .setIn(['snapLine','bottom'],ret.bottom.line)
      .setIn(['snapLine','left'],ret.left.line)
      .setIn(['snapLine','right'],ret.right.line)
      .setIn(['snapLine','leftRight'],ret.leftRight.line)

      for(let boxId of allSelectedBoxIds){
        newState=newState
        .updateIn(['boxList',boxId,'top'],top=>top+dragAmount.top+topDiff+topDiff2)
        .updateIn(['boxList',boxId,'left'],left=>left+dragAmount.left+leftDiff+leftDiff2)
      }
      return newState
    }
    case DRAG_END: {
      return state
      .set('snapLine',snapLineInitialState)
    }

    case RESIZE_DRAG_START: {
      let ret = getContainerRect(state.get('boxList').filter((value,key)=>state.get('selectedBoxIds').includes(key)))

      return state
      .setIn(['targetBox','top'],ret.top)
      .setIn(['targetBox','left'],ret.left)
      .setIn(['targetBox','width'],ret.right-ret.left)
      .setIn(['targetBox','height'],ret.bottom-ret.top)
      .setIn(['targetBox','realTop'],ret.top)
      .setIn(['targetBox','realLeft'],ret.left)
      .setIn(['targetBox','realWidth'],ret.right-ret.left)
      .setIn(['targetBox','realHeight'],ret.bottom-ret.top)
      .setIn(['targetBox','x'],action.x)
      .setIn(['targetBox','y'],action.y)
    }
    case RESIZE_DRAG: {
      if (!action.id.includes('Resizer')) return state
      if (action.x === 0 || action.y === 0) return state

      let dragAreaRect = document.getElementById('dragArea').getBoundingClientRect()
      action.x = Math.min(Math.max(action.x, dragAreaRect.left), dragAreaRect.left + dragAreaRect.width)
      action.y = Math.min(Math.max(action.y, dragAreaRect.top), dragAreaRect.top + dragAreaRect.height)

      let targetBox = state.get('targetBox').toObject()
      let dragAmount = { left: action.x - targetBox.x, top: action.y - targetBox.y }
      let topDiff = targetBox.realTop - targetBox.top
      let leftDiff = targetBox.realLeft - targetBox.left
      let heightDiff = targetBox.realHeight - targetBox.height
      let widthDiff = targetBox.realWidth - targetBox.width

      let allSelectedBoxIds = getChildBoxIds(state.get('boxList'), state.get('selectedBoxIds'))
      let ret = checkSnapResize(targetBox.realTop + dragAmount.top, targetBox.realLeft + dragAmount.left, targetBox.realWidth, targetBox.realHeight, allSelectedBoxIds, state.get('boxList'), 5)
      let topDiff2 = ret.top.diff === 0 ? ret.bottom.diff : ret.top.diff
      let leftDiff2 = ret.left.diff === 0 ? ret.right.diff : ret.left.diff

      let newTargetBox = state.get('targetBox')
      if (action.id === 'topResizer') {
        if (newTargetBox.get('realHeight') - dragAmount.top < 2) return state
        newTargetBox=newTargetBox
        .update('realTop',realTop=>realTop+dragAmount.top)
        .update('realHeight',realHeight=>realHeight-dragAmount.top)
        .update('top',top=>top+dragAmount.top+topDiff+topDiff2)
        .update('height',height=>height-dragAmount.top+heightDiff-topDiff2)
      } else if (action.id === 'bottomResizer') {
        if (newTargetBox.get('realHeight') + dragAmount.top < 2) return state
        newTargetBox=newTargetBox
        .update('realHeight',realHeight=>realHeight+dragAmount.top)
        .update('height',height=>height+dragAmount.top+heightDiff+topDiff2)
      } else if (action.id === 'leftResizer') {
        if (newTargetBox.get('realWidth') - dragAmount.left < 2) return state
        newTargetBox=newTargetBox
        .update('realLeft',realLeft=>realLeft+dragAmount.left)
        .update('realWidth',realWidth=>realWidth-dragAmount.left)
        .update('left',left=>left+dragAmount.left+leftDiff+leftDiff2)
        .update('width',width=>width-dragAmount.left+widthDiff-leftDiff2)
      } else if (action.id === 'rightResizer') {
        if (newTargetBox.get('realWidth') + dragAmount.left < 2) return state
        newTargetBox=newTargetBox
        .update('realWidth',realWidth=>realWidth+dragAmount.left)
        .update('width',width=>width+dragAmount.left+widthDiff+leftDiff2)
      }
      newTargetBox=newTargetBox
      .set('x',action.x)
      .set('y',action.y)

      let newState= state
      .set('targetBox',newTargetBox)
      .setIn(['snapLine','top'],ret.top.line)
      .setIn(['snapLine','bottom'],ret.bottom.line)
      .setIn(['snapLine','topBottom'],ret.topBottom.line)
      .setIn(['snapLine','left'],ret.left.line)
      .setIn(['snapLine','right'],ret.right.line)
      .setIn(['snapLine','leftRight'],ret.leftRight.line)

      newTargetBox=newTargetBox.toObject()
      for(let boxId of allSelectedBoxIds){
        newState=newState
        .updateIn(['boxList',boxId,'top'],top=>(top-targetBox.top)*(newTargetBox.height/targetBox.height)+newTargetBox.top)
        .updateIn(['boxList',boxId,'left'],left=>(left-targetBox.left)*(newTargetBox.width/targetBox.width)+newTargetBox.left)
        .updateIn(['boxList',boxId,'height'],height=>(newTargetBox.height/targetBox.height)*height)
        .updateIn(['boxList',boxId,'width'],width=>(newTargetBox.width/targetBox.width)*width)
      }
      return newState
    }

    case RESIZE_DRAG_END: {
      return state
      .setIn(['targetBox','realWidth'],state.getIn(['targetBox','width']))
      .setIn(['targetBox','realHeight'],state.getIn(['targetBox','height']))
    }

    case RESIZE_WINDOW: {
      return state
      .setIn(['layout', 'screenWidth'],action.screenWidth)
      .setIn(['layout', 'screenHeight'],action.screenHeight)
    }

    default: {
      return state
    }
  }
}

export default drag
