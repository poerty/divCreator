import { Map } from 'immutable';

import * as ActionTypes from '../../actions';

const createBox = action => state => {
  const { _id, _childIds = [], newBox } = action;
  newBox.id = _id;
  newBox.childIds = _childIds;
  if (!newBox.background) newBox.background = 'transparent';

  return state
    .update('ids', ids => ids.push(_id))
    .setIn(['byId', _id], Map(newBox));
};

const addBoxs = action => state => {
  const { _byId, _ids } = action;
  return state
    .update('ids', ids => ids.concat(_ids))
    .update('byId', byId => byId.concat(_byId));
};

const deleteBox = action => state => {
  const { _boxId } = action;
  return state
    .updateIn(['ids'], ids => ids.filter(id => id !== _boxId))
    .deleteIn(['byId', _boxId]);
};

const deleteBoxs = action => state => {
  const { _boxIds } = action;
  return state
    .updateIn(['ids'], ids => ids.filter(value => !_boxIds.includes(value)))
    .updateIn(['byId'], byId =>
      byId
        .filter((value, id) => !_boxIds.includes(id))
        .map(
          box =>
            (box = box.update('childIds', childIds =>
              childIds.filter(childId => !_boxIds.includes(childId))
            ))
        )
    );
};

const updateBoxs = action => state => {
  const { _boxIds, props = {}, targetBox, newTargetBox } = action;
  if (targetBox && newTargetBox) {
    props.left = left => (left - targetBox.left) * (newTargetBox.width / targetBox.width) + newTargetBox.left;
    props.top = top => (top - targetBox.top) * (newTargetBox.height / targetBox.height) + newTargetBox.top;
    props.width = width => (newTargetBox.width / targetBox.width) * width;
    props.height = height => (newTargetBox.height / targetBox.height) * height;
  }
  return state.withMutations(map => {
    _boxIds.forEach(id => {
      Object.keys(props).forEach(propName => {
        map.updateIn(['byId', id, propName], props[propName]);
      });
    });
  });
};

const boxsUpdateReducer = action => {
  switch (action.type) {
    case ActionTypes.SOURCE_DRAG_END:
      return createBox(action);

    // target box grouping
    case ActionTypes.MAKE_GROUP:
      return createBox(action);
    case ActionTypes.UNMAKE_GROUP:
      return deleteBox(action);

    // target box delete/copy/paste
    case ActionTypes.DELETE_BOX:
      return deleteBoxs(action);
    case ActionTypes.PASTE_BOX:
      return addBoxs(action);

    // target box drag
    case ActionTypes.TARGETBOX_DRAG:
      return updateBoxs(action);

    // target box resize
    case ActionTypes.TARGETBOX_RESIZE:
      return updateBoxs(action);

    case ActionTypes.CHANGE_PROP:
      return updateBoxs(action);

    default:
      return state => state;
  }
};

export default boxsUpdateReducer;
