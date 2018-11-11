import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import DragSourceArea from './../components/DragSourceArea/DragSourceArea';
import EditArea from './../components/EditArea';
import TabArea from './../components/TabArea';

class LayoutRight extends Component {
  render() {
    const { right } = this.props;
    const style = { width: right };

    const tabNames = ['GENERAL', 'CUSTOM', 'EDIT'];
    const tabContents = [<DragSourceArea key={0} />, <DragSourceArea key={1} />, <EditArea key={2} />];

    return (
      <div className='layout layout-right' style={style}>
        <TabArea
          tabContents={tabContents}
          tabNames={tabNames}
          tabAreaClassName={'dragSource-tabs'}
          tabClassName={'dragSource-tab'}
        />
      </div>
    );
  }
}

LayoutRight.propTypes = {
  right: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => {
  return {
    right: state.mainReducer.getIn(['layout', 'right']),
  };
};

export default connect(mapStateToProps)(LayoutRight);
