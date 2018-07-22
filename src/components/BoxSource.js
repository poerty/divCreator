import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sourceMouseDown, sourceMouseUp, sourceDrag, sourceDragStart, sourceDragEnd } from '../actions';
import './css/box.css';
 
class BoxSource extends Component {
    render() {
        const styles={
            width: this.props.width,
            height: this.props.height,
            top: this.props.top,
            left: this.props.left,
            position: "absolute"
        }
        return (
            <div class='box'
                id={this.props.id}
                style={styles}
                draggable="true"
                
                onMouseDown={this.props.onMouseDown.bind(this)}
                onMouseUp={this.props.onMouseUp.bind(this)}
                onDragStart={this.props.onDragStart.bind(this)}
                onDragEnd={this.props.onDragEnd.bind(this)}>
                click this
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

let mapStateToProps = (state,ownProps) => {
    return {
        id: state.drag.boxSourceList[ownProps.index].id,
        width: state.drag.boxSourceList[ownProps.index].width,
        height: state.drag.boxSourceList[ownProps.index].height,
        top: state.drag.boxSourceList[ownProps.index].top,
        left: state.drag.boxSourceList[ownProps.index].left
    }
}

BoxSource = connect(mapStateToProps)(BoxSource);
 
BoxSource = connect(undefined, mapDispatchToProps)(BoxSource);
 
export default BoxSource;