export const MOUSE_DOWN = 'MOUSE_DOWN'
export const DRAG = 'DRAG'
export const DRAG_START = 'DRAG_START'
export const DRAG_END = 'DRAG_END'

export function mouseDown (id, shift) {
  return {
    type: MOUSE_DOWN,
    id: id,
    shift: shift
  }
}

export function drag (x, y, id) {
  return {
    type: DRAG,
    x: x,
    y: y,
    id: id
  }
}

export function dragStart (x, y, id) {
  return {
    type: DRAG_START,
    x: x,
    y: y,
    id: id
  }
}

export function dragEnd (e) {
  return {
    type: DRAG_END,
    event: e
  }
}

export const CONTEXT_MENU = 'CONTEXT_MENU'
export const MAKE_GROUP = 'MAKE_GROUP'
export const UNMAKE_GROUP = 'UNMAKE_GROUP'
export const COPY_BOX = 'COPY_BOX'
export const PASTE_BOX = 'PASTE_BOX'
export const DELETE_BOX = 'DELETE_BOX'

export function contextMenu (x, y) {
  return {
    type: CONTEXT_MENU,
    x: x,
    y: y
  }
}
export function makeGroup () {
  return {
    type: MAKE_GROUP
  }
}
export function unmakeGroup () {
  return {
    type: UNMAKE_GROUP
  }
}
export function copyBox () {
  return {
    type: COPY_BOX
  }
}
export function pasteBox () {
  return {
    type: PASTE_BOX
  }
}
export function deleteBox () {
  return {
    type: DELETE_BOX
  }
}

export const SOURCE_MOUSE_DOWN = 'SOURCE_MOUSE_DOWN'
export const SOURCE_MOUSE_UP = 'SOURCE_MOUSE_UP'
export const SOURCE_DRAG = 'SOURCE_DRAG'
export const SOURCE_DRAG_START = 'SOURCE_DRAG_START'
export const SOURCE_DRAG_END = 'SOURCE_DRAG_END'

export function sourceMouseDown (id) {
  return {
    type: SOURCE_MOUSE_DOWN,
    id: id
  }
}

export function sourceMouseUp (id) {
  return {
    type: SOURCE_MOUSE_UP,
    id: id
  }
}

export function sourceDrag (x, y, id) {
  return {
    type: SOURCE_DRAG,
    x: x,
    y: y,
    id: id
  }
}

export function sourceDragStart (x, y, id) {
  return {
    type: SOURCE_DRAG_START,
    x: x,
    y: y,
    id: id
  }
}

export function sourceDragEnd (x, y, id, key) {
  return {
    type: SOURCE_DRAG_END,
    x: x,
    y: y,
    id: id,
    key: key
  }
}

export const RESIZE_DRAG = 'RESIZE_DRAG'
export const RESIZE_DRAG_START = 'RESIZE_DRAG_START'
export const RESIZE_DRAG_END = 'RESIZE_DRAG_END'

export function resizeDrag (x, y, id, direction) {
  return {
    type: RESIZE_DRAG,
    x: x,
    y: y,
    id: id,
    direction: direction
  }
}

export function resizeDragStart (x, y, id) {
  return {
    type: RESIZE_DRAG_START,
    x: x,
    y: y,
    id: id
  }
}

export function resizeDragEnd (x, y, id) {
  return {
    type: RESIZE_DRAG_END,
    x: x,
    y: y,
    id: id
  }
}

export const RESIZE_WINDOW = 'RESIZE_WINDOW'

export function resizeWindow (screenWidth, screenHeight) {
  return {
    type: RESIZE_WINDOW,
    screenWidth: screenWidth,
    screenHeight: screenHeight
  }
}

export const CHANGE_PAGE = 'CHAGE_PAGE'

export function changePage (pageId) {
  return {
    type: CHANGE_PAGE,
    pageId: pageId
  }
}