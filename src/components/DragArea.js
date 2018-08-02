import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mouseDown } from '../actions';

import Box from './Box';
import TargetBox from './TargetBox';
import SnapLines from './SnapLines';

class DragArea extends Component {
    render() {
        let boxList=[]
        for(let boxId of this.props.boxIds){
            boxList.push(<Box key={boxId} dataKey={boxId}/>);
        }
        boxList.push(<TargetBox key={-1} id={0}/>);
        return (
            <div 
                id="dragArea" 
                className="area"
                onMouseDown={this.props.onMouseDown.bind(this)}>
                <div>Target</div>
                <SnapLines />
                {boxList}
            </div>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        boxIds: state.drag.boxIds,
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