import React, { Component, } from 'react';
import { connect, } from 'react-redux';
import PropTypes from 'prop-types';

class LayoutBottom extends Component {
  render() {
    let style = {
      height: this.props.layout.get('bottom'),
    };
    return <div className='layout layout-bottom' style={style} />;
  }
}

LayoutBottom.propTypes = {
  layout: PropTypes.number.isRequired,
};

let mapStateToProps = (state, ownProps) => {
  return {
    layout: state.mainReducer.get('layout'),
  };
};

export default connect(mapStateToProps)(LayoutBottom);
