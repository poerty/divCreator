import React, { Component } from 'react';
import './App.css';
 
import DragArea from './components/DragArea';
import DragSourceArea from './components/DragSourceArea';
 
class App extends Component {
  render() {
    return (
      <div>
        <DragSourceArea />
        <DragArea />
      </div>
    );
  }
}
 
export default App;