import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mouseDown, mouseUp, drag, dragStart, dragEnd } from '../actions';
import './css/box.css';
 
class Box extends Component {
    render() {
        const styles={
            width: this.props.width,
            height: this.props.height,
            top: this.props.top,
            left: this.props.left,
            position: "absolute"
        }
        return (
            <div id={this.props.id}
                class='box'
                style={styles}
                draggable="true"
                
                onMouseDown={this.props.onMouseDown.bind(this)}
                onMouseUp={this.props.onMouseUp.bind(this)}
                onDrag={this.props.onDrag.bind(this)}
                onDragStart={this.props.onDragStart.bind(this)}
                onDragEnd={this.props.onDragEnd.bind(this)}>
                click this
            </div>
        );
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        onMouseDown: (e)=>dispatch(mouseDown(e.target.id)),
        onMouseUp: (e)=>dispatch(mouseUp(e.target.id)),
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

let mapStateToProps = (state,ownProps) => {
    return {
        id: state.drag.boxList[ownProps.index].id,
        width: state.drag.boxList[ownProps.index].width,
        height: state.drag.boxList[ownProps.index].height,
        top: state.drag.boxList[ownProps.index].top,
        left: state.drag.boxList[ownProps.index].left
    }
}

Box = connect(mapStateToProps)(Box);
 
Box = connect(undefined, mapDispatchToProps)(Box);
 
export default Box;