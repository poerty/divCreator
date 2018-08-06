import React, { Component } from 'react'
import { connect } from 'react-redux'

import DragSourceArea from './../components/DragSourceArea'

class LayoutRight extends Component {
  render () {
    let style = {
      width: this.props.layout.right
    }
    return (
      <div
        className='layout layout-right'
        style={style}
      >
        <DragSourceArea />
      </div>
    )
  }
}

let mapStateToProps = (state, ownProps) => {
  return {
    layout: state.drag.get('layout').toObject()
  }
}

LayoutRight = connect(mapStateToProps)(LayoutRight)

export default LayoutRight
