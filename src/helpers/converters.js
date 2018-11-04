const layoutToSize = (style) => {
  const { left, right, top, bottom } = style
  const width = right - left
  const height = bottom - top
  return { left, top, width, height }
}

const sizeToLayout = (style) => {
  const { left, top, width, height } = style
  const right = left + width
  const bottom = top + height
  return { left, right, top, bottom }
}

const pointWithinLayout = (point, layout) => {
  let { x, y } = point
  const { left, right, top, bottom, width, height } = layout
  if (x < left) x = left
  if (x > width - right) x = width - right
  if (y < top) y = top
  if (y > height - bottom) y = height - bottom

  return { x, y }
}

const boxsToBoxSize = (boxs) => {
  return layoutToSize(boxs.reduce(
    (layout, box) => {
      const { left, right, top, bottom } = sizeToLayout(box.toJS())
      layout.left = Math.min(left, layout.left);
      layout.right = Math.max(right, layout.right);
      layout.top = Math.min(top, layout.top);
      layout.bottom = Math.max(bottom, layout.bottom);
      return layout;
    },
    { left: 10000, right: 0, top: 10000, bottom: 0, }
  ))
}

const convertBoxIds = (ids, byId, idCount) => {
  let _ids, _byId = byId
  _ids = ids.map((id) => {
    idCount++;
    const idCountStr = String(idCount)
    _byId = _byId.mapEntries(([key, box]) => {
      if (key === id) key = idCountStr
      box = box.update("id", (boxId) => {
        if (boxId === id) return idCountStr;
        return boxId;
      })
      box = box.update("childIds", (childIds) => childIds.map((childId) => {
        if (childId === id) return idCountStr
        return childId
      }))
      return [key, box]
    })
    return idCountStr
  })

  return { _ids, _byId, idCount }
}

export {
  layoutToSize,
  sizeToLayout,
  pointWithinLayout,
  boxsToBoxSize,
  convertBoxIds
}