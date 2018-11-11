export const MOUSE_DOWN = 'MOUSE_DOWN';
export function mouseDown(id, shift) {
  return {
    type: MOUSE_DOWN,
    id,
    shift,
  };
}

export const SOURCE_DRAG_END = 'SOURCE_DRAG_END';
export function sourceDragEnd(x, y, id, key) {
  return {
    type: SOURCE_DRAG_END,
    x,
    y,
    id,
    key,
  };
}

export const TARGETBOX_DRAG = 'TARGETBOX_DRAG';
export const TARGETBOX_DRAG_START = 'TARGETBOX_DRAG_START';
export const TARGETBOX_DRAG_END = 'TARGETBOX_DRAG_END';
export function targetBoxDrag(x, y, id) {
  return {
    type: TARGETBOX_DRAG,
    x,
    y,
    id,
  };
}
export function targetBoxDragStart(x, y, id) {
  return {
    type: TARGETBOX_DRAG_START,
    x,
    y,
    id,
  };
}
export function targetBoxDragEnd(e) {
  return {
    type: TARGETBOX_DRAG_END,
    event: e,
  };
}

export const TARGETBOX_RESIZE = 'TARGETBOX_RESIZE';
export const TARGETBOX_RESIZE_START = 'TARGETBOX_RESIZE_START';
export const TARGETBOX_RESIZE_END = 'TARGETBOX_RESIZE_END';
export function targetBoxResize(x, y, id, direction) {
  return {
    type: TARGETBOX_RESIZE,
    x,
    y,
    id,
    direction,
  };
}
export function targetBoxResizeStart(x, y, id) {
  return {
    type: TARGETBOX_RESIZE_START,
    x,
    y,
    id,
  };
}
export function targetBoxResizeEnd(x, y, id) {
  return {
    type: TARGETBOX_RESIZE_END,
    x,
    y,
    id,
  };
}

export const CONTEXT_MENU = 'CONTEXT_MENU';
export const MAKE_GROUP = 'MAKE_GROUP';
export const UNMAKE_GROUP = 'UNMAKE_GROUP';
export const COPY_BOX = 'COPY_BOX';
export const PASTE_BOX = 'PASTE_BOX';
export const DELETE_BOX = 'DELETE_BOX';

export function contextMenu(x, y) {
  return {
    type: CONTEXT_MENU,
    x,
    y,
  };
}
export function makeGroup() {
  return {
    type: MAKE_GROUP,
  };
}
export function unmakeGroup() {
  return {
    type: UNMAKE_GROUP,
  };
}
export function copyBox() {
  return {
    type: COPY_BOX,
  };
}
export function pasteBox() {
  return {
    type: PASTE_BOX,
  };
}
export function deleteBox() {
  return {
    type: DELETE_BOX,
  };
}

export const RESIZE_WINDOW = 'RESIZE_WINDOW';
export function resizeWindow(width, height) {
  return {
    type: RESIZE_WINDOW,
    width,
    height,
  };
}

export const CHANGE_PAGE = 'CHAGE_PAGE';
export function changePage(pageId) {
  return {
    type: CHANGE_PAGE,
    pageId,
  };
}

export const CHANGE_PROP = 'CHANGE_PROP';
export function changeProp(boxId, propName, propValue) {
  return {
    type: CHANGE_PROP,
    boxId,
    propName,
    propValue,
  };
}
