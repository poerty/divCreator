import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PageListArea from '../components/PageListArea';

class LayoutLeft extends Component {
  render() {
    const { left } = this.props;
    const style = { width: left };
    return (
      <div className='layout layout-left' style={style}>
        <PageListArea />
        <div>a</div>
      </div>
    );
  }
}

LayoutLeft.propTypes = {
  left: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  left: state.mainReducer.getIn(['layout', 'left']),
});

export default connect(mapStateToProps)(LayoutLeft);
