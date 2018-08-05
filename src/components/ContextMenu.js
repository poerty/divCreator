import React, { Component } from 'react'
import { connect } from 'react-redux'
import { makeGroup, unmakeGroup, copyBox, pasteBox, deleteBox } from '../actions'

class ContextMenu extends Component {
  render () {
    if (this.props.style.visible === false) return null

    let optionList = {}
    for (let optionName in this.props.options) {
      if(optionName==="separator"){
        optionList[optionName]=('contextMenu--separator')
      }
      else if(this.props.options[optionName]===false) {
        optionList[optionName]=('contextMenu--option contextMenu--option__disabled')
      }
      else {
        optionList[optionName]=('contextMenu--option')
      }
    }

    return (
      <div style={this.props.style} className='contextMenu'>
        <div className={optionList['group']} onMouseDown={this.props.group.bind(this)}>group</div>
        <div className={optionList['ungroup']} onMouseDown={this.props.unGroup.bind(this)}>unGroup</div>
        <div className={optionList['component']}>component</div>
        <div className={optionList['uncomponent']}>uncomponent</div>
        <div className={optionList['copy']} onMouseDown={this.props.copyBox.bind(this)}>copy</div>
        <div className={optionList['paste']} onMouseDown={this.props.pasteBox.bind(this)}>paste</div>
        <div className={optionList['delete']} onMouseDown={this.props.deleteBox.bind(this)}>delete</div>
        <div className={optionList['settings']}>Settings</div>
        <div className={optionList['separator']} />
        <div className={optionList['appInfo']}>About this app</div>
      </div>
    )
  }
}

let mapStateToProps = (state, ownProps) => {
  return {
    style: state.drag.contextMenu.style,
    options: state.drag.contextMenu.options
  }
}
let mapDispatchToProps = (dispatch) => {
  return {
    group: (e) => {
      dispatch(makeGroup())
      e.stopPropagation()
    },
    unGroup: (e) => {
      dispatch(unmakeGroup())
      e.stopPropagation()
    },
    copyBox: (e) => {
      dispatch(copyBox())
      e.stopPropagation()
    },
    pasteBox: (e) => {
      dispatch(pasteBox())
      e.stopPropagation()
    },
    deleteBox: (e) => {
      dispatch(deleteBox())
      e.stopPropagation()
    }
  }
}

ContextMenu = connect(mapStateToProps, mapDispatchToProps)(ContextMenu)

export default ContextMenu
