import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  targetBoxDrag,
  targetBoxDragStart,
  targetBoxDragEnd
} from '../../actions';

import Resizers from './Resizer/Resizers';

class TargetBox extends Component {
  constructor(props) {
    super(props);

    const img = new Image();
    img.style.display = 'none';
    img.src =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
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
  onDragEndHandler(e) {
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
        className="box targetBox"
        draggable="true"
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

let mapStateToProps = (state, ownProps) => {
  return {
    targetBox: state.mainReducer.get('targetBox')
  };
};
let mapDispatchToProps = dispatch => {
  return {
    onDrag: (x, y, targetId) => dispatch(targetBoxDrag(x, y, targetId)),
    onDragStart: (x, y, targetId) =>
      dispatch(targetBoxDragStart(x, y, targetId)),
    onDragEnd: () => dispatch(targetBoxDragEnd())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TargetBox);
