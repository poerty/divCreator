import React, { Component } from 'react'
import { connect } from 'react-redux'
import { targetBoxDrag, targetBoxDragStart, targetBoxDragEnd } from '../../actions'

import Resizers from './Resizer/Resizers'

class TargetBox extends Component {
  render () {
    let img = new Image()
    img.style.display = 'none'
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
    this.img = img

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
        onDragStart={this.props.onDragStart.bind(this, this.img)}
        onDragEnd={this.props.onDragEnd.bind(this)}>

        <Resizers />
      </div>
    )
  }
}

let mapStateToProps = (state, ownProps) => {
  return {
    targetBox: state.boxReducer.get('targetBox')
  }
}
let mapDispatchToProps = (dispatch) => {
  return {
    onDrag: (e) => dispatch(targetBoxDrag(e.clientX, e.clientY, e.target.id)),
    onDragStart: (img, e) => {
      e.dataTransfer.setDragImage(img, 0, 0)
      dispatch(targetBoxDragStart(e.clientX, e.clientY, e.target.id))
    },
    onDragEnd: (e) => dispatch(targetBoxDragEnd(e))
  }
}

TargetBox = connect(mapStateToProps, mapDispatchToProps)(TargetBox)

export default TargetBox
