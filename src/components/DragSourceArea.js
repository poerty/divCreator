import React, { Component } from 'react';
import { connect } from 'react-redux';

import BoxSource from './BoxSource';

class DragSourceArea extends Component {
    render() {
        let boxSourceList=[]
        for(let boxSourceId in this.props.boxSourceList){
            let styles={
                width: this.props.boxSourceList[boxSourceId].width,
                height: this.props.boxSourceList[boxSourceId].height,
                top: this.props.boxSourceList[boxSourceId].top,
                left: this.props.boxSourceList[boxSourceId].left,
                position: "absolute"
            }
            boxSourceList.push(<BoxSource key={boxSourceId} style={styles} id={boxSourceId} className={"box"} draggable={true}/>);
        }
        return (
            <div id="dragSourceArea" className="box area">
                Source
                {boxSourceList}
            </div>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        boxSourceList: state.drag.boxSourceList
    }
}

DragSourceArea = connect(mapStateToProps)(DragSourceArea);


export default DragSourceArea;