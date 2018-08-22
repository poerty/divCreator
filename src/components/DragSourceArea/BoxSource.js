import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sourceDragEnd } from '../../actions'

import html2canvas from 'html2canvas'

class BoxSource extends Component {
  render () {
    let img = new Image()
    img.style.display = 'none'
    img.src = this.props.style.get('dragImgSrc')
    this.img = img

    let style=this.props.style.toJS()
    let scale=Math.min(60/style.width,60/style.height)
    style.width=style.width*scale
    style.height=style.height*scale
    style.backgroundColor="lightgray"
    style.flexShrink="0"

    return (
      <div
        className='boxSourceContainer'
        draggable='true'

        onDragStart={this.props.onDragStart.bind(this, this.img)}
        onDragEnd={this.props.onDragEnd.bind(this, this.props.dataKey)}
      >
        <div style={{display:'flex',alignItems:'center', justifyContent:'center',width:'100%',height:'100%'}}>
          <div style={style}/>
        </div>
        <div style={{marginBottom: '3px'}}>{this.props.style.get('name')}</div>
      </div>
    )
  }
}

let mapStateToProps = (state, ownProps) => {
  return {
    style: state.drag.getIn(['boxSourceList',ownProps.dataKey])
  }
}
let mapDispatchToProps = (dispatch) => {
  return {
    onDragStart: (img, e) => {
      e.dataTransfer.setDragImage(img, 50, 50)
      // dispatch(sourceDragStart(e.clientX,e.clientY,e.target.id))
    },
    onDragEnd: (key, e) => dispatch(sourceDragEnd(e.clientX, e.clientY, e.target.id, key))
  }
}

BoxSource = connect(mapStateToProps, mapDispatchToProps)(BoxSource)

export default BoxSource
