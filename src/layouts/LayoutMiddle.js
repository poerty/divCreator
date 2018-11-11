import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import LayoutMain from './LayoutMain';
import LayoutLeft from './LayoutLeft';
import LayoutRight from './LayoutRight';

class LayoutMiddle extends Component {
  render() {
    const { top, bottom } = this.props;
    const style = { top, bottom };
    return (
      <div className='layout layout-middle' style={style}>
        <LayoutMain />
        <LayoutLeft />
        <LayoutRight />
      </div>
    );
  }
}

LayoutMiddle.propTypes = {
  top: PropTypes.number.isRequired,
  bottom: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  top: state.mainReducer.getIn(['layout', 'top']),
  bottom: state.mainReducer.getIn(['layout', 'bottom']),
});

export default connect(mapStateToProps)(LayoutMiddle);
