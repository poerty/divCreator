import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class LayoutBottom extends Component {
  render() {
    const style = { height: this.props.bottom };
    return <div className='layout layout-bottom' style={style} />;
  }
}

LayoutBottom.propTypes = {
  bottom: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => {
  return {
    bottom: state.mainReducer.getIn(['layout', 'bottom']),
  };
};

export default connect(mapStateToProps)(LayoutBottom);
