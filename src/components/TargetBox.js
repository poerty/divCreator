import React, { Component } from 'react';
import { connect } from 'react-redux';
import { drag, dragStart, dragEnd } from '../actions';
import './css/box.css';

import Resizer from './Resizer';
 
class TargetBox extends Component {
    render() {
        let style={
            width: this.props.resizerSize,
            height: this.props.resizerSize,
            position: "absolute",
            border: "1px solid black",
            background: "white"
        }
        let styleTop={...style,...{top: -(this.props.resizerSize+2)/2,left: "50%",marginLeft: -4}}
        let styleBottom={...style,...{bottom: -(this.props.resizerSize+2)/2,left: "50%",marginLeft: -4}}
        let styleLeft={...style,...{top: "50%",left: -(this.props.resizerSize+2)/2,marginTop: -4}}
        let styleRight={...style,...{top: "50%",right: -(this.props.resizerSize+2)/2,marginTop: -4}}
        return (
            <div
                id={this.props.id} 
                className={this.props.className}
                draggable={this.props.draggable}
                style={this.props.style}
                
                onDrag={this.props.onDrag.bind(this)}
                onDragStart={this.props.onDragStart.bind(this)}
                onDragEnd={this.props.onDragEnd.bind(this)}>
                
                <Resizer id={"topResizer"} className={"box resizer"} style={styleTop}/>
                <Resizer id={"bottomResizer"} className={"box resizer"} style={styleBottom}/>
                <Resizer id={"leftResizer"} className={"box resizer"} style={styleLeft}/>
                <Resizer id={"rightResizer"} className={"box resizer"} style={styleRight}/>
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