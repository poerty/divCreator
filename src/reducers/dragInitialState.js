import { Map, List } from 'immutable';

export const boxsInitialState = Map({
  ids: List(['1112', '1113', '1114', '1115', '1116']),
  byId: Map({
    1112: Map({
      id: '1112',
      top: 300,
      left: 50,
      width: 100,
      height: 100,
      childIds: List([]),
    }),
    1113: Map({
      id: '1113',
      top: 100,
      left: 100,
      width: 100,
      height: 100,
      childIds: List([]),
    }),
    1114: Map({
      id: '1114',
      top: 250,
      left: 250,
      width: 150,
      height: 100,
      childIds: List([]),
    }),
    1115: Map({
      id: '1115',
      top: 400,
      left: 350,
      width: 100,
      height: 100,
      childIds: List([]),
    }),
    1116: Map({
      id: '1116',
      top: 250,
      left: 250,
      width: 200,
      height: 250,
      background: 'transparent',
      childIds: List(['1114', '1115']),
    }),
  }),
});
export const targetBoxInitialState = Map({
  ids: List([]),
  childIds: List([]),
  top: -10,
  left: -10,
  width: 0,
  height: 0,
  x: -1,
  y: -1,
  realTop: -1,
  realLeft: -1,
  realWidth: 0,
  realHeight: 0,
});
export const snapLineInitialState = Map({
  top: -1,
  bottom: -1,
  topBottom: -1,
  left: -1,
  right: -1,
  leftRight: -1,
});
export const contextMenuInitialState = Map({
  style: Map({
    top: 0,
    left: 0,
    visible: false,
  }),
  options: Map({
    group: false,
    ungroup: false,
    component: false,
    uncomponent: false,
    copy: false,
    paste: false,
    delete: false,
    settings: false,
    separator: true,
    appInfo: false,
  }),
});
export const boxHierarchyInitialState = Map({
  boxIds: List([]),
  boxHierarchy: Map({}),
});
export const selectedBoxIdsInitialState = List([]);

export const dragInitialState = Map({
  pageId: '1',
  pageName: 'page one~~',
  boxs: boxsInitialState,
  targetBox: targetBoxInitialState,

  pageList: Map({
    1: Map({
      pageId: '1',
      pageName: 'page one~~',
      boxs: Map({
        ids: List(['1112', '1113', '1114', '1115', '1116']),
        byId: Map({
          1112: Map({
            id: '1112',
            top: 300,
            left: 50,
            width: 100,
            height: 100,
            childIds: List([]),
          }),
          1113: Map({
            id: '1113',
            top: 100,
            left: 100,
            width: 100,
            height: 100,
            childIds: List([]),
          }),
          1114: Map({
            id: '1114',
            top: 250,
            left: 250,
            width: 150,
            height: 100,
            childIds: List([]),
          }),
          1115: Map({
            id: '1115',
            top: 400,
            left: 350,
            width: 100,
            height: 100,
            childIds: List([]),
          }),
          1116: Map({
            id: '1116',
            top: 250,
            left: 250,
            width: 200,
            height: 250,
            background: 'transparent',
            childIds: List(['1114', '1115']),
          }),
        }),
      }),
    }),
    2: Map({
      pageId: '2',
      pageName: 'page 2',
      boxs: Map({
        ids: List(['1112', '1113']),
        byId: Map({
          1112: Map({
            id: '1112',
            top: 300,
            left: 50,
            width: 100,
            height: 100,
            childIds: List([]),
          }),
          1113: Map({
            id: '1113',
            top: 100,
            left: 100,
            width: 100,
            height: 100,
            childIds: List([]),
          }),
        }),
      }),
    }),
  }),

  idCount: 1117,

  boxSourceList: Map({
    // {id:1, top:300, left:50, width:100, height:100},,,,
    1: Map({
      id: '1',
      name: 'square',
      width: 100,
      height: 100,
      background: 'lightgray',
      dragImgSrc: './img/1.png',
    }),
    2: Map({
      id: '2',
      name: 'rectangle',
      width: 200,
      height: 100,
      background: 'lightgray',
      dragImgSrc: './img/1.png',
    }),
    3: Map({
      id: '3',
      name: 'circle',
      width: 100,
      height: 100,
      background: 'lightgray',
      dragImgSrc: './img/2.png',
      borderRadius: '50%',
    }),
    4: Map({
      id: '4',
      name: 'parallelogram',
      width: 150,
      height: 100,
      transform: 'skew(20deg)',
      background: 'lightgray',
      dragImgSrc: './img/2.png',
    }),
    5: Map({
      id: '5',
      name: 'circle',
      width: 100,
      height: 100,
      background: 'lightgray',
      dragImgSrc: './img/2.png',
      borderRadius: '50%',
    }),
    6: Map({
      id: '6',
      name: 'rotate rectangle',
      width: 200,
      height: 100,
      transform: 'rotate(90deg)',
      background: 'lightgray',
      dragImgSrc: './img/1.png',
    }),
  }),
  componentSourceList: Map({
    // {id:1, top:300, left:50, width:100, height:100},,,,
    1: Map({
      id: '1',
      name: 'rectangle',
      width: 200,
      height: 100,
      dragImgSrc: './img/1.png',
      propList: Map({ width: 200, height: 100, color: 'gray' }),
    }),
    2: Map({
      id: '2',
      name: 'circle',
      width: 100,
      height: 100,
      dragImgSrc: './img/2.png',
      borderRadius: '50%',
    }),
  }),

  snapLine: snapLineInitialState,
  layout: Map({
    top: 50,
    bottom: 25,
    left: 250,
    right: 250,
    width: typeof window === 'object' ? window.innerWidth : null,
    height: typeof window === 'object' ? window.innerHeight : null,
  }),
  contextMenu: contextMenuInitialState,
  clipBoard: Map({
    top: 0,
    left: 0,
    ids: List([]),
    byId: Map({}),
  }),
});
