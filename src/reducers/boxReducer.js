import { List, Map } from 'immutable'

import { 
  SOURCE_DRAG_END,
  MOUSE_DOWN,
  TARGETBOX_DRAG, TARGETBOX_DRAG_START, TARGETBOX_DRAG_END, TARGETBOX_RESIZE, TARGETBOX_RESIZE_START, TARGETBOX_RESIZE_END,
  CONTEXT_MENU, MAKE_GROUP, UNMAKE_GROUP, COPY_BOX, PASTE_BOX, DELETE_BOX,
  RESIZE_WINDOW, 
  CHANGE_TAB, CHANGE_PAGE,
} from '../actions'

import { dragInitialState, targetBoxInitialState, snapLineInitialState, boxHierarchyInitialState, contextMenuInitialState } from './dragInitialState'
import { getHierarchy, getContainerRect, getChildBoxIds, checkSnapDrag, checkSnapResize } from './helpFunctions'

const makeGroup = (state, action) => {
  if (state.get('selectedBoxIds').size < 2) return state

  let tempStyle = { top: 10000, left: 10000, right: 0, bottom: 0 }
  for (let boxId of state.get('selectedBoxIds').toArray()) {
    tempStyle.top = Math.min(state.getIn(['boxData','boxList',boxId,'top']), tempStyle.top)
    tempStyle.left = Math.min(state.getIn(['boxData','boxList',boxId,'left']), tempStyle.left)
    tempStyle.right = Math.max(state.getIn(['boxData','boxList',boxId,'left']) + state.getIn(['boxData','boxList',boxId,'width']), tempStyle.right)
    tempStyle.bottom = Math.max(state.getIn(['boxData','boxList',boxId,'top']) + state.getIn(['boxData','boxList',boxId,'height']), tempStyle.bottom)
  }

  let newBox = Map({ top: tempStyle.top, left: tempStyle.left, width: tempStyle.right - tempStyle.left, height: tempStyle.bottom - tempStyle.top, background: 'transparent', childBoxIds: state.get('selectedBoxIds') })

  let newBox_boxHierarchy = Map({
    boxIds: state.get('selectedBoxIds').reduce((map,key)=>map.concat(state.getIn(['boxData','boxHierarchy',key,'boxIds'])),state.get('selectedBoxIds')),
    boxHierarchy: state.get('selectedBoxIds').reduce((map,key)=>map.set(key,state.getIn(['boxData','boxHierarchy',key])),Map({}))
  })
  let newBoxHierarchy = state.get('selectedBoxIds').reduce((map,key)=>map.delete(key),state.getIn(['boxData','boxHierarchy']))
  newBoxHierarchy = newBoxHierarchy.set(String(state.get('idCount')),newBox_boxHierarchy)

  return state.withMutations(map=>map
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
    .setIn(['boxData','boxList',String(state.get('idCount'))],newBox)
    .updateIn(['boxData','boxIds'],boxIds=>boxIds.push(String(state.get('idCount'))))
    .setIn(['boxData','boxHierarchy'],newBoxHierarchy)
    .update('idCount',idCount=>idCount+1)
  )
}
const unmakeGroup = (state, action) => {
  if(state.get('selectedBoxIds').size!==1) return state
  
  let boxId=state.getIn(['selectedBoxIds',0])
  if(getHierarchy(state.getIn(['boxData','boxHierarchy']),boxId).get('boxIds').size===0) return state

  return state.withMutations(map=>map
    .set('selectedBoxIds',List())
    .set('targetBox',targetBoxInitialState)
    .set('contextMenu',contextMenuInitialState)
    .updateIn(['boxData','boxIds'],boxIds=>boxIds.filter((value)=>value!==boxId))
    .deleteIn(['boxData','boxList',boxId])
    .updateIn(['boxData','boxHierarchy'],boxHierarchy=>boxHierarchy.concat(state.getIn(['boxData','boxHierarchy',boxId,'boxHierarchy'])))
    .deleteIn(['boxData','boxHierarchy',boxId])
  )
}

const targetBoxDragStart = (state, action) => {
  return state.withMutations(map=>map
    .setIn(['targetBox','x'],action.x)
    .setIn(['targetBox','y'],action.y)
    .updateIn(['boxData','boxList'],boxList=>boxList.map((value,key)=>{
      if(state.get('selectedBoxIds').includes(key)){
        return value
        .set('orgTop',state.getIn(['boxData','boxList',key,'top']))
        .set('orgLeft',state.getIn(['boxData','boxList',key,'left']))
        .set('orgWidth',state.getIn(['boxData','boxList',key,'width']))
        .set('orgHeight',state.getIn(['boxData','boxList',key,'height']))
      }
      return value
    }))
  )
}
const targetBoxDrag = (state, action) => {
  if (action.id.includes('Resizer')) return state
  if (action.x === 0 || action.y === 0) return state

  let dragAreaRect = document.getElementById('dragArea').getBoundingClientRect()
  action.x = Math.min(Math.max(action.x, dragAreaRect.left), dragAreaRect.left + dragAreaRect.width)
  action.y = Math.min(Math.max(action.y, dragAreaRect.top), dragAreaRect.top + dragAreaRect.height)

  let targetBox = state.get('targetBox').toObject()
  let dragAmount = { left: action.x - targetBox.x, top: action.y - targetBox.y }
  let topDiff = targetBox.realTop - targetBox.top
  let leftDiff = targetBox.realLeft - targetBox.left

  let allSelectedBoxIds = getChildBoxIds(state.getIn(['boxData','boxHierarchy']),state.get('selectedBoxIds'))
  let ret = checkSnapDrag(targetBox.realTop + dragAmount.top, targetBox.realLeft + dragAmount.left, targetBox.realWidth, targetBox.realHeight, allSelectedBoxIds, state.getIn(['boxData','boxList']), 5)
  let topDiff2 = ret.top.diff === 0 ? (ret.bottom.diff === 0 ? ret.topBottom.diff : ret.bottom.diff) : ret.top.diff
  let leftDiff2 = ret.left.diff === 0 ? (ret.right.diff === 0 ? ret.leftRight.diff : ret.right.diff) : ret.left.diff

  let newState= state.withMutations(map=>map
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
  )

  for(let boxId of allSelectedBoxIds){
    newState=newState.withMutations(map=>map
      .updateIn(['boxData','boxList',boxId,'top'],top=>top+dragAmount.top+topDiff+topDiff2)
      .updateIn(['boxData','boxList',boxId,'left'],left=>left+dragAmount.left+leftDiff+leftDiff2)
    )
  }
  return newState
}
const targetBoxDragEnd = (state, action) => {
  return state
  .set('snapLine',snapLineInitialState)
}

const targetBoxResizeStart = (state, action) => {
  let ret = getContainerRect(state.getIn(['boxData','boxList']).filter((value,key)=>state.get('selectedBoxIds').includes(key)))

  return state.withMutations(map=>map
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
  )
}
const targetBoxResize = (state, action) => {
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

  let allSelectedBoxIds = getChildBoxIds(state.getIn(['boxData','boxHierarchy']), state.get('selectedBoxIds'))
  let ret = checkSnapResize(targetBox.realTop + dragAmount.top, targetBox.realLeft + dragAmount.left, targetBox.realWidth, targetBox.realHeight, allSelectedBoxIds, state.getIn(['boxData','boxList']), 5, action.id)
  let topDiff2 = ret.top.diff === 0 ? (ret.bottom.diff === 0 ? ret.topBottom.diff : ret.bottom.diff) : ret.top.diff
  let leftDiff2 = ret.left.diff === 0 ? (ret.right.diff === 0 ? ret.leftRight.diff : ret.right.diff) : ret.left.diff

  let newTargetBox = state.get('targetBox')
  if (action.id === 'topResizer') {
    if (newTargetBox.get('realHeight') - dragAmount.top < 2) return state
    newTargetBox=newTargetBox.withMutations(map=>map
      .update('realTop',realTop=>realTop+dragAmount.top)
      .update('realHeight',realHeight=>realHeight-dragAmount.top)
      .update('top',top=>top+dragAmount.top+topDiff+topDiff2)
      .update('height',height=>height-dragAmount.top+heightDiff-topDiff2)
    )
  } else if (action.id === 'bottomResizer') {
    if (newTargetBox.get('realHeight') + dragAmount.top < 2) return state
    newTargetBox=newTargetBox.withMutations(map=>map
      .update('realHeight',realHeight=>realHeight+dragAmount.top)
      .update('height',height=>height+dragAmount.top+heightDiff+topDiff2)
    )
  } else if (action.id === 'leftResizer') {
    if (newTargetBox.get('realWidth') - dragAmount.left < 2) return state
    newTargetBox=newTargetBox.withMutations(map=>map
      .update('realLeft',realLeft=>realLeft+dragAmount.left)
      .update('realWidth',realWidth=>realWidth-dragAmount.left)
      .update('left',left=>left+dragAmount.left+leftDiff+leftDiff2)
      .update('width',width=>width-dragAmount.left+widthDiff-leftDiff2)
    )
  } else if (action.id === 'rightResizer') {
    if (newTargetBox.get('realWidth') + dragAmount.left < 2) return state
    newTargetBox=newTargetBox.withMutations(map=>map
      .update('realWidth',realWidth=>realWidth+dragAmount.left)
      .update('width',width=>width+dragAmount.left+widthDiff+leftDiff2)
    )
  }
  newTargetBox=newTargetBox.withMutations(map=>map
    .set('x',action.x)
    .set('y',action.y)
  )

  let newState= state.withMutations(map=>map
    .set('targetBox',newTargetBox)
    .setIn(['snapLine','top'],ret.top.line)
    .setIn(['snapLine','bottom'],ret.bottom.line)
    .setIn(['snapLine','topBottom'],ret.topBottom.line)
    .setIn(['snapLine','left'],ret.left.line)
    .setIn(['snapLine','right'],ret.right.line)
    .setIn(['snapLine','leftRight'],ret.leftRight.line)
  )

  newTargetBox=newTargetBox.toObject()
  for(let boxId of allSelectedBoxIds){
    newState=newState.withMutations(map=>map
      .updateIn(['boxData','boxList',boxId,'top'],top=>(top-targetBox.top)*(newTargetBox.height/targetBox.height)+newTargetBox.top)
      .updateIn(['boxData','boxList',boxId,'left'],left=>(left-targetBox.left)*(newTargetBox.width/targetBox.width)+newTargetBox.left)
      .updateIn(['boxData','boxList',boxId,'height'],height=>(newTargetBox.height/targetBox.height)*height)
      .updateIn(['boxData','boxList',boxId,'width'],width=>(newTargetBox.width/targetBox.width)*width)
    )
  }
  return newState
}
const targetBoxResizeEnd = (state, action) => {
  return state.withMutations(map=>map
    .setIn(['targetBox','realWidth'],state.getIn(['targetBox','width']))
    .setIn(['targetBox','realHeight'],state.getIn(['targetBox','height']))
  )
}

const deleteBox = (state, action) => {
  if(state.get('selectedBoxIds').size===0){
    return state;
  }
  let newBoxIds=getChildBoxIds(state.getIn(['boxData','boxHierarchy']),state.get('selectedBoxIds'))
  let newBoxHierarchy=state.getIn(['boxData','boxHierarchy'])

  let deleteBoxHierarchy = (boxHierarchy,id)=>{
    if(boxHierarchy.size===0) return boxHierarchy
    if(boxHierarchy.get(id)!==undefined){
      return boxHierarchy.delete(id)
    }
    let newBoxHierarchy = boxHierarchy
    
    boxHierarchy
    .filter((value,key)=>value.get('boxIds').includes(id))
    .forEach((value,key)=>{
      newBoxHierarchy=newBoxHierarchy
      .updateIn([key,'boxIds'],boxIds=>boxIds.filter((value,key)=>value!==id))
      .updateIn([key,'boxHierarchy'],boxHierarchy=>deleteBoxHierarchy(boxHierarchy,id))
    })

    return newBoxHierarchy
  }
  newBoxHierarchy = newBoxIds.reduce((map,key)=>deleteBoxHierarchy(map,key),state.getIn(['boxData','boxHierarchy']))

  return state.withMutations(map=>map
    .set('selectedBoxIds',List())
    .set('targetBox',targetBoxInitialState)
    .set('contextMenu',contextMenuInitialState)
    .updateIn(['boxData','boxIds'],boxIds=>boxIds.filter((value)=>!newBoxIds.includes(value)))
    .updateIn(['boxData','boxList'],boxList=>boxList.filter((value,id)=>!newBoxIds.includes(id)))
    .setIn(['boxData','boxHierarchy'],newBoxHierarchy)
  )
}
const copyBox = (state, action) => {
  if(state.get('selectedBoxIds').size===0){
    return state;
  }

  let selectedBoxList = state.getIn(['boxData','boxList']).filter((value,key)=>state.get('selectedBoxIds').includes(key))
  let ret = getContainerRect(selectedBoxList)

  return state.withMutations(map=>map
    .setIn(['clipBoard','boxIds'],getChildBoxIds(state.getIn(['boxData','boxHierarchy']),state.get('selectedBoxIds')))
    .setIn(['clipBoard','boxHierarchy'],state.getIn(['boxData','boxHierarchy']).filter((value,key)=>state.get('selectedBoxIds').includes(key)))
    .setIn(['clipBoard','boxList'],state.getIn(['boxData','boxList']).filter((value,key)=>getChildBoxIds(state.getIn(['boxData','boxHierarchy']),state.get('selectedBoxIds')).includes(key)))
    .setIn(['clipBoard','top'],ret.top)
    .setIn(['clipBoard','left'],ret.left)
    .set('targetBox',targetBoxInitialState)
    .set('contextMenu',contextMenuInitialState)
  )
}
const pasteBox = (state, action) => {
  let idCount=state.get('idCount')
  let changeBoxIdHierarchy = (boxHierarchy,id,newId)=>{
    if(boxHierarchy.size===0) return boxHierarchy
    if(boxHierarchy.get(id)!==undefined){
      return boxHierarchy.mapKeys(k=>{
        if(k===id) return String(newId)
        return String(k)
      })
    }
    let newBoxHierarchy = boxHierarchy
    
    boxHierarchy
    .filter((value,key)=>value.get('boxIds').includes(id))
    .forEach((value,key)=>{
      newBoxHierarchy=newBoxHierarchy
      .updateIn([key,'boxIds'],boxIds=>boxIds.map((k)=>{
        if(k===id) return String(newId)
        return String(k)
      }))
      .updateIn([key,'boxHierarchy'],boxHierarchy=>changeBoxIdHierarchy(boxHierarchy,id,newId))
    })

    return newBoxHierarchy
  }

  let newState=state
  state.getIn(['clipBoard','boxIds'])
  .forEach((id,key)=>{
    let newId=idCount++
    newState=newState
    .updateIn(['clipBoard','boxIds'],boxIds=>boxIds.map(boxId=>{
      if(boxId===id) return String(newId)
      return String(boxId)
    }))
    .updateIn(['clipBoard','boxList'],boxList=>boxList.mapKeys(boxId=>{
      if(boxId===id) return String(newId)
      return String(boxId)
    }))
    let newBoxHierarchy = changeBoxIdHierarchy(newState.getIn(['clipBoard','boxHierarchy']),id,newId)
    newState=newState
    .setIn(['clipBoard','boxHierarchy'],newBoxHierarchy)
  })

  newState=newState
  .updateIn(['clipBoard','boxList'],boxList=>boxList.map((value,key)=>{
    return value.withMutations(map=>map
      .update('top',top=>top+state.getIn(['contextMenu','style','top'])-state.getIn(['clipBoard','top']))
      .update('left',left=>left+state.getIn(['contextMenu','style','left'])-state.getIn(['clipBoard','left']))
    )
  }))
  
  return state.withMutations(map=>map
    .set('targetBox',targetBoxInitialState)
    .set('contextMenu',contextMenuInitialState)
    .updateIn(['boxData','boxIds'],boxIds=>boxIds.concat(newState.getIn(['clipBoard','boxIds'])))
    .updateIn(['boxData','boxHierarchy'],boxHierarchy=>boxHierarchy.merge(newState.getIn(['clipBoard','boxHierarchy'])))
    .updateIn(['boxData','boxList'],boxList=>boxList.merge(newState.getIn(['clipBoard','boxList'])))
    .set('idCount',idCount)
  )
}

const sourceDragEnd = (state, action) => {
  //drag area 안인지 판별
  let layout=state.get('layout').toJS()
  if(action.x<layout.left || action.x>layout.screenWidth-layout.right || action.y<layout.top || action.y>layout.screenHeight-layout.bottom){
    return state
  }

  let newBox = state.getIn(['boxSourceList',action.key])
  .set('top',action.y - layout.top - 50)
  .set('left',action.x - layout.left - 50)

  return state.withMutations(map=>map
    .setIn(['boxData','boxList',String(state.get('idCount'))],newBox)
    .updateIn(['boxData','boxIds'],boxIds=>boxIds.push(String(state.get('idCount'))))
    .setIn(['boxData','boxHierarchy',String(state.get('idCount'))],boxHierarchyInitialState)
    .update('idCount',idCount=>idCount+1)
  )
}
const mouseDown = (state, action) => {
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
  let selectedBoxList = state.getIn(['boxData','boxList']).filter((value,key)=>newSelectedBoxIds.includes(key))
  let ret = getContainerRect(selectedBoxList)

  return state.withMutations(map=>map
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
  )
}
const contextMenu = (state, action) => {
  let newOptions={
    'group':false,
    'ungroup':false,
    'copy':false,
    'paste':true,
    'delete':false
  }
  if(state.get('selectedBoxIds').size>=2){
    newOptions.group=true
  }
  if(state.get('selectedBoxIds').size===1){
    let id=state.getIn(['selectedBoxIds',0])
    if(getHierarchy(state.getIn(['boxData','boxHierarchy']),id).get('boxIds').size!==0){
      newOptions.ungroup=true
    }
  }
  if(state.get('selectedBoxIds').size>=1){
    newOptions.copy=true
    newOptions.delete=true
  }

  return state.withMutations(map=>map
    .setIn(['contextMenu','style','top'],action.y-state.getIn(['layout','top']))
    .setIn(['contextMenu','style','left'],action.x-state.getIn(['layout','left']))
    .setIn(['contextMenu','style','visible'],true)
    .setIn(['contextMenu','options','group'],newOptions.group)
    .setIn(['contextMenu','options','ungroup'],newOptions.ungroup)
    .setIn(['contextMenu','options','copy'],newOptions.copy)
    .setIn(['contextMenu','options','paste'],newOptions.paste)
    .setIn(['contextMenu','options','delete'],newOptions.delete)
  )
}
const resizeWindow = (state, action) => {
  return state.withMutations(map=>map
    .setIn(['layout', 'screenWidth'],action.screenWidth)
    .setIn(['layout', 'screenHeight'],action.screenHeight)
  )
}

const changeTab = (state, action) => {
  return state
  .setIn(['layoutTabs',action.layoutName],action.tabName)
}
const changePage = (state, action) => {
  let currentPageId=state.get('pageId')
  if(action.pageId===currentPageId) return state
  return state.withMutations(map=>map
    .set('selectedBoxIds',List([]))
    .set('targetBox',targetBoxInitialState)
    .set('snapLine',snapLineInitialState)
    .setIn(['pageList',currentPageId,'boxData'],state.get('boxData'))
    .set('pageId',action.pageId)
    .set('boxData',state.getIn(['pageList',action.pageId,'boxData']))
  )
}

const boxReducer = (state = dragInitialState, action) => {
  switch (action.type) {
    case SOURCE_DRAG_END: return sourceDragEnd(state,action)
    // box select
    case MOUSE_DOWN: return mouseDown(state,action)

    case CONTEXT_MENU: return contextMenu(state,action)

    //target box grouping
    case MAKE_GROUP: return makeGroup(state,action)
    case UNMAKE_GROUP: return unmakeGroup(state,action)

    // target box delete/copy/paste
    case DELETE_BOX: return deleteBox(state,action)
    case COPY_BOX: return copyBox(state,action)
    case PASTE_BOX: return pasteBox(state,action)

    // target box drag
    case TARGETBOX_DRAG_START: return targetBoxDragStart(state,action)
    case TARGETBOX_DRAG: return targetBoxDrag(state,action)
    case TARGETBOX_DRAG_END: return targetBoxDragEnd(state,action)

    // target box resize
    case TARGETBOX_RESIZE_START: return targetBoxResizeStart(state,action)
    case TARGETBOX_RESIZE: return targetBoxResize(state,action)
    case TARGETBOX_RESIZE_END: return targetBoxResizeEnd(state,action)

    case RESIZE_WINDOW: return resizeWindow(state,action)

    case CHANGE_TAB: return changeTab(state,action)
    case CHANGE_PAGE: return changePage(state,action)

    default: return state
  }
}

export default boxReducer
