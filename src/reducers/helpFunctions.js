export function getHierarchy(boxHierarchy, id) {
  if (boxHierarchy.get(id) !== undefined) return boxHierarchy.get(id);

  return getHierarchy(
    boxHierarchy
      .filter(hierarch => hierarch.getIn(['boxIds', id,]) !== undefined)
      .get('boxHierarchy'),
    id
  );
}

export function getContainerRect(boxList) {
  let ret = { top: 10000, bottom: -1, left: 10000, right: -1, };
  for (let boxId in boxList.toObject()) {
    let box = boxList.get(boxId).toObject();
    ret.top = Math.min(ret.top, box.top);
    ret.bottom = Math.max(ret.bottom, box.top + box.height);
    ret.left = Math.min(ret.left, box.left);
    ret.right = Math.max(ret.right, box.left + box.width);
  }
  return ret;
}

export function getChildBoxIds(boxHierarchy, boxIds) {
  let newBoxIds = boxIds;
  newBoxIds = boxIds.reduce((map, id) => {
    return getHierarchy(boxHierarchy, id)
      .get('boxIds')
      .concat(map);
  }, newBoxIds);

  return newBoxIds;
}

// 두개 차이점은 resizer와 middle line 에서 *2 뿐... 싫으면 인자로 주던가
export function checkSnapDrag(
  top,
  left,
  width,
  height,
  nonTargetBoxs,
  snapSize
) {
  const ret = {
    top: -1,
    bottom: -1,
    topBottom: -1,
    left: -1,
    right: -1,
    leftRight: -1,
    topDiff: 0,
    leftDiff: 0,
  };
  const bottom = top + height,
    topBottom = top + 0.5 * height;
  const right = left + width,
    leftRight = left + 0.5 * width;
  let minTBDiff = snapSize,
    minLRDiff = snapSize;

  nonTargetBoxs.forEach(box => {
    box = box.toJS();
    let diff;

    for (const line of [box.top + 0.5 * box.height,]) {
      diff = line - topBottom;
      if (Math.abs(diff) < Math.abs(minTBDiff)) {
        ret.top = -1;
        ret.bottom = -1;
        ret.topBottom = line;
        minTBDiff = diff;
      } else if (diff === minTBDiff) ret.topBottom = line;
    }
    for (const line of [box.top, box.top + box.height,]) {
      diff = line - top;
      if (Math.abs(diff) < Math.abs(minTBDiff)) {
        ret.top = line;
        ret.bottom = -1;
        ret.topBottom = -1;
        minTBDiff = diff;
      } else if (diff === minTBDiff) ret.top = line;

      diff = line - bottom;
      if (Math.abs(diff) < Math.abs(minTBDiff)) {
        ret.top = -1;
        ret.bottom = line;
        ret.topBottom = -1;
        minTBDiff = diff;
      } else if (diff === minTBDiff) ret.bottom = line;
    }

    for (const line of [box.left + 0.5 * box.width,]) {
      diff = line - leftRight;
      if (Math.abs(diff) < Math.abs(minLRDiff)) {
        ret.left = -1;
        ret.right = -1;
        ret.leftRight = line;
        minLRDiff = diff;
      } else if (diff === minLRDiff) ret.leftRight = line;
    }
    for (const line of [box.left, box.left + box.width,]) {
      diff = line - left;
      if (Math.abs(diff) < Math.abs(minLRDiff)) {
        ret.left = line;
        ret.right = -1;
        ret.leftRight = -1;
        minLRDiff = diff;
      } else if (diff === minLRDiff) ret.left = line;

      diff = line - right;
      if (Math.abs(diff) < Math.abs(minLRDiff)) {
        ret.left = -1;
        ret.right = line;
        ret.leftRight = -1;
        minLRDiff = diff;
      } else if (diff === minLRDiff) ret.right = line;
    }
  });

  if (minTBDiff !== snapSize) ret.topDiff = minTBDiff;
  else {
    ret.top = -1;
    ret.bottom = -1;
    ret.topBottom = -1;
  }
  if (minLRDiff !== snapSize) ret.leftDiff = minLRDiff;
  else {
    ret.left = -1;
    ret.right = -1;
    ret.leftRight = -1;
  }
  return ret;
}
export function checkSnapResize(
  top,
  left,
  width,
  height,
  nonTargetBoxs,
  snapSize,
  resizer
) {
  const ret = {
    top: -1,
    bottom: -1,
    topBottom: -1,
    left: -1,
    right: -1,
    leftRight: -1,
    topDiff: 0,
    leftDiff: 0,
  };
  const bottom = top + height,
    topBottom = 2 * top + height;
  const right = left + width,
    leftRight = 2 * left + width;
  let minTBDiff = snapSize,
    minLRDiff = snapSize;

  nonTargetBoxs.forEach(box => {
    box = box.toJS();
    let diff;

    for (let line of [2 * box.top + box.height,]) {
      diff = line - topBottom;
      if (Math.abs(diff) < Math.abs(minTBDiff)) {
        ret.top = -1;
        ret.bottom = -1;
        ret.topBottom = line / 2;
        minTBDiff = diff;
      } else if (diff === minTBDiff) ret.topBottom = line / 2;
    }
    for (let line of [box.top, box.top + box.height,]) {
      if (resizer !== 'bottomResizer') {
        diff = line - top;
        if (Math.abs(diff) < Math.abs(minTBDiff)) {
          ret.top = line;
          ret.bottom = -1;
          ret.topBottom = -1;
          minTBDiff = diff;
        } else if (diff === minTBDiff) ret.top = line;
      }

      if (resizer !== 'topResizer') {
        diff = line - bottom;
        if (Math.abs(diff) < Math.abs(minTBDiff)) {
          ret.top = -1;
          ret.bottom = line;
          ret.topBottom = -1;
          minTBDiff = diff;
        } else if (diff === minTBDiff) ret.bottom = line;
      }
    }

    for (let line of [2 * box.left + box.width,]) {
      diff = line - leftRight;
      if (Math.abs(diff) < Math.abs(minLRDiff)) {
        ret.left = -1;
        ret.right = -1;
        ret.leftRight = line / 2;
        minLRDiff = diff;
      } else if (diff === minLRDiff) ret.leftRight = line / 2;
    }
    for (let line of [box.left, box.left + box.width,]) {
      if (resizer !== 'rightResizer') {
        diff = line - left;
        if (Math.abs(diff) < Math.abs(minLRDiff)) {
          ret.left = line;
          ret.right = -1;
          ret.leftRight = -1;
          minLRDiff = diff;
        } else if (diff === minLRDiff) ret.left = line;
      }

      if (resizer !== 'leftResizer') {
        diff = line - right;
        if (Math.abs(diff) < Math.abs(minLRDiff)) {
          ret.left = -1;
          ret.right = line;
          ret.leftRight = -1;
          minLRDiff = diff;
        } else if (diff === minLRDiff) ret.right = line;
      }
    }
  });

  if (minTBDiff !== snapSize) ret.topDiff = minTBDiff;
  else {
    ret.top = -1;
    ret.bottom = -1;
    ret.topBottom = -1;
  }
  if (minLRDiff !== snapSize) ret.leftDiff = minLRDiff;
  else {
    ret.left = -1;
    ret.right = -1;
    ret.leftRight = -1;
  }
  return ret;
}
