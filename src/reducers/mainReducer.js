import { List, Map } from "immutable";

import * as ActionTypes from "../actions";

import {
  dragInitialState,
  targetBoxInitialState,
  snapLineInitialState,
  contextMenuInitialState,
} from "./dragInitialState";
import {
  getContainerRect,
  checkSnapDrag,
  checkSnapResize,
} from "./helpFunctions";

import { pointWithinLayout, boxsToBoxSize, convertBoxIds } from '../helpers/converters'

import boxsReducer from './boxsReducer'

const makeGroup = (state, action) => {
  const targetBoxIds = state.getIn(["targetBox", "ids"])
  const targetBoxs = state.getIn(["boxs", "byId"])
    .filter(box => targetBoxIds.includes(box.get('id')))
  const childIds = state.getIn(["targetBox", "childIds"])
  if (targetBoxIds.size < 2) return state;

  const id = String(state.get("idCount"))
  // box that contain all the boxs
  const newBox = boxsToBoxSize(targetBoxs)

  const newState = state.withMutations(map =>
    map
      .updateIn(["targetBox", "ids"], ids => ids.push(id))
      .setIn(["targetBox", "childIds"], List([id]))
      .setIn(["targetBox", "top",], newBox.top)
      .setIn(["targetBox", "left",], newBox.left)
      .setIn(["targetBox", "width",], newBox.width)
      .setIn(["targetBox", "height",], newBox.height)
      .setIn(["targetBox", "realTop",], newBox.top)
      .setIn(["targetBox", "realLeft",], newBox.left)
      .setIn(["targetBox", "realWidth",], newBox.width)
      .setIn(["targetBox", "realHeight",], newBox.height)
      .set("contextMenu", contextMenuInitialState)
      .set('boxs', boxsReducer(state.get('boxs'), { ...action, _id: id, _childIds: childIds, newBox }))
      .update("idCount", idCount => idCount + 1)
  );
  return newState;
};
const unmakeGroup = (state, action) => {
  const childIds = state.getIn(["targetBox", "childIds"])
  if (childIds.size !== 1) return state;

  const boxId = childIds.get(0)
  if (state.getIn(["boxs", "byId", boxId, "childIds"]).size === 0)
    return state;

  return state.withMutations(map =>
    map
      .set("targetBox", targetBoxInitialState)
      .set("contextMenu", contextMenuInitialState)
      .set('boxs', boxsReducer(state.get('boxs'), { ...action, _boxId: boxId }))
  );
};

const targetBoxDragStart = (state, action) => {
  return state.withMutations(map =>
    map
      .setIn(["targetBox", "x",], action.x)
      .setIn(["targetBox", "y",], action.y)
  );
}
const targetBoxDrag = (state, action) => {
  if (action.x === 0 || action.y === 0) return state;

  const screenLayout = state.get('layout')
  const { x, y } = pointWithinLayout(action, screenLayout.toJS())

  const targetBox = state.get("targetBox").toJS();
  const dragAmount = {
    left: x - targetBox.x,
    top: y - targetBox.y,
  };
  const topDiff = targetBox.realTop - targetBox.top;
  const leftDiff = targetBox.realLeft - targetBox.left;

  const targetBoxIds = state.getIn(["targetBox", "ids"])
  const targetBoxs = state.getIn(["boxs", "byId"])
    .filter(box => targetBoxIds.includes(box.get('id')))
  const nonTargetBoxs = state.getIn(["boxs", "byId"])
    .filter(box => !targetBoxIds.includes(box.get('id')))
  const ret = checkSnapDrag(
    targetBox.realTop + dragAmount.top,
    targetBox.realLeft + dragAmount.left,
    targetBox.realWidth,
    targetBox.realHeight,
    nonTargetBoxs,
    5
  );
  const topDiff2 =
    ret.top.diff === 0
      ? ret.bottom.diff === 0
        ? ret.topBottom.diff
        : ret.bottom.diff
      : ret.top.diff;
  const leftDiff2 =
    ret.left.diff === 0
      ? ret.right.diff === 0
        ? ret.leftRight.diff
        : ret.right.diff
      : ret.left.diff;

  return state.withMutations(map =>
    map
      .updateIn(["targetBox", "realTop",], realTop => realTop + dragAmount.top)
      .updateIn(["targetBox", "realLeft",], realLeft => realLeft + dragAmount.left)
      .updateIn(["targetBox", "top",], top => top + dragAmount.top + topDiff + topDiff2)
      .updateIn(["targetBox", "left",], left => left + dragAmount.left + leftDiff + leftDiff2)
      .setIn(["targetBox", "x",], x)
      .setIn(["targetBox", "y",], y)
      .setIn(["snapLine", "top",], ret.top.line)
      .setIn(["snapLine", "topBottom",], ret.topBottom.line)
      .setIn(["snapLine", "bottom",], ret.bottom.line)
      .setIn(["snapLine", "left",], ret.left.line)
      .setIn(["snapLine", "right",], ret.right.line)
      .setIn(["snapLine", "leftRight",], ret.leftRight.line)
      .set('boxs', boxsReducer(
        state.get('boxs'),
        {
          ...action,
          _boxIds: targetBoxIds,
          props: {
            'top': top => top + dragAmount.top + topDiff + topDiff2,
            'left': left => left + dragAmount.left + leftDiff + leftDiff2
          }
        })
      )
  );
};
const targetBoxDragEnd = (state, action) => {
  return state.set("snapLine", snapLineInitialState);
}

const targetBoxResizeStart = (state, action) => {
  return state.withMutations(map =>
    map
      .setIn(["targetBox", "x",], action.x)
      .setIn(["targetBox", "y",], action.y)
  );
};
const targetBoxResize = (state, action) => {
  if (action.x === 0 || action.y === 0) return state;

  const screenLayout = state.get('layout')
  const { x, y } = pointWithinLayout(action, screenLayout.toJS())

  const targetBox = state.get("targetBox").toJS();
  const dragAmount = {
    left: x - targetBox.x,
    top: y - targetBox.y,
  };
  const topDiff = targetBox.realTop - targetBox.top;
  const leftDiff = targetBox.realLeft - targetBox.left;
  const heightDiff = targetBox.realHeight - targetBox.height;
  const widthDiff = targetBox.realWidth - targetBox.width;

  const targetBoxIds = state.getIn(["targetBox", "ids"])
  const nonTargetBoxs = state.getIn(["boxs", "byId"])
    .filter(box => !targetBoxIds.includes(box.get('id')))
  const ret = checkSnapResize(
    targetBox.realTop + dragAmount.top,
    targetBox.realLeft + dragAmount.left,
    targetBox.realWidth,
    targetBox.realHeight,
    nonTargetBoxs,
    5,
    action.id
  );
  const topDiff2 =
    ret.top.diff === 0
      ? ret.bottom.diff === 0
        ? ret.topBottom.diff
        : ret.bottom.diff
      : ret.top.diff;
  const leftDiff2 =
    ret.left.diff === 0
      ? ret.right.diff === 0
        ? ret.leftRight.diff
        : ret.right.diff
      : ret.left.diff;

  let newTargetBox = state.get("targetBox");
  if (action.id === "topResizer") {
    if (newTargetBox.get("realHeight") - dragAmount.top < 2) return state;
    newTargetBox = newTargetBox.withMutations(map =>
      map
        .update("realTop", realTop => realTop + dragAmount.top)
        .update("realHeight", realHeight => realHeight - dragAmount.top)
        .update("top", top => top + dragAmount.top + topDiff + topDiff2)
        .update(
          "height",
          height => height - dragAmount.top + heightDiff - topDiff2
        )
    );
  } else if (action.id === "bottomResizer") {
    if (newTargetBox.get("realHeight") + dragAmount.top < 2) return state;
    newTargetBox = newTargetBox.withMutations(map =>
      map
        .update("realHeight", realHeight => realHeight + dragAmount.top)
        .update(
          "height",
          height => height + dragAmount.top + heightDiff + topDiff2
        )
    );
  } else if (action.id === "leftResizer") {
    if (newTargetBox.get("realWidth") - dragAmount.left < 2) return state;
    newTargetBox = newTargetBox.withMutations(map =>
      map
        .update("realLeft", realLeft => realLeft + dragAmount.left)
        .update("realWidth", realWidth => realWidth - dragAmount.left)
        .update("left", left => left + dragAmount.left + leftDiff + leftDiff2)
        .update(
          "width",
          width => width - dragAmount.left + widthDiff - leftDiff2
        )
    );
  } else if (action.id === "rightResizer") {
    if (newTargetBox.get("realWidth") + dragAmount.left < 2) return state;
    newTargetBox = newTargetBox.withMutations(map =>
      map
        .update("realWidth", realWidth => realWidth + dragAmount.left)
        .update(
          "width",
          width => width + dragAmount.left + widthDiff + leftDiff2
        )
    );
  }
  newTargetBox = newTargetBox.set("x", x).set("y", y)

  newTargetBox = newTargetBox.toJS();
  return state.withMutations(map =>
    map
      .set("targetBox", Map(newTargetBox))
      .setIn(["snapLine", "top",], ret.top.line)
      .setIn(["snapLine", "bottom",], ret.bottom.line)
      .setIn(["snapLine", "topBottom",], ret.topBottom.line)
      .setIn(["snapLine", "left",], ret.left.line)
      .setIn(["snapLine", "right",], ret.right.line)
      .setIn(["snapLine", "leftRight",], ret.leftRight.line)
      .set('boxs', boxsReducer(
        state.get('boxs'),
        {
          ...action,
          _boxIds: targetBoxIds,
          props: {
            'left': left => (left - targetBox.left) * (newTargetBox.width / targetBox.width) + newTargetBox.left,
            'top': top => (top - targetBox.top) * (newTargetBox.height / targetBox.height) + newTargetBox.top,
            'width': width => (newTargetBox.width / targetBox.width) * width,
            'height': height => (newTargetBox.height / targetBox.height) * height,
          }
        })
      )
  );
};
const targetBoxResizeEnd = (state, action) => {
  return state.withMutations(map =>
    map
      .setIn(["targetBox", "realWidth",], state.getIn(["targetBox", "width",]))
      .setIn(["targetBox", "realHeight",], state.getIn(["targetBox", "height",]))
      .set("snapLine", snapLineInitialState)
  );
}

const deleteBox = (state, action) => {
  if (state.getIn(["targetBox", "ids"]).size === 0) return state;
  const boxIds = state.getIn(["targetBox", "ids"])

  return state.withMutations(map =>
    map
      .set("targetBox", targetBoxInitialState)
      .set("contextMenu", contextMenuInitialState)
      .set('boxs', boxsReducer(state.get('boxs'), { ...action, _boxIds: boxIds }))
  );
};
const copyBox = (state, action) => {
  if (state.getIn(["targetBox", "ids"]).size === 0)
    return state;

  const selectedBoxList = state
    .getIn(["boxs", "byId",])
    .filter((value, key) => state.getIn(["targetBox", "ids"]).includes(key));
  const ret = getContainerRect(selectedBoxList);

  return state.withMutations(map =>
    map
      .setIn(
        ["clipBoard", "ids",],
        state.getIn(["targetBox", "ids"])
      )
      .setIn(
        ["clipBoard", "byId",],
        state
          .getIn(["boxs", "byId",])
          .filter((value, key) => state.getIn(["targetBox", "ids"]).includes(key))
      )
      .setIn(["clipBoard", "top",], ret.top)
      .setIn(["clipBoard", "left",], ret.left)
      .set("targetBox", targetBoxInitialState)
      .set("contextMenu", contextMenuInitialState)
  );
};
const pasteBox = (state, action) => {
  const { _ids, _byId, idCount } =
    convertBoxIds(
      state.getIn(["clipBoard", "ids"]),
      state.getIn(["clipBoard", "byId"]),
      state.get("idCount")
    )

  return state.withMutations(map =>
    map
      .set('boxs', boxsReducer(state.get('boxs'), { ...action, _byId, _ids }))
      .set("idCount", idCount)
  );
};

const sourceDragEnd = (state, action) => {
  // drag area 안인지 판별
  const { x, y, key } = action
  const { left, right, top, bottom, width, height } = state.get("layout").toJS();
  if (x < left || x > width - right || y < top || y > height - bottom)
    return state;

  const id = String(state.get("idCount"))
  const newBox = state.getIn(["boxSourceList", key,]).toJS()
  newBox.left = x - left - 50
  newBox.top = y - top - 50

  return state.withMutations(map =>
    map
      .set('boxs', boxsReducer(state.get('boxs'), { ...action, _id: id, newBox }))
      .update("idCount", idCount => idCount + 1)
  );
};

const mouseDown = (state, action) => {
  if (action.id === "" || action.id === undefined) {
    return state.set("contextMenu", contextMenuInitialState);
  }
  if (action.id === "dragArea") {
    return state
      .set("targetBox", targetBoxInitialState)
      .set("contextMenu", contextMenuInitialState);
  }
  if (action.id.includes("Resizer")) {
    return state.set("contextMenu", contextMenuInitialState);
  }
  if (action.id === "0") {
    return state.set("contextMenu", contextMenuInitialState);
  }

  const getChildIds = (boxList, id) => {
    let childIds = boxList[id].childIds;
    childIds = childIds.reduce((list, childId) => {
      return [...list, ...getChildIds(boxList, childId)]
    }, []);
    return [...childIds, id]
  }
  const childIds = getChildIds(state.getIn(["boxs", "byId"]).toJS(), action.id)
  const newSelectedBoxIds =
    action.shift === true
      ? state.getIn(["targetBox", "ids"]).concat(List(childIds))
      : List(childIds);
  const selectedBoxList = state
    .getIn(["boxs", "byId",])
    .filter((value, key) => newSelectedBoxIds.includes(key));
  const ret = getContainerRect(selectedBoxList);

  const newChildIds =
    action.shift === true
      ? state.getIn(["targetBox", "childIds"]).push(action.id)
      : List([action.id])

  return state.withMutations(map =>
    map
      .setIn(["targetBox", "ids"], newSelectedBoxIds)
      .setIn(["targetBox", "childIds"], newChildIds)
      .setIn(["targetBox", "top",], ret.top)
      .setIn(["targetBox", "left",], ret.left)
      .setIn(["targetBox", "width",], ret.right - ret.left)
      .setIn(["targetBox", "height",], ret.bottom - ret.top)
      .setIn(["targetBox", "realTop",], ret.top)
      .setIn(["targetBox", "realLeft",], ret.left)
      .setIn(["targetBox", "realWidth",], ret.right - ret.left)
      .setIn(["targetBox", "realHeight",], ret.bottom - ret.top)
      .set("contextMenu", contextMenuInitialState)
  );
};
const contextMenu = (state, action) => {
  const newOptions = {
    group: true,
    ungroup: false,
    copy: false,
    paste: true,
    delete: false,
  };

  const childBoxIds = state.getIn(["targetBox", "childIds"])


  console.log("childBoxIds", childBoxIds)
  if (childBoxIds.size === 1) {
    const id = childBoxIds.get(0)
    if (state.getIn(["boxs", "byId", id]).get("childIds").size !== 0) {
      newOptions.ungroup = true;
    }
  }
  if (state.getIn(["targetBox", "ids"]).size >= 1) {
    newOptions.copy = true;
    newOptions.delete = true;
  }

  return state.withMutations(map =>
    map
      .setIn(
        ["contextMenu", "style", "top",],
        action.y - state.getIn(["layout", "top",])
      )
      .setIn(
        ["contextMenu", "style", "left",],
        action.x - state.getIn(["layout", "left",])
      )
      .setIn(["contextMenu", "style", "visible",], true)
      .setIn(["contextMenu", "options", "group",], newOptions.group)
      .setIn(["contextMenu", "options", "ungroup",], newOptions.ungroup)
      .setIn(["contextMenu", "options", "copy",], newOptions.copy)
      .setIn(["contextMenu", "options", "paste",], newOptions.paste)
      .setIn(["contextMenu", "options", "delete",], newOptions.delete)
  );
};
const resizeWindow = (state, action) => {
  return state.withMutations(map =>
    map
      .setIn(["layout", "width",], action.width)
      .setIn(["layout", "height",], action.height)
  );
}

const changePage = (state, action) => {
  const currentPageId = state.get("pageId");
  if (action.pageId === currentPageId) return state;
  return state.withMutations(map =>
    map
      .set("targetBox", targetBoxInitialState)
      .set("snapLine", snapLineInitialState)
      .setIn(["pageList", currentPageId, "boxs",], state.get("boxs"))
      .set("pageId", action.pageId)
      .set("boxs", state.getIn(["pageList", action.pageId, "boxs",]))
  );
};
const changeProp = (state, action) => {
  const targetBox = state.get("targetBox").toJS();

  const layoutPropToRealName = (name) => {
    switch (name) {
      case "top": return "realTop"
      case "left": return "realLeft"
      case "width": return "realWidth"
      case "height": return "realHeight"
      default: return name
    }
  }
  let newState = state.withMutations(map =>
    map
      .setIn(["targetBox", action.propName], action.propValue)
      .setIn(["targetBox", layoutPropToRealName(action.propName)], action.propValue)
  )
  const newTargetBox = newState.get("targetBox").toJS();
  const allSelectedBoxIds = newState.getIn(["targetBox", "ids"]).toJS();
  if (layoutPropToRealName(action.propName) !== action.propName) {
    allSelectedBoxIds.forEach((boxId) => {
      newState = newState.withMutations(map =>
        map
          .updateIn(
            ["boxs", "byId", boxId, "top",],
            top =>
              (top - targetBox.top) * (newTargetBox.height / targetBox.height) +
              newTargetBox.top
          )
          .updateIn(
            ["boxs", "byId", boxId, "left",],
            left =>
              (left - targetBox.left) * (newTargetBox.width / targetBox.width) +
              newTargetBox.left
          )
          .updateIn(
            ["boxs", "byId", boxId, "height",],
            height => (newTargetBox.height / targetBox.height) * height
          )
          .updateIn(
            ["boxs", "byId", boxId, "width",],
            width => (newTargetBox.width / targetBox.width) * width
          )
      );
    })
  }
  else {
    allSelectedBoxIds.forEach((boxId) => {
      newState = newState.withMutations(map =>
        map
          .setIn(
            ["boxs", "byId", boxId, action.propName,],
            action.propValue
          )
      );
    })
  }

  return newState;
};

const mainReducer = (state = dragInitialState, action) => {
  switch (action.type) {
    case ActionTypes.SOURCE_DRAG_END:
      return sourceDragEnd(state, action);
    // box select
    case ActionTypes.MOUSE_DOWN:
      return mouseDown(state, action);

    case ActionTypes.CONTEXT_MENU:
      return contextMenu(state, action);

    // target box grouping
    case ActionTypes.MAKE_GROUP:
      return makeGroup(state, action);
    case ActionTypes.UNMAKE_GROUP:
      return unmakeGroup(state, action);

    // target box delete/copy/paste
    case ActionTypes.DELETE_BOX:
      return deleteBox(state, action);
    case ActionTypes.COPY_BOX:
      return copyBox(state, action);
    case ActionTypes.PASTE_BOX:
      return pasteBox(state, action);

    // target box drag
    case ActionTypes.TARGETBOX_DRAG_START:
      return targetBoxDragStart(state, action);
    case ActionTypes.TARGETBOX_DRAG:
      return targetBoxDrag(state, action);
    case ActionTypes.TARGETBOX_DRAG_END:
      return targetBoxDragEnd(state, action);

    // target box resize
    case ActionTypes.TARGETBOX_RESIZE_START:
      return targetBoxResizeStart(state, action);
    case ActionTypes.TARGETBOX_RESIZE:
      return targetBoxResize(state, action);
    case ActionTypes.TARGETBOX_RESIZE_END:
      return targetBoxResizeEnd(state, action);

    case ActionTypes.RESIZE_WINDOW:
      return resizeWindow(state, action);

    case ActionTypes.CHANGE_PAGE:
      return changePage(state, action);
    case ActionTypes.CHANGE_PROP:
      return changeProp(state, action);

    default:
      return state;
  }
};

export default mainReducer;
