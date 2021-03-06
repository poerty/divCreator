import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import {
  targetBoxDrag,
  targetBoxDragStart,
  targetBoxDragEnd,
} from '../../actions';

import Resizers from './Resizer/Resizers';

class TargetBox extends Component {
  constructor(props) {
    super(props);

    const img = new Image();
    img.style.display = 'none';
    img.src = process.env.REACT_APP_VOID_IMGURL;
    this.img = img;
    this.onDragHandler = this.onDragHandler.bind(this);
    this.onDragStartHandler = this.onDragStartHandler.bind(this);
    this.onDragEndHandler = this.onDragEndHandler.bind(this);
  }
  onDragHandler(e) {
    const { onDrag } = this.props;
    onDrag(e.clientX, e.clientY, e.target.id);
  }
  onDragStartHandler(e) {
    const { onDragStart } = this.props;
    e.dataTransfer.setDragImage(this.img, 0, 0);
    onDragStart(e.clientX, e.clientY, e.target.id);
  }
  onDragEndHandler() {
    const { onDragEnd } = this.props;
    onDragEnd();
  }
  render() {
    const targetBox = this.props.targetBox.toJS();
    const { top, left, width, height } = targetBox;
    const style = { top, left, width, height };
    style.position = 'absolute';
    return (
      <div
        id={this.props.id}
        className='box targetBox'
        draggable='true'
        style={style}
        onDrag={this.onDragHandler}
        onDragStart={this.onDragStartHandler}
        onDragEnd={this.onDragEndHandler}
      >
        <Resizers />
      </div>
    );
  }
}

TargetBox.propTypes = {
  id: PropTypes.number.isRequired,
  targetBox: ImmutablePropTypes.map.isRequired,
  onDrag: PropTypes.func.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    targetBox: state.mainReducer.get('targetBox'),
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onDrag: (x, y, targetId) => dispatch(targetBoxDrag(x, y, targetId)),
    onDragStart: (x, y, targetId) =>
      dispatch(targetBoxDragStart(x, y, targetId)),
    onDragEnd: () => dispatch(targetBoxDragEnd()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TargetBox);
