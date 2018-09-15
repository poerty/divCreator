import React, { Component } from 'react'
import { connect } from 'react-redux'

class EditArea extends Component {
  render () {
    return (
      <div id='EditArea' className='source-area area'>
        <div className="dragSource-boxs">
        </div>
      </div>
    )
  }
}

let mapStateToProps = (state) => {
  return {
    boxSourceList: state.boxReducer.get('boxSourceList')
  }
}

EditArea = connect(mapStateToProps)(EditArea)

export default EditArea
