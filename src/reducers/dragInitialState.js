export const dragInitialState = {
  boxSourceList: {
    // {id:1, top:300, left:50, width:100, height:100},,,,
    1: {
      width: 264, height: 96, dragImgSrc: './img/1.png'
    },
    2: {
      width: 140,
      height: 140,
      dragImgSrc: './img/2.png',
      borderRadius: '50%'
    }
  },
  boxIds: [
    1112, 1113, 1114, 1115, 1116
  ],
  boxList: {
    // {id:1112, top:300, left:550, width:100, height:100},,,,
    1112: { top: 300, left: 50, width: 100, height: 100 },
    1113: { top: 100, left: 100, width: 100, height: 100 },
    1114: { top: 250, left: 250, width: 150, height: 100 },
    1115: { top: 400, left: 350, width: 100, height: 100 },
    1116: {
      top: 250,
      left: 250,
      width: 200,
      height: 250,
      background: 'transparent',
      childBoxIds: ['1114', '1115']
    }
  },
  selectedBoxIdList: [
    // {id:1111},,,,
  ],
  targetBox: { top: -10, left: -10, width: 0, height: 0, x: -1, y: -1, realTop: -1, realLeft: -1, realWidth: 0, realHeight: 0 },
  idCount: 1117,
  snapLine: { top: -1, bottom: -1, left: -1, right: -1 },
  layout: {
    top: 50,
    bottom: 50,
    left: 250,
    right: 250,
    screenWindow: typeof window === 'object' ? window.innerWidth : null,
    screenHeight: typeof window === 'object' ? window.innerHeight : null
  },
  contextMenu: {
    style: { top: 0, left: 0, visible: false },
    options: { group: false, ungroup: false, component: false, uncomponent: false, copy: false, delete: false, settings: false, separator: true, appInfo: false }
  }
}
