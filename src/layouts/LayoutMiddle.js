import React, { Component } from 'react'
import { connect } from 'react-redux'

import LayoutMain from './LayoutMain'
import LayoutLeft from './LayoutLeft'
import LayoutRight from './LayoutRight'

class LayoutMiddle extends Component {
  render () {
    let style = {
      top: this.props.layout.top,
      bottom: this.props.layout.bottom
    }
    return (
      <div
        className='layout layout-middle'
        style={style}
      >
        <LayoutLeft />
        <LayoutMain />
        <LayoutRight />
      </div>
    )
  }
}

let mapStateToProps = (state, ownProps) => {
  return {
    layout: state.drag.get('layout').toObject()
  }
}

LayoutMiddle = connect(mapStateToProps)(LayoutMiddle)

export default LayoutMiddle
