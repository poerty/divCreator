import React, { Component } from 'react';
import { connect } from 'react-redux';
import { drag, dragStart, dragEnd } from '../actions';

import Resizers from './Resizers';
 
class TargetBox extends Component {
    render() {
        let style={
            width: this.props.targetBox.width,
            height: this.props.targetBox.height,
            top: this.props.targetBox.top,
            left: this.props.targetBox.left,
            position: "absolute"
        }
        return (
            <div
                id={this.props.id} 
                className="box targetBox"
                draggable="true"
                style={style}
                
                onDrag={this.props.onDrag.bind(this)}
                onDragStart={this.props.onDragStart.bind(this)}
                onDragEnd={this.props.onDragEnd.bind(this)}>
                
                <Resizers />
            </div>
        );
    }
}

let mapStateToProps = (state,ownProps) => {
    return {
        targetBox: state.drag.targetBox
    }
}
let mapDispatchToProps = (dispatch) => {
    return {
        onDrag: (e)=>dispatch(drag(e.clientX,e.clientY,e.target.id)),
        onDragStart: (e)=>{
            var img = new Image();
            img.style.display="none";
            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
            e.dataTransfer.setDragImage(img, 0, 0);
            dispatch(dragStart(e.clientX,e.clientY,e.target.id))
        },
        onDragEnd: (e)=>dispatch(dragEnd(e))
    }
}

TargetBox = connect(mapStateToProps, mapDispatchToProps)(TargetBox);
 
export default TargetBox;