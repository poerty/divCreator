import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sourceDragEnd } from '../actions';
 
class BoxSource extends Component {
    render() {
        let img = new Image();
        img.style.display="none";
        img.src = this.props.style.dragImgSrc;
        this.img=img;

        return (
            <div
            className="boxSourceContainer"
            draggable="true"
            
            onDragStart={this.props.onDragStart.bind(this,this.img)}
            onDragEnd={this.props.onDragEnd.bind(this,this.props.dataKey)}
            >
                <div className="boxSourceDragImage"/>
                <div>name</div>
            </div>
        );
    }
}

let mapStateToProps = (state,ownProps) => {
    return {
        style: state.drag.boxSourceList[ownProps.dataKey],
    }
}

BoxSource = connect(mapStateToProps)(BoxSource);

let mapDispatchToProps = (dispatch) => {
    return {
        onDragStart: (img,e)=>{
            e.dataTransfer.setDragImage(img, 50, 50);
            //dispatch(sourceDragStart(e.clientX,e.clientY,e.target.id))
        },
        onDragEnd: (key,e)=>dispatch(sourceDragEnd(e.clientX,e.clientY,e.target.id,key))
    }
}
 
BoxSource = connect(undefined, mapDispatchToProps)(BoxSource);
 
export default BoxSource;