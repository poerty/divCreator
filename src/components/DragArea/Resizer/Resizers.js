import React, { Component } from 'react';

import Resizer from './Resizer';

class Resizers extends Component {
  render() {
    const resizerSize = 8;

    return (
      <div>
        <Resizer dataKey="top" resizerSize={resizerSize} />
        <Resizer dataKey="bottom" resizerSize={resizerSize} />
        <Resizer dataKey="left" resizerSize={resizerSize} />
        <Resizer dataKey="right" resizerSize={resizerSize} />
      </div>
    );
  }
}

export default Resizers;
