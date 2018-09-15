import React, { Component } from 'react'
import { connect } from 'react-redux'

class SnapLine extends Component {
  render () {
    let styles = {}
    if (this.props.dataKey === 'top' || this.props.dataKey === 'bottom' || this.props.dataKey === 'topBottom') {
      styles.width = '100%'
      styles.top = this.props.locate - 1
    } else if (this.props.dataKey === 'left' || this.props.dataKey === 'right' || this.props.dataKey === 'leftRight') {
      styles.height = '100%'
      styles.left = this.props.locate - 1
    }

    return (
      <div className={'snapLine'} style={styles} />
    )
  }
}

let mapStateToProps = (state, ownProps) => {
  return {
    locate: state.boxReducer.getIn(['snapLine',ownProps.dataKey])
  }
}

SnapLine = connect(mapStateToProps)(SnapLine)

export default SnapLine
