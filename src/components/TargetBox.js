import React, { Component } from 'react'
import { connect } from 'react-redux'
import { drag, dragStart, dragEnd } from '../actions'

import Resizers from './Resizers'

class TargetBox extends Component {
  render () {
    let targetBox=this.props.targetBox.toJS()
    let style = {
      width: targetBox.width,
      height: targetBox.height,
      top: targetBox.top,
      left: targetBox.left,
      position: 'absolute'
    }
    return (
      <div
        id={this.props.id}
        className='box targetBox'
        draggable='true'
        style={style}

        onDrag={this.props.onDrag.bind(this)}
        onDragStart={this.props.onDragStart.bind(this)}
        onDragEnd={this.props.onDragEnd.bind(this)}>

        <Resizers />
      </div>
    )
  }
}

let mapStateToProps = (state, ownProps) => {
  return {
    targetBox: state.drag.get('targetBox')
  }
}
let mapDispatchToProps = (dispatch) => {
  return {
    onDrag: (e) => dispatch(drag(e.clientX, e.clientY, e.target.id)),
    onDragStart: (e) => {
      var img = new Image()
      img.style.display = 'none'
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
      e.dataTransfer.setDragImage(img, 0, 0)
      dispatch(dragStart(e.clientX, e.clientY, e.target.id))
    },
    onDragEnd: (e) => dispatch(dragEnd(e))
  }
}

TargetBox = connect(mapStateToProps, mapDispatchToProps)(TargetBox)

export default TargetBox
