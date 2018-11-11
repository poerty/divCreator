import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  targetBoxResize,
  targetBoxResizeStart,
  targetBoxResizeEnd,
} from '../../../actions';

class Resizer extends Component {
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
    e.stopPropagation();
    onDrag(e.clientX, e.clientY, e.target.id);
  }
  onDragStartHandler(e) {
    const { onDragStart } = this.props;
    e.dataTransfer.setDragImage(this.img, 0, 0);
    e.stopPropagation();
    onDragStart(e.clientX, e.clientY, e.target.id);
  }
  onDragEndHandler(e) {
    const { onDragEnd } = this.props;
    e.stopPropagation();
    onDragEnd();
  }
  render() {
    const { dataKey, resizerSize } = this.props;
    const style = {
      width: resizerSize,
      height: resizerSize,
      position: 'absolute',
      border: '1px solid black',
      background: 'white',
    };
    const locate = -(resizerSize + 2) / 2;
    const margin = -resizerSize / 2;
    switch (dataKey) {
      case 'top': {
        style.top = locate;
        style.left = '50%';
        style.marginLeft = margin;
        break;
      }
      case 'bottom': {
        style.bottom = locate;
        style.left = '50%';
        style.marginLeft = margin;
        break;
      }
      case 'left': {
        style.left = locate;
        style.top = '50%';
        style.marginTop = margin;
        break;
      }
      case 'right': {
        style.right = locate;
        style.top = '50%';
        style.marginTop = margin;
        break;
      }
      default: {
        break;
      }
    }

    return (
      <div
        id={dataKey + 'Resizer'}
        className='box resizer'
        style={style}
        draggable
        onMouseDown={e => e.stopPropagation()}
        onDrag={this.onDragHandler}
        onDragStart={this.onDragStartHandler}
        onDragEnd={this.onDragEndHandler}
      />
    );
  }
}

Resizer.propTypes = {
  dataKey: PropTypes.string.isRequired,
  resizerSize: PropTypes.number.isRequired,
  onDrag: PropTypes.func.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => {
  return {
    onDrag: (x, y, id) => dispatch(targetBoxResize(x, y, id)),
    onDragStart: (x, y, id) => dispatch(targetBoxResizeStart(x, y, id)),
    onDragEnd: () => dispatch(targetBoxResizeEnd()),
  };
};

export default connect(
  undefined,
  mapDispatchToProps
)(Resizer);
