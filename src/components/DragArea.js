import React, { Component } from 'react';
import { connect } from 'react-redux';
import Box from './Box';

class DragArea extends Component {
    render() {
        let rows=[]
        for(let i=0;i<this.props.boxList.length;i++){
            rows.push(<Box key={i} index={i} />);
        }
        return (
            <div id="dragArea" class="area">
                {rows}
            </div>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        boxList: state.drag.boxList
    }
}

DragArea = connect(mapStateToProps)(DragArea);


export default DragArea;