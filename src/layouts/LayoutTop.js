import React, { Component } from 'react'
import { connect } from 'react-redux'

class LayoutTop extends Component {
  render () {
    let style = {
      height: this.props.layout.top
    }
    return (
      <div
        className='layout layout-top'
        style={style}
      >
        div-creator
      </div>
    )
  }
}

let mapStateToProps = (state, ownProps) => {
  return {
    layout: state.drag.layout
  }
}

LayoutTop = connect(mapStateToProps)(LayoutTop)

export default LayoutTop
