export function getHierarchy(boxHierarchy, id){
  if(boxHierarchy.get(id)!==undefined) return boxHierarchy.get(id)

  return getHierarchy(
    boxHierarchy
    .filter((hierarch)=>hierarch.getIn(['boxIds',id])!==undefined)
    .get('boxHierarchy'),
    id
  )
}

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

export function getChildBoxIds (boxHierarchy, boxIds) {
  let newBoxIds=boxIds
  newBoxIds = boxIds.reduce((map,id)=>{
    return getHierarchy(boxHierarchy,id).get('boxIds').concat(map)
  },newBoxIds)

  return newBoxIds
}

// 두개 차이점은 resizer와 middle line 에서 *2 뿐... 싫으면 인자로 주던가
export function checkSnapDrag (top, left, width, height, selectedBoxIds, boxList, snapSize) {
  let ret = { top: { diff: 0, line: -1 }, bottom: { diff: 0, line: -1 }, topBottom: { diff: 0, line: -1 }, left: { diff: 0, line: -1 }, right: { diff: 0, line: -1 }, leftRight: { diff: 0, line: -1 } }
  let minTBDiff=snapSize, minLRDiff=snapSize

  for (let boxId in boxList.toObject()) {
    if (selectedBoxIds.includes(boxId)) continue
    let box=boxList.get(boxId).toObject()
    let horizonalLineList = [box.top, box.top + box.height]
    let verticalLineList = [box.left, box.left + box.width]
    let horizonalMiddleLineList = [box.top + 0.5 * box.height]
    let verticalMiddleLineList = [box.left + 0.5 * box.width]
    let differ

    for (let horizonalMiddleLine of horizonalMiddleLineList) {
      differ = horizonalMiddleLine - (top + 0.5 * height)
      if (differ === minTBDiff) ret.topBottom = { diff: differ, line: horizonalMiddleLine }
      else if (Math.abs(differ) < Math.abs(minTBDiff)) {
        ret.top = { diff: 0, line: -1 }
        ret.bottom = { diff: 0, line: -1 }
        ret.topBottom = { diff: differ, line: horizonalMiddleLine }
        minTBDiff = differ
      }
    }
    for (let horizonalLine of horizonalLineList) {
      differ = horizonalLine - top
      if (differ === minTBDiff) ret.top = { diff: differ, line: horizonalLine }
      else if (Math.abs(differ) < Math.abs(minTBDiff)) {
        ret.top = { diff: differ, line: horizonalLine }
        ret.bottom = { diff: 0, line: -1 }
        ret.topBottom = { diff: 0, line: -1 }
        minTBDiff = differ
      }

      differ = horizonalLine - (top + height)
      if (differ === minTBDiff) ret.bottom = { diff: differ, line: horizonalLine }
      else if (Math.abs(differ) < Math.abs(minTBDiff)) {
        ret.top = { diff: 0, line: -1 }
        ret.bottom = { diff: differ, line: horizonalLine }
        ret.topBottom = { diff: 0, line: -1 }
        minTBDiff = differ
      }
    }

    for (let verticalMiddleLine of verticalMiddleLineList) {
      differ = verticalMiddleLine - (left + 0.5 * width)
      if (differ === minLRDiff) ret.leftRight = { diff: differ, line: verticalMiddleLine }
      else if (Math.abs(differ) < Math.abs(minLRDiff)) {
        ret.left = { diff: 0, line: -1 }
        ret.right = { diff: 0, line: -1 }
        ret.leftRight = { diff: differ, line: verticalMiddleLine }
        minLRDiff = differ
      }
    }
    for (let verticalLine of verticalLineList) {
      differ = verticalLine - left
      if (differ === minLRDiff) ret.left = { diff: differ, line: verticalLine }
      else if (Math.abs(differ) < Math.abs(minLRDiff)) {
        ret.left = { diff: differ, line: verticalLine }
        ret.right = { diff: 0, line: -1 }
        ret.leftRight = { diff: 0, line: -1 }
        minLRDiff = differ
      }

      differ = verticalLine - (left + width)
      if (differ === minLRDiff) ret.right = { diff: differ, line: verticalLine }
      else if (Math.abs(differ) < Math.abs(minLRDiff)) {
        ret.left = { diff: 0, line: -1 }
        ret.right = { diff: differ, line: verticalLine }
        ret.leftRight = { diff: 0, line: -1 }
        minLRDiff = differ
      }
    }
  }
  return ret
}
export function checkSnapResize (top, left, width, height, selectedBoxIds, boxList, snapSize, resizer) {
  let ret = { top: { diff: 0, line: -1 }, bottom: { diff: 0, line: -1 }, topBottom: { diff: 0, line: -1 }, left: { diff: 0, line: -1 }, right: { diff: 0, line: -1 }, leftRight: { diff: 0, line: -1 } }
  let minTBDiff=snapSize, minLRDiff=snapSize

  for (let boxId in boxList.toObject()) {
    if (selectedBoxIds.includes(boxId)) continue
    let box=boxList.get(boxId).toObject()
    let horizonalLineList = [box.top, box.top + box.height]
    let verticalLineList = [box.left, box.left + box.width]
    let horizonalMiddleLineList = [2 * box.top + box.height]
    let verticalMiddleLineList = [2 * box.left + box.width]
    let differ

    for (let horizonalMiddleLine of horizonalMiddleLineList) {
      differ = horizonalMiddleLine - (2 * top + height)
      if (differ === minTBDiff) ret.topBottom = { diff: differ, line: horizonalMiddleLine / 2 }
      else if (Math.abs(differ) < Math.abs(minTBDiff)) {
        ret.top = { diff: 0, line: -1 }
        ret.bottom = { diff: 0, line: -1 }
        ret.topBottom = { diff: differ, line: horizonalMiddleLine / 2 }
        minTBDiff = differ
      }
    }
    for (let horizonalLine of horizonalLineList) {
      if(resizer!=='bottomResizer'){
        differ = horizonalLine - top
        if (differ === minTBDiff) ret.top = { diff: differ, line: horizonalLine }
        else if (Math.abs(differ) < Math.abs(minTBDiff)) {
          ret.top = { diff: differ, line: horizonalLine }
          ret.bottom = { diff: 0, line: -1 }
          ret.topBottom = { diff: 0, line: -1 }
          minTBDiff = differ
        }
      }

      if(resizer!=='topResizer'){
        differ = horizonalLine - (top + height)
        if (differ === minTBDiff) ret.bottom = { diff: differ, line: horizonalLine }
        else if (Math.abs(differ) < Math.abs(minTBDiff)) {
          ret.top = { diff: 0, line: -1 }
          ret.bottom = { diff: differ, line: horizonalLine }
          ret.topBottom = { diff: 0, line: -1 }
          minTBDiff = differ
        }
      }
    }

    for (let verticalMiddleLine of verticalMiddleLineList) {
      differ = verticalMiddleLine - (2 * left + width)
      if (differ === minLRDiff) ret.leftRight = { diff: differ, line: verticalMiddleLine / 2 }
      else if (Math.abs(differ) < Math.abs(minLRDiff)) {
        ret.left = { diff: 0, line: -1 }
        ret.right = { diff: 0, line: -1 }
        ret.leftRight = { diff: differ, line: verticalMiddleLine / 2 }
        minLRDiff = differ
      }
    }
    for (let verticalLine of verticalLineList) {
      if(resizer!=='rightResizer'){
        differ = verticalLine - left
        if (differ === minLRDiff) ret.left = { diff: differ, line: verticalLine }
        else if (Math.abs(differ) < Math.abs(minLRDiff)) {
          ret.left = { diff: differ, line: verticalLine }
          ret.right = { diff: 0, line: -1 }
          ret.leftRight = { diff: 0, line: -1 }
          minLRDiff = differ
        }
      }

      if(resizer!=='leftResizer'){
        differ = verticalLine - (left + width)
        if (differ === minLRDiff) ret.right = { diff: differ, line: verticalLine }
        else if (Math.abs(differ) < Math.abs(minLRDiff)) {
          ret.left = { diff: 0, line: -1 }
          ret.right = { diff: differ, line: verticalLine }
          ret.leftRight = { diff: 0, line: -1 }
          minLRDiff = differ
        }
      }
    }
  }
  return ret
}
