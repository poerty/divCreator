import React, { Component } from 'react';
import { connect } from 'react-redux';
import { drag, dragStart, dragEnd } from '../actions';
import './css/box.css';
 
class TargetBox extends Component {
    render() {
        return (
            <div
                id={this.props.id} 
                className={this.props.className}
                draggable={this.props.draggable}
                style={this.props.style}
                
                onDrag={this.props.onDrag.bind(this)}
                onDragStart={this.props.onDragStart.bind(this)}
                onDragEnd={this.props.onDragEnd.bind(this)}>

            </div>
        );
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

TargetBox = connect(undefined, mapDispatchToProps)(TargetBox);
 
export default TargetBox;