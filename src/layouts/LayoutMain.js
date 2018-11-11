import React, { Component, } from 'react';
import { connect, } from 'react-redux';
import PropTypes from 'prop-types';
import { Map, } from 'immutable';
import DragArea from '../components/DragArea/DragArea';

class LayoutMain extends Component {
  render() {
    const { left, right, } = this.props.layout.toObject();
    const style = {
      left: left,
      right: right,
    };
    return (
      <div className='layout layout-main' style={style}>
        <DragArea />
      </div>
    );
  }
}

LayoutMain.propTypes = {
  layout: PropTypes.instanceOf(Map).isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  layout: state.mainReducer.get('layout'),
});

export default connect(mapStateToProps)(LayoutMain);
