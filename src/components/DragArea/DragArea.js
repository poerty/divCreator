import React, { Component } from 'react'
import { connect } from 'react-redux'
import { mouseDown, contextMenu } from '../../actions'

import Box from './Box'
import TargetBox from './TargetBox'
import SnapLines from './SnapLine/SnapLines'
import ContextMenu from './ContextMenu'

class DragArea extends Component {
  render () {
    let boxIds=this.props.boxIds.toJS()
    let boxList = []
    for(let boxId of boxIds){
      boxList.push(<Box key={boxId} dataKey={boxId}/>)
    }
    boxList.push(<TargetBox key={-1} id={0} />)
    return (
      <div
        id='dragArea'
        className='area'
        onMouseDown={this.props.onMouseDown.bind(this)}
        onContextMenu={this.props.onContextMenu.bind(this)} >
        <div>Target</div>
        <SnapLines />
        {boxList}
        <ContextMenu />
      </div>
    )
  }
}

let mapStateToProps = (state, ownProps) => {
  return {
    boxIds: state.drag.get('boxIds')
  }
}
let mapDispatchToProps = (dispatch) => {
  return {
    onMouseDown: (e) => {
      dispatch(mouseDown(e.target.id, e.shiftKey))
    },
    onContextMenu: (e) => {
      dispatch(contextMenu(e.clientX, e.clientY))
      e.preventDefault()
    }
  }
}

DragArea = connect(mapStateToProps, mapDispatchToProps)(DragArea)

export default DragArea
