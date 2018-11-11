import React, { Component, } from 'react';
import { connect, } from 'react-redux';

import NavArea from './../components/NavArea';

class LayoutTop extends Component {
  render() {
    let style = {
      height: this.props.layout.get('top'),
    };
    return (
      <div className='layout layout-top' style={style}>
        <NavArea />
      </div>
    );
  }
}

let mapStateToProps = (state, ownProps) => {
  return {
    layout: state.mainReducer.get('layout'),
  };
};

export default connect(mapStateToProps)(LayoutTop);
