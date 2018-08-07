import React, { Component } from 'react'
import { connect } from 'react-redux'

class LayoutBottom extends Component {
  render () {
    let style = {
      height: this.props.layout.get('bottom')
    }
    return (
      <div
        className='layout layout-bottom'
        style={style}
      />
    )
  }
}

let mapStateToProps = (state, ownProps) => {
  return {
    layout: state.drag.get('layout')
  }
}

LayoutBottom = connect(mapStateToProps)(LayoutBottom)

export default LayoutBottom
