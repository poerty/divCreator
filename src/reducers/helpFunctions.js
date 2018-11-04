export function getHierarchy(boxHierarchy, id) {
  if (boxHierarchy.get(id) !== undefined) return boxHierarchy.get(id)

  return getHierarchy(
    boxHierarchy
      .filter((hierarch) => hierarch.getIn(['boxIds', id]) !== undefined)
      .get('boxHierarchy'),
    id
  )
}

export function getContainerRect(boxList) {
  let ret = { top: 10000, bottom: -1, left: 10000, right: -1 }
  for (let boxId in boxList.toObject()) {
    let box = boxList.get(boxId).toObject()
    ret.top = Math.min(ret.top, box.top)
    ret.bottom = Math.max(ret.bottom, box.top + box.height)
    ret.left = Math.min(ret.left, box.left)
    ret.right = Math.max(ret.right, box.left + box.width)
  }
  return ret
}

export function getChildBoxIds(boxHierarchy, boxIds) {
  let newBoxIds = boxIds
  newBoxIds = boxIds.reduce((map, id) => {
    return getHierarchy(boxHierarchy, id).get('boxIds').concat(map)
  }, newBoxIds)

  return newBoxIds
}

// 두개 차이점은 resizer와 middle line 에서 *2 뿐... 싫으면 인자로 주던가
export function checkSnapDrag(top, left, width, height, nonTargetBoxs, snapSize) {
  const initial = { diff: 0, line: -1 }
  const ret = {
    top: initial,
    bottom: initial,
    topBottom: initial,
    left: initial,
    right: initial,
    leftRight: initial
  }
  const bottom = top + height, topBottom = top + 0.5 * height
  const right = left + width, leftRight = left + 0.5 * width
  let minTBDiff = snapSize, minLRDiff = snapSize

  nonTargetBoxs.forEach((box) => {
    box = box.toJS()
    let diff

    for (const line of [box.top + 0.5 * box.height]) {
      diff = line - topBottom
      if (diff === minTBDiff) ret.topBottom = { diff, line }
      else if (Math.abs(diff) < Math.abs(minTBDiff)) {
        ret.top = initial
        ret.bottom = initial
        ret.topBottom = { diff, line }
        minTBDiff = diff
      }
    }
    for (const line of [box.top, box.top + box.height]) {
      diff = line - top
      if (diff === minTBDiff) ret.top = { diff, line }
      else if (Math.abs(diff) < Math.abs(minTBDiff)) {
        ret.top = { diff, line }
        ret.bottom = initial
        ret.topBottom = initial
        minTBDiff = diff
      }

      diff = line - bottom
      if (diff === minTBDiff) ret.bottom = { diff, line }
      else if (Math.abs(diff) < Math.abs(minTBDiff)) {
        ret.top = initial
        ret.bottom = { diff, line }
        ret.topBottom = initial
        minTBDiff = diff
      }
    }

    for (const line of [box.left + 0.5 * box.width]) {
      diff = line - leftRight
      if (diff === minLRDiff) ret.leftRight = { diff, line }
      else if (Math.abs(diff) < Math.abs(minLRDiff)) {
        ret.left = initial
        ret.right = initial
        ret.leftRight = { diff, line }
        minLRDiff = diff
      }
    }
    for (const line of [box.left, box.left + box.width]) {
      diff = line - left
      if (diff === minLRDiff) ret.left = { diff, line }
      else if (Math.abs(diff) < Math.abs(minLRDiff)) {
        ret.left = { diff, line }
        ret.right = initial
        ret.leftRight = initial
        minLRDiff = diff
      }

      diff = line - right
      if (diff === minLRDiff) ret.right = { diff, line }
      else if (Math.abs(diff) < Math.abs(minLRDiff)) {
        ret.left = initial
        ret.right = { diff, line }
        ret.leftRight = initial
        minLRDiff = diff
      }
    }
  })
  return ret
}
export function checkSnapResize(top, left, width, height, nonTargetBoxs, snapSize, resizer) {
  let ret = { top: { diff: 0, line: -1 }, bottom: { diff: 0, line: -1 }, topBottom: { diff: 0, line: -1 }, left: { diff: 0, line: -1 }, right: { diff: 0, line: -1 }, leftRight: { diff: 0, line: -1 } }
  let minTBDiff = snapSize, minLRDiff = snapSize

  nonTargetBoxs.forEach((box) => {
    box = box.toJS()
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
      if (resizer !== 'bottomResizer') {
        differ = horizonalLine - top
        if (differ === minTBDiff) ret.top = { diff: differ, line: horizonalLine }
        else if (Math.abs(differ) < Math.abs(minTBDiff)) {
          ret.top = { diff: differ, line: horizonalLine }
          ret.bottom = { diff: 0, line: -1 }
          ret.topBottom = { diff: 0, line: -1 }
          minTBDiff = differ
        }
      }

      if (resizer !== 'topResizer') {
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
      if (resizer !== 'rightResizer') {
        differ = verticalLine - left
        if (differ === minLRDiff) ret.left = { diff: differ, line: verticalLine }
        else if (Math.abs(differ) < Math.abs(minLRDiff)) {
          ret.left = { diff: differ, line: verticalLine }
          ret.right = { diff: 0, line: -1 }
          ret.leftRight = { diff: 0, line: -1 }
          minLRDiff = differ
        }
      }

      if (resizer !== 'leftResizer') {
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
  })

  return ret
}
