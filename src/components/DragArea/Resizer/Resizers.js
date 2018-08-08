import React, { Component } from 'react'

import Resizer from './Resizer'

class Resizers extends Component {
  render () {
    return (
      <div>
        <Resizer dataKey='top' />
        <Resizer dataKey='bottom' />
        <Resizer dataKey='left' />
        <Resizer dataKey='right' />
      </div>
    )
  }
}

export default Resizers
