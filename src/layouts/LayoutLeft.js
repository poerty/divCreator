import React, { Component } from 'react'
import { connect } from 'react-redux'

class LayoutLeft extends Component {
  render () {
    let style = {
      width: this.props.layout.left
    }
    return (
      <div
        className='layout layout-left'
        style={style}
      />
    )
  }
}

let mapStateToProps = (state, ownProps) => {
  return {
    layout: state.drag.get('layout').toObject()
  }
}

LayoutLeft = connect(mapStateToProps)(LayoutLeft)

export default LayoutLeft
