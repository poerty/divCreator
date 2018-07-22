import React, { Component } from 'react';

class snapLine extends Component {
    render() {
        let styles={
            width: 0,
            height: 0,
            top: -1,
            left: -1,
            border: "1px solid black",
            position: "absolute"
        }
        if(this.props.direction==="top"){
            styles.width="100%";
            styles.top=this.props.top-1;
        }
        else if(this.props.direction==="left"){
            styles.height="100%";
            styles.left=this.props.left-1;
        }
        return (
            <div style={styles}>
            </div>
        );
    }
}

export default snapLine;