import React, { Component } from 'react'
import { connect } from 'react-redux'
import PageListArea from '../components/PageListArea';

class LayoutLeft extends Component {
  render () {
    let style = {
      width: this.props.layout.get('left')
    }
    return (
      <div
        className='layout layout-left'
        style={style}>
        <PageListArea/>
        <div>a</div>
      </div>
    )
  }
}

let mapStateToProps = (state, ownProps) => {
  return {
    layout: state.boxReducer.get('layout')
  }
}

LayoutLeft = connect(mapStateToProps)(LayoutLeft)

export default LayoutLeft
