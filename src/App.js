import React, { Component } from 'react';
import './App.css';

import LayoutMiddle from './layouts/LayoutMiddle';
import LayoutTop from './layouts/LayoutTop';
import LayoutBottom from './layouts/LayoutBottom';

class App extends Component {

  render() {
    return (
      <div>
        <LayoutTop />
        <LayoutMiddle />
        <LayoutBottom />
      </div>
    );
  }
}

export default App;