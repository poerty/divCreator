import React, { Component } from 'react';
import { connect } from 'react-redux';
import Box from './Box';
import SnapLine from './SnapLine';

class DragArea extends Component {
    render() {
        let rows=[]
        for(let i=0;i<this.props.boxList.length;i++){
            rows.push(<Box key={i} index={i} />);
        }
        return (
            <div id="dragArea" className="area">
                Target
                <SnapLine direction="top" locate={this.props.snapLine.top}/>
                <SnapLine direction="bottom" locate={this.props.snapLine.bottom}/>
                <SnapLine direction="left" locate={this.props.snapLine.left}/>
                <SnapLine direction="right" locate={this.props.snapLine.right}/>
                {rows}
            </div>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        boxList: state.drag.boxList,
        snapLine: state.drag.snapLine
    }
}

DragArea = connect(mapStateToProps)(DragArea);


export default DragArea;