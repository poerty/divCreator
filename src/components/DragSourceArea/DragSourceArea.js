import React, { Component } from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';

import BoxSource from './BoxSource';

class DragSourceArea extends Component {
  render() {
    const boxSourceList = [];
    for (const boxSourceId in this.props.boxSourceList.toJS()) {
      boxSourceList.push(<BoxSource key={boxSourceId} dataKey={boxSourceId} />);
    }
    return (
      <div id='dragSourceArea' className='source-area area'>
        <div className='dragSource-boxs'>{boxSourceList}</div>
      </div>
    );
  }
}

DragSourceArea.propTypes = {
  boxSourceList: ImmutablePropTypes.map.isRequired,
};

const mapStateToProps = state => {
  return {
    boxSourceList: state.mainReducer.get('boxSourceList'),
  };
};

export default connect(mapStateToProps)(DragSourceArea);
