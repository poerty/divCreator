import React, { Component } from 'react'
import { connect } from 'react-redux'

import BoxSource from './BoxSource'

class DragSourceArea extends Component {
  render () {
    let boxSourceList = []
    for (let boxSourceId in this.props.boxSourceList.toJS()) {
      boxSourceList.push(<BoxSource key={boxSourceId} dataKey={boxSourceId}/>)
    }
    return (
      <div id='dragSourceArea' className='source-area area'>
        <div>Source</div>
        {boxSourceList}
      </div>
    )
  }
}

let mapStateToProps = (state) => {
  return {
    boxSourceList: state.drag.get('boxSourceList')
  }
}

DragSourceArea = connect(mapStateToProps)(DragSourceArea)

export default DragSourceArea
