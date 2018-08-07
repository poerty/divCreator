import React, { Component } from 'react'
import { connect } from 'react-redux'

import DragArea from './../components/DragArea'

class LayoutMain extends Component {
  render () {
    let style = {
      left: this.props.layout.get('left'),
      right: this.props.layout.get('right')
    }
    return (
      <div
        className='layout layout-main'
        style={style}
      >
        <DragArea />
      </div>
    )
  }
}

let mapStateToProps = (state, ownProps) => {
  return {
    layout: state.drag.get('layout')
  }
}

LayoutMain = connect(mapStateToProps)(LayoutMain)

export default LayoutMain
