export function getContainerRect (boxList) {
  let ret = { top: 10000, bottom: -1, left: 10000, right: -1 }
  for (let boxId in boxList.toObject()) {
    let box=boxList.get(boxId).toObject()
    ret.top = Math.min(ret.top, box.top)
    ret.bottom = Math.max(ret.bottom, box.top + box.height)
    ret.left = Math.min(ret.left, box.left)
    ret.right = Math.max(ret.right, box.left + box.width)
  }
  return ret
}

export function getChildBoxIds (boxList, boxIds) {
  let newBoxIds=boxIds

  for(let boxId of boxIds.toArray()) {
    if(boxList.getIn([boxId,'childBoxIds'])!==undefined) {
      let childBoxIds=getChildBoxIds(boxList, boxList.getIn([boxId,'childBoxIds']))
      newBoxIds=newBoxIds.concat(childBoxIds)
    }
  }
  return newBoxIds
}

export function insideof (x, y, id) {
  let rect = document.getElementById(id).getBoundingClientRect()
  if (x < rect.left || x > rect.left + rect.width || y < rect.top || y > rect.top + rect.height) { return false } else return true
}

// 두개 차이점은 middle line 에서 *2 뿐... 싫으면 인자로 주던가
export function checkSnapDrag (top, left, width, height, selectedBoxIds, boxList, snapSize) {
  let ret = { top: { diff: 0, line: -1 }, bottom: { diff: 0, line: -1 }, left: { diff: 0, line: -1 }, right: { diff: 0, line: -1 } }
  
  for (let boxId in boxList.toObject()) {
    if (selectedBoxIds.includes(boxId)) continue
    let box=boxList.get(boxId).toObject()
    let horizonalLineList = [box.top, box.top + box.height]
    let verticalLineList = [box.left, box.left + box.width]
    let horizonalMiddleLineList = [box.top + 0.5 * box.height]
    let verticalMiddleLineList = [box.left + 0.5 * box.width]
    let differ

    for (let horizonalMiddleLine of horizonalMiddleLineList) {
      if (Math.abs(differ = horizonalMiddleLine - (top + 0.5 * height)) < snapSize) {
        ret.top = { diff: differ, line: horizonalMiddleLine }
        ret.bottom = { diff: differ, line: horizonalMiddleLine }
      }
    }
    for (let horizonalLine of horizonalLineList) {
      if (Math.abs(differ = horizonalLine - top) < snapSize) {
        ret.top = { diff: differ, line: horizonalLine }
      }
      if (Math.abs(differ = horizonalLine - (top + height)) < snapSize) {
        ret.bottom = { diff: differ, line: horizonalLine }
      }
    }

    for (let verticalMiddleLine of verticalMiddleLineList) {
      if (Math.abs(differ = verticalMiddleLine - (left + 0.5 * width)) < snapSize) {
        ret.left = { diff: differ, line: verticalMiddleLine }
        ret.right = { diff: differ, line: verticalMiddleLine }
      }
    }
    for (let verticalLine of verticalLineList) {
      if (Math.abs(differ = verticalLine - left) < snapSize) {
        ret.left = { diff: differ, line: verticalLine }
      }
      if (Math.abs(differ = verticalLine - (left + width)) < snapSize) {
        ret.right = { diff: differ, line: verticalLine }
      }
    }
  }
  return ret
}
export function checkSnapResize (top, left, width, height, selectedBoxIds, boxList, snapSize) {
  let ret = { top: { diff: 0, line: -1 }, bottom: { diff: 0, line: -1 }, left: { diff: 0, line: -1 }, right: { diff: 0, line: -1 } }

  for (let boxId in boxList.toObject()) {
    if (selectedBoxIds.includes(boxId)) continue
    let box = boxList.get(boxId).toObject()
    let horizonalLineList = [box.top, box.top + box.height]
    let verticalLineList = [box.left, box.left + box.width]
    let horizonalMiddleLineList = [2 * box.top + box.height]
    let verticalMiddleLineList = [2 * box.left + box.width]
    let differ

    for (let horizonalMiddleLine of horizonalMiddleLineList) {
      if (Math.abs(differ = horizonalMiddleLine - (2 * top + height)) < snapSize) {
        ret.top = { diff: differ, line: horizonalMiddleLine / 2 }
        ret.bottom = { diff: differ, line: horizonalMiddleLine / 2 }
      }
    }
    for (let horizonalLine of horizonalLineList) {
      if (Math.abs(differ = horizonalLine - top) < snapSize) {
        ret.top = { diff: differ, line: horizonalLine }
      }
      if (Math.abs(differ = horizonalLine - (top + height)) < snapSize) {
        ret.bottom = { diff: differ, line: horizonalLine }
      }
    }

    for (let verticalMiddleLine of verticalMiddleLineList) {
      if (Math.abs(differ = verticalMiddleLine - (2 * left + width)) < snapSize) {
        ret.left = { diff: differ, line: verticalMiddleLine / 2 }
        ret.right = { diff: differ, line: verticalMiddleLine / 2 }
      }
    }
    for (let verticalLine of verticalLineList) {
      if (Math.abs(differ = verticalLine - left) < snapSize) {
        ret.left = { diff: differ, line: verticalLine }
      }
      if (Math.abs(differ = verticalLine - (left + width)) < snapSize) {
        ret.right = { diff: differ, line: verticalLine }
      }
    }
  }
  return ret
}
