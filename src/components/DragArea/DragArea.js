import React, { Component } from 'react'
import { connect } from 'react-redux'
import { mouseDown, contextMenu } from '../../actions'

import Box from './Box'
import TargetBox from './TargetBox'
import SnapLines from './SnapLine/SnapLines'
import ContextMenu from './ContextMenu'

class DragArea extends Component {
  constructor(props) {
    super(props)

    this.onMouseDownHandler = this.onMouseDownHandler.bind(this)
    this.onContextMenuHandler = this.onContextMenuHandler.bind(this)
  }
  onMouseDownHandler(e) {
    const { onMouseDown } = this.props
    onMouseDown(e.target.id, e.shiftKey)
  }
  onContextMenuHandler(e) {
    const { onContextMenu } = this.props
    onContextMenu(e.clientX, e.clientY)
    e.preventDefault()
  }
  render() {
    const boxIds = this.props.boxIds.toJS()
    const boxList = boxIds.map((boxId) => (<Box key={boxId} dataKey={boxId} />))
    boxList.push(<TargetBox key={-1} id={0} />)
    return (
      <div
        id='dragArea'
        className='area'
        onMouseDown={this.onMouseDownHandler}
        onContextMenu={this.onContextMenuHandler} >
        <SnapLines />
        {boxList}
        <ContextMenu />
      </div>
    )
  }
}

let mapStateToProps = (state, ownProps) => {
  return {
    boxIds: state.mainReducer.getIn(['boxs', 'ids']),
  }
}
let mapDispatchToProps = (dispatch) => {
  return {
    onMouseDown: (targetId, shiftKey) => dispatch(mouseDown(targetId, shiftKey)),
    onContextMenu: (x, y) => dispatch(contextMenu(x, y))
  }
}

DragArea = connect(mapStateToProps, mapDispatchToProps)(DragArea)

export default DragArea
