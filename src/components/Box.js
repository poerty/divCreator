import React, { Component } from 'react'
import { connect } from 'react-redux'
import { mouseDown } from '../actions'

class Box extends Component {
  render () {
    return (
      <div
        id={this.props.dataKey}
        className='box'
        style={this.props.style}

        onMouseDown={this.props.onMouseDown.bind(this, this.props.dataKey)} />
    )
  }
}

let mapStateToProps = (state, ownProps) => {
  return {
    style: state.drag.get('boxList').get(String(ownProps.dataKey)).toObject()
  }
}
let mapDispatchToProps = (dispatch) => {
  return {
    onMouseDown: (id, e) => {
      dispatch(mouseDown(id + '', e.shiftKey))
      e.stopPropagation()
    }
  }
}

Box = connect(mapStateToProps, mapDispatchToProps)(Box)

export default Box
