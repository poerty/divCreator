import { Map, List } from 'immutable'

export const targetBoxInitialState = Map({
  top: -10, left: -10,
  width: 0, height: 0,
  x: -1, y: -1,
  realTop: -1, realLeft: -1,
  realWidth: 0, realHeight: 0
})
export const snapLineInitialState = Map({
  top: -1, bottom: -1, topBottom: -1,
  left: -1, right: -1, leftRight: -1
})
export const contextMenuInitialState = Map({
  style: Map({
    top: 0, left: 0,
    visible: false
  }),
  options: Map({
    group: false, ungroup: false,
    component: false, uncomponent: false,
    copy: false, paste: false, delete: false,
    settings: false, separator: true, appInfo: false
  })
})
export const boxHierarchyInitialState = Map({
  boxIds: List([]),
  boxHierarchy: Map({})
})

export const dragInitialState = Map({
  boxSourceList: Map({
    // {id:1, top:300, left:50, width:100, height:100},,,,
    1: Map({ width: 264, height: 96, dragImgSrc: './img/1.png' }),
    2: Map({ width: 140, height: 140, dragImgSrc: './img/2.png', borderRadius: '50%' })
  }),
  boxIds: List([
    '1112', '1113', '1114', '1115', '1116'
  ]),
  boxHierarchy: Map({
    '1112': boxHierarchyInitialState,
    '1113': boxHierarchyInitialState,
    '1116': Map({
      boxIds: List(['1114', '1115']),
      boxHierarchy: Map({
        '1114': boxHierarchyInitialState,
        '1115': boxHierarchyInitialState
      })
    }),
  }),
  boxList: Map({
    // {id:1112, top:300, left:550, width:100, height:100},,,,
    '1112': Map({ top: 300, left: 50, width: 100, height: 100, zindex: 10}),
    '1113': Map({ top: 100, left: 100, width: 100, height: 100, zIndex: 10}),
    '1114': Map({ top: 250, left: 250, width: 150, height: 100 }),
    '1115': Map({ top: 400, left: 350, width: 100, height: 100 }),
    '1116': Map({ top: 250, left: 250, width: 200, height: 250, background: 'transparent' })
  }),
  selectedBoxIds: List([]),
  targetBox: targetBoxInitialState,
  idCount: 1117,
  snapLine: snapLineInitialState,
  layout: Map({
    top: 50,
    bottom: 50,
    left: 250,
    right: 250,
    screenWindow: typeof window === 'object' ? window.innerWidth : null,
    screenHeight: typeof window === 'object' ? window.innerHeight : null
  }),
  contextMenu: contextMenuInitialState,
  clipBoard: Map({
    top: 0,
    left: 0,
    boxIds: List([]),
    boxList: Map({}),
    boxHierarchy: Map({})
  })
})
