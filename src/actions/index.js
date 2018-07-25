export const MOUSE_DOWN = 'MOUSE_DOWN';
export const MOUSE_UP = 'MOUSE_UP';
export const DRAG = 'DRAG';
export const DRAG_START = 'DRAG_START';
export const DRAG_END = 'DRAG_END';


export function mouseDown(id,shift){
    return {
        type: MOUSE_DOWN,
        id: id,
        shift: shift
    }
}

export function mouseUp(id){
    return {
        type: MOUSE_UP,
        id: id
    }
}

export function drag(x,y,id){
    return {
        type: DRAG,
        x: x,
        y: y,
        id: id
    }
}

export function dragStart(x,y,id){
    return {
        type: DRAG_START,
        x: x,
        y: y,
        id: id
    }
}

export function dragEnd(e){
    return {
        type: DRAG_END,
        event: e
    }
}

export const SOURCE_MOUSE_DOWN = 'SOURCE_MOUSE_DOWN';
export const SOURCE_MOUSE_UP = 'SOURCE_MOUSE_UP';
export const SOURCE_DRAG = 'SOURCE_DRAG';
export const SOURCE_DRAG_START = 'SOURCE_DRAG_START';
export const SOURCE_DRAG_END = 'SOURCE_DRAG_END';

export function sourceMouseDown(id){
    return {
        type: SOURCE_MOUSE_DOWN,
        id: id
    }
}

export function sourceMouseUp(id){
    return {
        type: SOURCE_MOUSE_UP,
        id: id
    }
}

export function sourceDrag(x,y,id){
    return {
        type: SOURCE_DRAG,
        x: x,
        y: y,
        id: id
    }
}

export function sourceDragStart(x,y,id){
    return {
        type: SOURCE_DRAG_START,
        x: x,
        y: y,
        id: id
    }
}

export function sourceDragEnd(x,y,id){
    return {
        type: SOURCE_DRAG_END,
        x: x,
        y: y,
        id: id
    }
}


export const RESIZE_DRAG = 'RESIZE_DRAG';
export const RESIZE_DRAG_START = 'RESIZE_DRAG_START';
export const RESIZE_DRAG_END = 'RESIZE_DRAG_END';

export function resizeDrag(x,y,id,direction){
    return {
        type: RESIZE_DRAG,
        x: x,
        y: y,
        id: id,
        direction: direction
    }
}

export function resizeDragStart(x,y,id){
    return {
        type: RESIZE_DRAG_START,
        x: x,
        y: y,
        id: id
    }
}

export function resizeDragEnd(x,y,id){
    return {
        type: RESIZE_DRAG_END,
        x: x,
        y: y,
        id: id
    }
}