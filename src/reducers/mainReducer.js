import * as ActionTypes from '../actions';

import {
  dragInitialState,
  targetBoxInitialState,
  snapLineInitialState,
  contextMenuInitialState,
} from './dragInitialState';

import {
  checkSnapDrag,
  checkSnapResize,
} from '../helpers/checkers';
import {
  pointWithinLayout,
  boxsToBoxSize,
  convertBoxIds,
  layoutPropToRealName,
  getChildIds,
} from '../helpers/converters';

import boxsUpdateReducer from './updateReducers/boxsUpdateReducer';
import targetBoxUpdateReducer from './updateReducers/targetBoxUpdateReducer';
import snapLineUpdateReducer from './updateReducers/snapLineUpdateReducer';

const makeGroup = (state, action) => {
  const targetBoxIds = state.getIn(['targetBox', 'ids']);
  const targetBoxs = state
    .getIn(['boxs', 'byId'])
    .filter(box => targetBoxIds.includes(box.get('id')));
  const childIds = state.getIn(['targetBox', 'childIds']);
  if (targetBoxIds.size < 2) return state;

  const id = String(state.get('idCount'));
  // box that contain all the boxs
  const newBox = boxsToBoxSize(targetBoxs);

  return state
    .update('targetBox', targetBoxUpdateReducer({ ...action, _id: id }))
    .set('contextMenu', contextMenuInitialState)
    .update('boxs', boxsUpdateReducer({ ...action, _id: id, _childIds: childIds, newBox }))
    .update('idCount', idCount => idCount + 1);
};
const unmakeGroup = (state, action) => {
  const childIds = state.getIn(['targetBox', 'childIds']);
  if (childIds.size !== 1) return state;

  const boxId = childIds.get(0);
  if (state.getIn(['boxs', 'byId', boxId, 'childIds']).size === 0) return state;

  return state
    .set('targetBox', targetBoxInitialState)
    .set('contextMenu', contextMenuInitialState)
    .update('boxs', boxsUpdateReducer({ ...action, _boxId: boxId }));
};

const targetBoxDragStart = (state, action) => {
  return state.update('targetBox', targetBoxUpdateReducer(action));
};
const targetBoxDrag = (state, action) => {
  if (action.x === 0 || action.y === 0) return state;

  const screenLayout = state.get('layout');
  const { x, y } = pointWithinLayout(action, screenLayout.toJS());

  const targetBox = state.get('targetBox').toJS();
  const dragAmount = {
    left: x - targetBox.x,
    top: y - targetBox.y,
  };

  const targetBoxIds = state.getIn(['targetBox', 'ids']);
  const nonTargetBoxs = state
    .getIn(['boxs', 'byId'])
    .filter(box => !targetBoxIds.includes(box.get('id')));
  const ret = checkSnapDrag(
    targetBox.realTop + dragAmount.top,
    targetBox.realLeft + dragAmount.left,
    targetBox.realWidth,
    targetBox.realHeight,
    nonTargetBoxs,
    process.env.REACT_APP_SNAP_SIZE
  );
  const diff = {
    top: targetBox.realTop - targetBox.top + ret.topDiff,
    left: targetBox.realLeft - targetBox.left + ret.leftDiff,
  };

  return state.withMutations(map => {
    map
      .update('targetBox', targetBoxUpdateReducer({ ...action, dragAmount, diff, x, y }))
      .update('snapLine', snapLineUpdateReducer({ ...action, line: ret }))
      .update('boxs', boxsUpdateReducer({
        ...action,
        _boxIds: targetBoxIds,
        props: {
          top: top => top + diff.top + dragAmount.top,
          left: left => left + diff.left + dragAmount.left,
        },
      }));
  });
};
const targetBoxDragEnd = (state, action) => {
  return state
    .update('targetBox', targetBoxUpdateReducer(action))
    .set('snapLine', snapLineInitialState);
};

const targetBoxResizeStart = (state, action) => {
  return state.update('targetBox', targetBoxUpdateReducer(action));
};
const targetBoxResize = (state, action) => {
  if (action.x === 0 || action.y === 0) return state;

  const screenLayout = state.get('layout');
  const { x, y } = pointWithinLayout(action, screenLayout.toJS());

  const targetBox = state.get('targetBox').toJS();
  const dragAmount = {
    left: x - targetBox.x,
    top: y - targetBox.y,
  };

  const targetBoxIds = state.getIn(['targetBox', 'ids']);
  const nonTargetBoxs = state
    .getIn(['boxs', 'byId'])
    .filter(box => !targetBoxIds.includes(box.get('id')));
  const ret = checkSnapResize(
    targetBox.realTop + dragAmount.top,
    targetBox.realLeft + dragAmount.left,
    targetBox.realWidth,
    targetBox.realHeight,
    nonTargetBoxs,
    process.env.REACT_APP_SNAP_SIZE,
    action.id
  );
  const diff = {
    top: targetBox.realTop - targetBox.top + ret.topDiff,
    left: targetBox.realLeft - targetBox.left + ret.leftDiff,
    height: targetBox.realHeight - targetBox.height + ret.topDiff,
    width: targetBox.realWidth - targetBox.width + ret.leftDiff,
  };

  return state.withMutations(map => {
    map
      .update('targetBox', targetBoxUpdateReducer({ ...action, diff, dragAmount, x, y }))
      .update('snapLine', snapLineUpdateReducer({ ...action, line: ret }));
    map.update('boxs', boxsUpdateReducer({
      ...action,
      _boxIds: targetBoxIds,
      targetBox,
      newTargetBox: map.get('targetBox').toJS(),
    }));
  });
};
const targetBoxResizeEnd = (state, action) => {
  return state
    .update('targetBox', targetBoxUpdateReducer(action))
    .set('snapLine', snapLineInitialState);
};

const deleteBox = (state, action) => {
  if (state.getIn(['targetBox', 'ids']).size === 0) return state;
  const boxIds = state.getIn(['targetBox', 'ids']);

  return state
    .set('targetBox', targetBoxInitialState)
    .set('contextMenu', contextMenuInitialState)
    .update('boxs', boxsUpdateReducer({ ...action, _boxIds: boxIds }));
};
const copyBox = state => {
  if (state.getIn(['targetBox', 'ids']).size === 0) return state;

  const selectedBoxList = state
    .getIn(['boxs', 'byId'])
    .filter((value, key) => state.getIn(['targetBox', 'ids']).includes(key));
  const ret = boxsToBoxSize(selectedBoxList);

  return state.withMutations(map =>
    map
      .setIn(['clipBoard', 'ids'], state.getIn(['targetBox', 'ids']))
      .setIn(['clipBoard', 'byId'], state.getIn(['boxs', 'byId']).filter((value, key) => state.getIn(['targetBox', 'ids']).includes(key)))
      .setIn(['clipBoard', 'top'], ret.top)
      .setIn(['clipBoard', 'left'], ret.left)
      .set('targetBox', targetBoxInitialState)
      .set('contextMenu', contextMenuInitialState)
  );
};
const pasteBox = (state, action) => {
  const { _ids, _byId, idCount } = convertBoxIds(
    state.getIn(['clipBoard', 'ids']),
    state.getIn(['clipBoard', 'byId']),
    state.get('idCount')
  );

  return state
    .update('boxs', boxsUpdateReducer({ ...action, _byId, _ids }))
    .set('idCount', idCount)
    .set('targetBox', targetBoxInitialState)
    .set('contextMenu', contextMenuInitialState);
};

const sourceDragEnd = (state, action) => {
  // drag area 안인지 판별
  const { x, y, key } = action;
  const { left, right, top, bottom, width, height } = state.get('layout').toJS();
  if (x < left || x > width - right || y < top || y > height - bottom)
    return state;

  const id = String(state.get('idCount'));
  const newBox = state.getIn(['boxSourceList', key]).toJS();
  newBox.left = x - left - process.env.REACT_APP_SOURCE_DRAG_LOCATE;
  newBox.top = y - top - process.env.REACT_APP_SOURCE_DRAG_LOCATE;

  return state
    .update('boxs', boxsUpdateReducer({ ...action, _id: id, newBox }))
    .update('idCount', idCount => idCount + 1);
};

const mouseDown = (state, action) => {
  if (action.id === '' || action.id === undefined || action.id === '0') {
    return state.set('contextMenu', contextMenuInitialState);
  }
  if (action.id === 'dragArea') {
    return state
      .set('targetBox', targetBoxInitialState)
      .set('contextMenu', contextMenuInitialState);
  }

  const ids = getChildIds(state.getIn(['boxs', 'byId']).toJS(), action.id);
  const boxs = state.getIn(['boxs', 'byId']);

  return state
    .update('targetBox', targetBoxUpdateReducer({
      ...action,
      _id: action.id,
      _ids: ids,
      _boxs: boxs,
    }))
    .set('contextMenu', contextMenuInitialState);
};
const contextMenu = (state, action) => {
  const newOptions = {
    group: true,
    ungroup: false,
    copy: false,
    paste: true,
    delete: false,
  };

  const childBoxIds = state.getIn(['targetBox', 'childIds']);
  if (childBoxIds.size === 1) {
    const id = childBoxIds.get(0);
    if (state.getIn(['boxs', 'byId', id]).get('childIds').size !== 0) {
      newOptions.ungroup = true;
    }
  }
  if (state.getIn(['targetBox', 'ids']).size >= 1) {
    newOptions.copy = true;
    newOptions.delete = true;
  }

  return state.withMutations(map =>
    map
      .setIn(['contextMenu', 'style', 'top'], action.y - state.getIn(['layout', 'top']))
      .setIn(['contextMenu', 'style', 'left'], action.x - state.getIn(['layout', 'left']))
      .setIn(['contextMenu', 'style', 'visible'], true)
      .setIn(['contextMenu', 'options', 'group'], newOptions.group)
      .setIn(['contextMenu', 'options', 'ungroup'], newOptions.ungroup)
      .setIn(['contextMenu', 'options', 'copy'], newOptions.copy)
      .setIn(['contextMenu', 'options', 'paste'], newOptions.paste)
      .setIn(['contextMenu', 'options', 'delete'], newOptions.delete)
  );
};
const resizeWindow = (state, action) => {
  return state
    .setIn(['layout', 'width'], action.width)
    .setIn(['layout', 'height'], action.height);
};

const changePage = (state, action) => {
  const currentPageId = state.get('pageId');
  if (action.pageId === currentPageId) return state;
  return state.withMutations(map =>
    map
      .set('targetBox', targetBoxInitialState)
      .set('snapLine', snapLineInitialState)
      .setIn(['pageList', currentPageId, 'boxs'], state.get('boxs'))
      .set('pageId', action.pageId)
      .set('boxs', state.getIn(['pageList', action.pageId, 'boxs']))
  );
};
const changeProp = (state, action) => {
  const { propName, propValue } = action;
  const editableProp = ['left', 'top', 'width', 'height', 'background', 'border'];
  if (!editableProp.includes(propName)) return state;
  if (['background', 'border'].includes(propName)) {
    return state.update('boxs', boxsUpdateReducer({
      ...action,
      _boxIds: state.getIn(['targetBox', 'childIds']),
      props: { [propName]: () => propValue },
    }));
  }

  const targetBox = state.get('targetBox').toJS();
  const targetBoxIds = state.getIn(['targetBox', 'ids']);
  const newTargetBox = state
    .get('targetBox')
    .set(propName, propValue)
    .set(layoutPropToRealName(propName), propValue);
  return state
    .set('targetBox', newTargetBox)
    .update('boxs', boxsUpdateReducer({
      ...action,
      _boxIds: targetBoxIds,
      targetBox,
      newTargetBox: newTargetBox.toJS(),
    }));
};

const mainReducer = (state = dragInitialState, action) => {
  switch (action.type) {
    case ActionTypes.SOURCE_DRAG_END:
      return sourceDragEnd(state, action);
    // box select
    case ActionTypes.MOUSE_DOWN:
      return mouseDown(state, action);

    case ActionTypes.CONTEXT_MENU:
      return contextMenu(state, action);

    // target box grouping
    case ActionTypes.MAKE_GROUP:
      return makeGroup(state, action);
    case ActionTypes.UNMAKE_GROUP:
      return unmakeGroup(state, action);

    // target box delete/copy/paste
    case ActionTypes.DELETE_BOX:
      return deleteBox(state, action);
    case ActionTypes.COPY_BOX:
      return copyBox(state, action);
    case ActionTypes.PASTE_BOX:
      return pasteBox(state, action);

    // target box drag
    case ActionTypes.TARGETBOX_DRAG_START:
      return targetBoxDragStart(state, action);
    case ActionTypes.TARGETBOX_DRAG:
      return targetBoxDrag(state, action);
    case ActionTypes.TARGETBOX_DRAG_END:
      return targetBoxDragEnd(state, action);

    // target box resize
    case ActionTypes.TARGETBOX_RESIZE_START:
      return targetBoxResizeStart(state, action);
    case ActionTypes.TARGETBOX_RESIZE:
      return targetBoxResize(state, action);
    case ActionTypes.TARGETBOX_RESIZE_END:
      return targetBoxResizeEnd(state, action);

    case ActionTypes.RESIZE_WINDOW:
      return resizeWindow(state, action);

    case ActionTypes.CHANGE_PAGE:
      return changePage(state, action);
    case ActionTypes.CHANGE_PROP:
      return changeProp(state, action);

    default:
      return state;
  }
};

export default mainReducer;
