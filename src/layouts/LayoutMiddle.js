import React, { Component } from 'react'
import { connect } from 'react-redux'

import LayoutMain from './LayoutMain'
import LayoutLeft from './LayoutLeft'
import LayoutRight from './LayoutRight'

class LayoutMiddle extends Component {
  render() {
    let style = {
      top: this.props.layout.get('top'),
      bottom: this.props.layout.get('bottom')
    }
    return (
      <div
        className='layout layout-middle'
        style={style}
      >
        <LayoutMain />
        <LayoutLeft />
        <LayoutRight />
      </div>
    )
  }
}

let mapStateToProps = (state, ownProps) => {
  return {
    layout: state.mainReducer.get('layout')
  }
}

LayoutMiddle = connect(mapStateToProps)(LayoutMiddle)

export default LayoutMiddle
