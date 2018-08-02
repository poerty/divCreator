import React, { Component } from 'react';
import { connect } from 'react-redux';
import { resizeDrag, resizeDragStart, resizeDragEnd } from '../actions';

class Resizer extends Component {
    render() {
        let resizerSize=8;
        let style={
            width: resizerSize,
            height: resizerSize,
            position: "absolute",
            border: "1px solid black",
            background: "white"
        }
        switch(this.props.dataKey){
            case "top":{
                style={...style,...{top: -(resizerSize+2)/2,left: "50%",marginLeft: -4}};
                break;
            }
            case "bottom":{
                style={...style,...{bottom: -(resizerSize+2)/2,left: "50%",marginLeft: -4}};
                break;
            }
            case "left":{
                style={...style,...{top: "50%",left: -(resizerSize+2)/2,marginTop: -4}};
                break;
            }
            case "right":{
                style={...style,...{top: "50%",right: -(resizerSize+2)/2,marginTop: -4}};
                break;
            }
            default:{
                break;
            }
        }
       
        return (
            <div
                id={this.props.dataKey+"Resizer"}
                className="box resizer"
                style={style}
                
                draggable={true}

                onDrag={this.props.onDrag.bind(this)}
                onDragStart={this.props.onDragStart.bind(this)}
                onDragEnd={this.props.onDragEnd.bind(this)}>
                
            </div>
        );
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        onDrag: (e)=>dispatch(resizeDrag(e.clientX,e.clientY,e.target.id)),
        onDragStart: (e)=>dispatch(resizeDragStart(e.clientX,e.clientY,e.target.id)),
        onDragEnd: (e)=>dispatch(resizeDragEnd(e.clientX,e.clientY,e.target.id))
    }
}

Resizer = connect(undefined, mapDispatchToProps)(Resizer);
 
export default Resizer;