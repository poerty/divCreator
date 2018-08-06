import React, { Component } from 'react'
import { connect } from 'react-redux'

class SnapLine extends Component {
  render () {
    let styles = {}
    if (this.props.dataKey === 'top' || this.props.dataKey === 'bottom') {
      styles.width = '100%'
      styles.top = this.props.locate - 1
    } else if (this.props.dataKey === 'left' || this.props.dataKey === 'right') {
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
    locate: state.drag.get('snapLine').get(ownProps.dataKey)
  }
}

SnapLine = connect(mapStateToProps)(SnapLine)

export default SnapLine
