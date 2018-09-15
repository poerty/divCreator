import React, { Component } from 'react'
import { connect } from 'react-redux'
import { changeTab } from '../actions'

import DragSourceArea from './../components/DragSourceArea/DragSourceArea'
import EditArea from './../components/EditArea'

class LayoutRight extends Component {

  handleTabClick(tabName, e) {
    e.preventDefault()
    this.props.tabClick(tabName)
  }
  render () {
    let style = {
      width: this.props.layout.get('right')
    }

    let tabNames=['SOURCES','COMPONENTS','EDIT']
    let tabComponents=[(<DragSourceArea/>),(<DragSourceArea/>),(<EditArea/>)]
    let content=tabComponents[tabNames.indexOf(this.props.tab)]
    let tabs=tabNames.map((name)=>{
      let classes="dragSource-tab"+(name===this.props.tab?" selected":"")
      return (<div className={classes} onClick={this.handleTabClick.bind(this,name)}>{name}</div>)
    })
    
    return (
      <div
        className='layout layout-right'
        style={style}
      >
        <div className="dragSource-tabs">
          {tabs}
        </div>
        {content}
        <div>a</div>
      </div>
    )
  }
}

let mapStateToProps = (state, ownProps) => {
  return {
    layout: state.boxReducer.get('layout'),
    tab: state.boxReducer.getIn(['layoutTabs','right'])
  }
}

let mapDispatchToProps = (dispatch) => {
  return {
    tabClick: (tabName) => {
      console.log(tabName)
      dispatch(changeTab(tabName, "right"))
    }
  }
}

LayoutRight = connect(mapStateToProps, mapDispatchToProps)(LayoutRight)

export default LayoutRight
