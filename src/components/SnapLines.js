import React, { Component } from 'react'

import SnapLine from './SnapLine'

class SnapLines extends Component {
  render () {
    return (
      <div>
        <SnapLine dataKey='top' />
        <SnapLine dataKey='bottom' />
        <SnapLine dataKey='left' />
        <SnapLine dataKey='right' />
      </div>
    )
  }
}

export default SnapLines
