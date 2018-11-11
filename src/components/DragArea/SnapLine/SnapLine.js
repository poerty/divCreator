import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class SnapLine extends Component {
  render() {
    const styles = {};
    if (
      this.props.dataKey === 'top' ||
      this.props.dataKey === 'bottom' ||
      this.props.dataKey === 'topBottom'
    ) {
      styles.width = '100%';
      styles.top = this.props.locate - 1;
    } else if (
      this.props.dataKey === 'left' ||
      this.props.dataKey === 'right' ||
      this.props.dataKey === 'leftRight'
    ) {
      styles.height = '100%';
      styles.left = this.props.locate - 1;
    }

    return <div className={'snapLine'} style={styles} />;
  }
}

SnapLine.propTypes = {
  dataKey: PropTypes.string.isRequired,
  locate: PropTypes.number.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    locate: state.mainReducer.getIn(['snapLine', ownProps.dataKey]),
  };
};

export default connect(mapStateToProps)(SnapLine);
