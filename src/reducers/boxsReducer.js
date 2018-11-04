import { List, Map } from "immutable";

import * as ActionTypes from "../actions";

import { boxsInitialState } from "./dragInitialState";

const createBox = (state, action) => {
  const { _id, _childIds = [], newBox } = action
  newBox.id = _id
  newBox.childIds = _childIds
  if (!newBox.background) newBox.background = 'transparent'

  return state
    .update('ids', ids => ids.push(_id))
    .setIn(['byId', _id], Map(newBox))
}

const addBoxs = (state, action) => {
  const { _byId, _ids } = action
  return state
    .update('ids', ids => ids.concat(_ids))
    .update('byId', byId => byId.concat(_byId))
}

const deleteBox = (state, action) => {
  const { _boxId } = action
  return state
    .updateIn(["ids",], ids => ids.filter(id => id !== _boxId))
    .deleteIn(["byId", _boxId,])
}

const deleteBoxs = (state, action) => {
  const { _boxIds } = action
  return state
    .updateIn(["ids",], ids => ids.filter(value => !_boxIds.includes(value)))
    .updateIn(["byId",], byId =>
      byId
        .filter((value, id) => !_boxIds.includes(id))
        .map(box =>
          box = box.update("childIds",
            childIds => childIds.filter(childId => !_boxIds.includes(childId)))
        )
    )
}

const updateBoxs = (state, action) => {
  const { _boxIds, props } = action
  return state.withMutations(map => {
    _boxIds.forEach(id => {
      Object.keys(props).forEach(propName => {
        map.updateIn(['byId', id, propName], props[propName])
      })
    })
  })
}

const boxsReducer = (state = boxsInitialState, action) => {
  switch (action.type) {
    case ActionTypes.SOURCE_DRAG_END:
      return createBox(state, action);

    // target box grouping
    case ActionTypes.MAKE_GROUP:
      return createBox(state, action);
    case ActionTypes.UNMAKE_GROUP:
      return deleteBox(state, action);

    // // target box delete/copy/paste
    case ActionTypes.DELETE_BOX:
      return deleteBoxs(state, action);
    // case ActionTypes.COPY_BOX:
    //   return copyBox(state, action);
    case ActionTypes.PASTE_BOX:
      return addBoxs(state, action);

    // target box drag
    case ActionTypes.TARGETBOX_DRAG:
      return updateBoxs(state, action);

    // target box resize
    case ActionTypes.TARGETBOX_RESIZE:
      return updateBoxs(state, action);

    // case ActionTypes.CHANGE_PAGE:
    //   return changePage(state, action);
    // case ActionTypes.CHANGE_PROP:
    //   return changeProp(state, action);

    default:
      return state;
  }
};

export default boxsReducer;