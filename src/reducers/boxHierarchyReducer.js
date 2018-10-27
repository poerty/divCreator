import { List, Map } from 'immutable';

import { CHANGE_PROP } from '../actions';

import {

} from './dragInitialState';
import {

} from './helpFunctions';

const setProp = (state, action) => {
  const { id = '', boxIds = List([]), boxHierarchy = Map({}) } = action;

  return state.withMutations(map => map
    .set('id', action.id)
    .set('boxIds', action.boxIds)
    .set('boxHierarchy', action.boxHierarchy));
};

const boxHierarchyInitialState = Map({
  id: '',
  boxIds: List([]),
  boxHierarchy: Map({}),
});

const boxHierarchyReducer = (state = boxHierarchyInitialState, action) => {
  switch (action.type) {
    case 'SET_PROP': return setProp(state, action);

    default: return state;
  }
};

export default boxHierarchyReducer;
