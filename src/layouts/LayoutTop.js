import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import NavArea from './../components/NavArea';

class LayoutTop extends Component {
  render() {
    const { top } = this.props;
    const style = { height: top };
    return (
      <div className='layout layout-top' style={style}>
        <NavArea />
      </div>
    );
  }
}

LayoutTop.propTypes = {
  top: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => {
  return {
    top: state.mainReducer.getIn(['layout', 'top']),
  };
};

export default connect(mapStateToProps)(LayoutTop);
