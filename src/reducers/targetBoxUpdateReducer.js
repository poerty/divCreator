import { List } from 'immutable';

import * as ActionTypes from '../actions';

import { boxsToBox } from '../helpers/converters';

const makeGroup = action => state => {
  const { _id } = action;

  return state.update('ids', ids => ids.push(_id)).set('childIds', List([_id]));
};

const setXY = action => state => {
  const { x, y } = action;

  return state.set('x', x).set('y', y);
};

const drag = action => state => {
  const { dragAmount, diff, x, y } = action;
  return state.withMutations(map =>
    map
      .update('realTop', realTop => realTop + dragAmount.top)
      .update('realLeft', realLeft => realLeft + dragAmount.left)
      .update('top', top => top + diff.top + dragAmount.top)
      .update('left', left => left + diff.left + dragAmount.left)
      .set('x', x)
      .set('y', y)
  );
};

const resize = action => state => {
  const { diff, dragAmount, x, y } = action;
  switch (action.id) {
    case 'topResizer': {
      if (state.get('realHeight') - dragAmount.top < process.env.REACT_APP_MIN_BOX_SIZE) return state;
      return state.withMutations(map =>
        map
          .update('realTop', realTop => realTop + dragAmount.top)
          .update('realHeight', realHeight => realHeight - dragAmount.top)
          .update('top', top => top + dragAmount.top + diff.top)
          .update('height', height => height - dragAmount.top - diff.top)
          .set('x', x)
          .set('y', y)
      );
    }
    case 'bottomResizer': {
      if (state.get('realHeight') + dragAmount.top < process.env.REACT_APP_MIN_BOX_SIZE) return state;
      return state.withMutations(map =>
        map
          .update('realHeight', realHeight => realHeight + dragAmount.top)
          .update('height', height => height + dragAmount.top + diff.height)
          .set('x', x)
          .set('y', y)
      );
    }
    case 'leftResizer': {
      if (state.get('realWidth') - dragAmount.left < process.env.REACT_APP_MIN_BOX_SIZE) return state;
      return state.withMutations(map =>
        map
          .update('realLeft', realLeft => realLeft + dragAmount.left)
          .update('realWidth', realWidth => realWidth - dragAmount.left)
          .update('left', left => left + dragAmount.left + diff.left)
          .update('width', width => width - dragAmount.left - diff.left)
          .set('x', x)
          .set('y', y)
      );
    }
    case 'rightResizer': {
      if (state.get('realWidth') + dragAmount.left < process.env.REACT_APP_MIN_BOX_SIZE) return state;
      return state.withMutations(map =>
        map
          .update('realWidth', realWidth => realWidth + dragAmount.left)
          .update('width', width => width + dragAmount.left + diff.width)
          .set('x', x)
          .set('y', y)
      );
    }
    default:
      return state;
  }
};

const setRealValue = () => state => {
  return state
    .set('realTop', state.get('top'))
    .set('realLeft', state.get('left'))
    .set('realHeight', state.get('height'))
    .set('realWidth', state.get('width'));
};

const addBox = action => state => {
  const { _id, _ids, _boxs } = action;
  const ids = state.get('ids');

  return state.withMutations(map => {
    if (action.shift) {
      if (ids.includes(_id)) {
        map.update('childIds', childIds => childIds.filter(id => id !== _id));
        map.update('ids', ids => ids.filter(id => !_ids.includes(id)));
      } else {
        map.update('childIds', childIds => childIds.push(_id));
        map.update('ids', ids => ids.concat(List(_ids)));
      }
    } else {
      map.set('childIds', List([_id]));
      map.set('ids', List(_ids));
    }

    const ret = boxsToBox(
      _boxs.filter((val, key) => map.get('ids').includes(key))
    );
    map
      .set('top', ret.top)
      .set('left', ret.left)
      .set('height', ret.height)
      .set('width', ret.width)
      .set('realTop', ret.top)
      .set('realLeft', ret.left)
      .set('realHeight', ret.height)
      .set('realWidth', ret.width);
  });
};

const targetBoxUpdateReducer = action => {
  switch (action.type) {
    // box select
    case ActionTypes.MOUSE_DOWN:
      return addBox(action);

    // target box grouping
    case ActionTypes.MAKE_GROUP:
      return makeGroup(action);

    // target box drag
    case ActionTypes.TARGETBOX_DRAG_START:
      return setXY(action);
    case ActionTypes.TARGETBOX_DRAG:
      return drag(action);
    case ActionTypes.TARGETBOX_DRAG_END:
      return setRealValue(action);

    // target box resize
    case ActionTypes.TARGETBOX_RESIZE_START:
      return setXY(action);
    case ActionTypes.TARGETBOX_RESIZE:
      return resize(action);
    case ActionTypes.TARGETBOX_RESIZE_END:
      return setRealValue(action);

      // case ActionTypes.CHANGE_PROP:
      //   return changeProp(state, action);

    default:
      return state => state;
  }
};

export default targetBoxUpdateReducer;
