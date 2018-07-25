import React, { Component } from 'react';
import { connect } from 'react-redux';
import { resizeDrag, resizeDragStart, resizeDragEnd } from '../actions';

class Resizer extends Component {
    render() {
        return (
            <div
                id={this.props.id} 
                className={this.props.className}
                style={this.props.style}
                
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