import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sourceMouseDown, sourceMouseUp, sourceDragStart, sourceDragEnd } from '../actions';
import './css/box.css';
 
class BoxSource extends Component {
    render() {
        return (
            <div 
                id={this.props.id}
                className={this.props.className}
                draggable={this.props.draggable}
                style={this.props.style}
                
                onMouseDown={this.props.onMouseDown.bind(this)}
                onMouseUp={this.props.onMouseUp.bind(this)}
                
                onDragStart={this.props.onDragStart.bind(this)}
                onDragEnd={this.props.onDragEnd.bind(this)}>
                drag this
            </div>
        );
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        onMouseDown: (e)=>dispatch(sourceMouseDown(e.target.id)),
        onMouseUp: (e)=>dispatch(sourceMouseUp(e.target.id)),
        onDragStart: (e)=>dispatch(sourceDragStart(e.clientX,e.clientY,e.target.id)),
        onDragEnd: (e)=>dispatch(sourceDragEnd(e.clientX,e.clientY,e.target.id))
    }
}
 
BoxSource = connect(undefined, mapDispatchToProps)(BoxSource);
 
export default BoxSource;