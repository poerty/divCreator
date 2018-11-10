import * as ActionTypes from '../actions';

const set = action => state => {
  const { line } = action;
  return state
    .set('top', line.top)
    .set('bottom', line.bottom)
    .set('topBottom', line.topBottom)
    .set('left', line.left)
    .set('right', line.right)
    .set('leftRight', line.leftRight);
};

const snapLineUpdateReducer = action => {
  switch (action.type) {
  // target box drag
  case ActionTypes.TARGETBOX_DRAG:
    return set(action);

    // target box resize
  case ActionTypes.TARGETBOX_RESIZE:
    return set(action);

  default:
    return state => state;
  }
};

export default snapLineUpdateReducer;
