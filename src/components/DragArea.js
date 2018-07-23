import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mouseDown } from '../actions';

import Box from './Box';
import SelectedBoxs from './SelectedBoxs';
import SnapLine from './SnapLine';

class DragArea extends Component {
    render() {
        let boxList=[]
        for(let boxId in this.props.boxList){
            let styles={
                width: this.props.boxList[boxId].width,
                height: this.props.boxList[boxId].height,
                top: this.props.boxList[boxId].top,
                left: this.props.boxList[boxId].left,
                position: "absolute"
            }
            boxList.push(<Box key={boxId} style={styles} id={boxId} className={"box"} draggable={true}/>);
        }
        boxList.push(<SelectedBoxs key={-1} id={0}/>);
        return (
            <div 
                id="dragArea" 
                className="area"
                onMouseDown={this.props.onMouseDown.bind(this)}>
                Target
                <SnapLine direction="top" locate={this.props.snapLine.top}/>
                <SnapLine direction="bottom" locate={this.props.snapLine.bottom}/>
                <SnapLine direction="left" locate={this.props.snapLine.left}/>
                <SnapLine direction="right" locate={this.props.snapLine.right}/>
                {boxList}
            </div>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        boxList: state.drag.boxList,
        snapLine: state.drag.snapLine,
    }
}

DragArea = connect(mapStateToProps)(DragArea);

let mapDispatchToProps = (dispatch) => {
    return {
        onMouseDown: (e)=>dispatch(mouseDown(e.target.id,e.shiftKey))
    }
}

DragArea = connect(undefined, mapDispatchToProps)(DragArea);

export default DragArea;