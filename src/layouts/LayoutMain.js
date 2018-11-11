import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DragArea from '../components/DragArea/DragArea';

class LayoutMain extends Component {
  render() {
    const { left, right } = this.props;
    const style = { left, right };
    return (
      <div className='layout layout-main' style={style}>
        <DragArea />
      </div>
    );
  }
}

LayoutMain.propTypes = {
  left: PropTypes.number.isRequired,
  right: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  left: state.mainReducer.getIn(['layout', 'left']),
  right: state.mainReducer.getIn(['layout', 'right']),
});

export default connect(mapStateToProps)(LayoutMain);
