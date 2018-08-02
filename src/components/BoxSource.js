import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sourceDragStart, sourceDragEnd } from '../actions';
 
class BoxSource extends Component {
    render() {
        return (
            <div
            className="boxSourceContainer"
            draggable="true"
            
            onDragStart={this.props.onDragStart.bind(this,this.props.dataKey)}
            onDragEnd={this.props.onDragEnd.bind(this,this.props.dataKey)}
            >
                <div className="boxSourceDragImage"/>
                <div>name</div>
            </div>
        );
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        onDragStart: (key,e)=>{
            var img = new Image();
            img.style.display="none";
            img.src = 'https://dteyv52hbg2at.cloudfront.net/devices/common/rectangle/helper.png';
            e.dataTransfer.setDragImage(img, 50, 50);
            dispatch(sourceDragStart(e.clientX,e.clientY,e.target.id))
        },
        onDragEnd: (key,e)=>dispatch(sourceDragEnd(e.clientX,e.clientY,e.target.id,key))
    }
}
 
BoxSource = connect(undefined, mapDispatchToProps)(BoxSource);
 
export default BoxSource;