import React, { Component } from 'react'
import { connect } from 'react-redux'
import { changePage } from '../actions'

class PageLink extends Component {
  render () {
    return (
      <div 
        className='pageLink'
        
        onClick={this.props.onClick.bind(this, this.props.pageId)}
      >
        {this.props.pageName}
      </div>
    )
  }
}

let mapDispatchToProps = (dispatch) => {
  return {
    onClick: (pageId, e) => dispatch(changePage(pageId))
  }
}

PageLink = connect(undefined, mapDispatchToProps)(PageLink)

export default PageLink
