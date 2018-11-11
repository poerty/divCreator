import React, { Component, } from 'react';
import { connect, } from 'react-redux';
import { sourceDragEnd, } from '../../actions';

class BoxSource extends Component {
  render() {
    let img = new Image();
    img.style.display = 'none';
    img.src = this.props.style.get('dragImgSrc');
    this.img = img;

    return (
      <div
        className='boxSourceContainer'
        draggable='true'
        onDragStart={this.props.onDragStart.bind(this, this.img)}
        onDragEnd={this.props.onDragEnd.bind(this, this.props.dataKey)}
      >
        <div
          className='boxSourceDragImage'
          style={{
            backgroundImage: 'url(' + this.props.style.get('dragImgSrc') + ')',
          }}
        />
        <div style={{ marginBottom: '3px', }}>
          {this.props.style.get('name')}
        </div>
      </div>
    );
  }
}

let mapStateToProps = (state, ownProps) => {
  return {
    style: state.mainReducer.getIn(['boxSourceList', ownProps.dataKey,]),
  };
};
let mapDispatchToProps = dispatch => {
  return {
    onDragStart: (img, e) => e.dataTransfer.setDragImage(img, 50, 50),
    onDragEnd: (key, e) =>
      dispatch(sourceDragEnd(e.clientX, e.clientY, e.target.id, key)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BoxSource);
