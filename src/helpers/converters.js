const layoutToSize = style => {
  const { left, right, top, bottom } = style;
  const width = right - left;
  const height = bottom - top;
  return { left, top, width, height };
};

const sizeToLayout = style => {
  const { left, top, width, height } = style;
  const right = left + width;
  const bottom = top + height;
  return { left, right, top, bottom };
};

const pointWithinLayout = (point, layout) => {
  let { x, y } = point;
  const { left, right, top, bottom, width, height } = layout;
  if (x < left) x = left;
  if (x > width - right) x = width - right;
  if (y < top) y = top;
  if (y > height - bottom) y = height - bottom;

  return { x, y };
};

const boxsToBox = boxs => {
  const box = boxs.reduce(
    (layout, box) => {
      const { left, right, top, bottom } = sizeToLayout(box.toJS());
      layout.left = Math.min(left, layout.left);
      layout.right = Math.max(right, layout.right);
      layout.top = Math.min(top, layout.top);
      layout.bottom = Math.max(bottom, layout.bottom);
      return layout;
    },
    { left: 10000, right: 0, top: 10000, bottom: 0 }
  );
  const { left, right, top, bottom } = box;
  return {
    left,
    right,
    top,
    bottom,
    width: right - left,
    height: bottom - top
  };
};
const boxsToBoxSize = boxs => {
  return layoutToSize(
    boxs.reduce(
      (layout, box) => {
        const { left, right, top, bottom } = sizeToLayout(box.toJS());
        layout.left = Math.min(left, layout.left);
        layout.right = Math.max(right, layout.right);
        layout.top = Math.min(top, layout.top);
        layout.bottom = Math.max(bottom, layout.bottom);
        return layout;
      },
      { left: 10000, right: 0, top: 10000, bottom: 0 }
    )
  );
};

const convertBoxIds = (ids, byId, idCount) => {
  let _ids,
    _byId = byId;
  _ids = ids.map(id => {
    const idCountStr = String(idCount);
    idCount++;
    _byId = _byId.mapEntries(([key, box]) => {
      if (key === id) key = idCountStr;
      box = box.update('id', boxId => {
        if (boxId === id) return idCountStr;
        return boxId;
      });
      box = box.update('childIds', childIds =>
        childIds.map(childId => {
          if (childId === id) return idCountStr;
          return childId;
        })
      );
      return [key, box];
    });
    return idCountStr;
  });

  return { _ids, _byId, idCount };
};

const layoutPropToRealName = name => {
  switch (name) {
  case 'left':
    return 'realLeft';
  case 'top':
    return 'realTop';
  case 'width':
    return 'realWidth';
  case 'height':
    return 'realHeight';
  default:
    return name;
  }
};

const getChildIds = (boxList, id) => {
  let childIds = boxList[id].childIds;
  childIds = childIds.reduce((list, childId) => {
    return [...list, ...getChildIds(boxList, childId)];
  }, []);
  return [...childIds, id];
};

export {
  layoutToSize,
  sizeToLayout,
  pointWithinLayout,
  boxsToBox,
  boxsToBoxSize,
  convertBoxIds,
  layoutPropToRealName,
  getChildIds
};
