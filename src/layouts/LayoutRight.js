import React, { Component, } from 'react';
import { connect, } from 'react-redux';

import DragSourceArea from './../components/DragSourceArea/DragSourceArea';
import EditArea from './../components/EditArea';
import TabArea from './../components/TabArea';

class LayoutRight extends Component {
  render() {
    let style = {
      width: this.props.layout.get('right'),
    };

    let tabNames = ['GENERAL', 'CUSTOM', 'EDIT',];
    let tabContents = [<DragSourceArea />, <DragSourceArea />, <EditArea />,];

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

let mapStateToProps = (state, ownProps) => {
  return {
    layout: state.mainReducer.get('layout'),
  };
};

export default connect(mapStateToProps)(LayoutRight);
