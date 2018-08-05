export function getContainerRect (boxList) {
  let ret = { top: 10000, bottom: -1, left: 10000, right: -1 }
  for (let boxId in boxList) {
    ret.top = Math.min(ret.top, boxList[boxId].top)
    ret.bottom = Math.max(ret.bottom, boxList[boxId].top + boxList[boxId].height)
    ret.left = Math.min(ret.left, boxList[boxId].left)
    ret.right = Math.max(ret.right, boxList[boxId].left + boxList[boxId].width)
  }
  return ret
}

export function insideof (x, y, id) {
  let rect = document.getElementById(id).getBoundingClientRect()
  if (x < rect.left || x > rect.left + rect.width || y < rect.top || y > rect.top + rect.height) { return false } else return true
}

// 두개 차이점은 middle line 에서 *2 뿐... 싫으면 인자로 주던가
export function checkSnapDrag (top, left, width, height, selectedBoxIdList, boxList, snapSize) {
  let ret = { top: { diff: 0, line: -1 }, bottom: { diff: 0, line: -1 }, left: { diff: 0, line: -1 }, right: { diff: 0, line: -1 } }
  for (let boxId in boxList) {
    if (selectedBoxIdList.includes(boxId)) continue
    let box = boxList[boxId]
    let horizonalLineList = [box.top, box.top + box.height]
    let verticalLineList = [box.left, box.left + box.width]
    let horizonalMiddleLineList = [box.top + 0.5 * box.height]
    let verticalMiddleLineList = [box.left + 0.5 * box.width]

    for (let horizonalMiddleLine of horizonalMiddleLineList) {
      if (Math.abs(horizonalMiddleLine - (top + 0.5 * height)) < snapSize) {
        ret.top = { diff: horizonalMiddleLine - (top + 0.5 * height), line: horizonalMiddleLine }
        ret.bottom = { diff: horizonalMiddleLine - (top + 0.5 * height), line: horizonalMiddleLine }
      }
    }
    for (let horizonalLine of horizonalLineList) {
      if (Math.abs(horizonalLine - top) < snapSize) {
        ret.top = { diff: horizonalLine - top, line: horizonalLine }
      }
      if (Math.abs(horizonalLine - (top + height)) < snapSize) {
        ret.bottom = { diff: horizonalLine - (top + height), line: horizonalLine }
      }
    }

    for (let verticalMiddleLine of verticalMiddleLineList) {
      if (Math.abs(verticalMiddleLine - (left + 0.5 * width)) < snapSize) {
        ret.left = { diff: verticalMiddleLine - (left + 0.5 * width), line: verticalMiddleLine }
        ret.right = { diff: verticalMiddleLine - (left + 0.5 * width), line: verticalMiddleLine }
      }
    }
    for (let verticalLine of verticalLineList) {
      if (Math.abs(verticalLine - left) < snapSize) {
        ret.left = { diff: verticalLine - left, line: verticalLine }
      }
      if (Math.abs(verticalLine - (left + width)) < snapSize) {
        ret.right = { diff: verticalLine - (left + width), line: verticalLine }
      }
    }
  }
  return ret
}
export function checkSnapResize (top, left, width, height, selectedBoxIdList, boxList, snapSize) {
  let ret = { top: { diff: 0, line: -1 }, bottom: { diff: 0, line: -1 }, left: { diff: 0, line: -1 }, right: { diff: 0, line: -1 } }
  for (let boxId in boxList) {
    if (selectedBoxIdList.includes(boxId)) continue
    let box = boxList[boxId]
    let horizonalLineList = [box.top, box.top + box.height]
    let verticalLineList = [box.left, box.left + box.width]
    let horizonalMiddleLineList = [2 * box.top + box.height]
    let verticalMiddleLineList = [2 * box.left + box.width]

    for (let horizonalMiddleLine of horizonalMiddleLineList) {
      if (Math.abs(horizonalMiddleLine - (2 * top + height)) < snapSize) {
        ret.top = { diff: horizonalMiddleLine - (2 * top + height), line: horizonalMiddleLine / 2 }
        ret.bottom = { diff: horizonalMiddleLine - (2 * top + height), line: horizonalMiddleLine / 2 }
      }
    }
    for (let horizonalLine of horizonalLineList) {
      if (Math.abs(horizonalLine - top) < snapSize) {
        ret.top = { diff: horizonalLine - top, line: horizonalLine }
      }
      if (Math.abs(horizonalLine - (top + height)) < snapSize) {
        ret.bottom = { diff: horizonalLine - (top + height), line: horizonalLine }
      }
    }

    for (let verticalMiddleLine of verticalMiddleLineList) {
      if (Math.abs(verticalMiddleLine - (2 * left + width)) < snapSize) {
        ret.left = { diff: verticalMiddleLine - (2 * left + width), line: verticalMiddleLine / 2 }
        ret.right = { diff: verticalMiddleLine - (2 * left + width), line: verticalMiddleLine / 2 }
      }
    }
    for (let verticalLine of verticalLineList) {
      if (Math.abs(verticalLine - left) < snapSize) {
        ret.left = { diff: verticalLine - left, line: verticalLine }
      }
      if (Math.abs(verticalLine - (left + width)) < snapSize) {
        ret.right = { diff: verticalLine - (left + width), line: verticalLine }
      }
    }
  }
  return ret
}
