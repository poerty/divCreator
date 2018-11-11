import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { mouseDown } from '../../actions';

class Box extends Component {
  constructor(props) {
    super(props);

    this.onMouseDownHandler = this.onMouseDownHandler.bind(this);
  }
  onMouseDownHandler(e) {
    const { onMouseDown, dataKey } = this.props;
    onMouseDown(dataKey + '', e.shiftKey);
    e.stopPropagation();
  }
  render() {
    const style = this.props.style.toJS();
    const dataKey = this.props.dataKey;
    return (
      <div
        id={dataKey}
        className='box'
        style={style}
        onMouseDown={this.onMouseDownHandler}
      />
    );
  }
}

Box.propTypes = {
  dataKey: PropTypes.string.isRequired,
  style: ImmutablePropTypes.map.isRequired,
  onMouseDown: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    style: state.mainReducer.getIn(['boxs', 'byId', ownProps.dataKey]),
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onMouseDown: (id, shiftKey) => dispatch(mouseDown(id, shiftKey)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Box);
