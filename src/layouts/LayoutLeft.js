import React, { Component, } from "react";
import { connect, } from "react-redux";
import PropTypes from "prop-types";
import { Map, } from "immutable";
import PageListArea from "../components/PageListArea";

class LayoutLeft extends Component {
  render() {
    const { left, } = this.props;
    console.log(this.props);
    const style = {
      width: left,
    };
    return (
      <div className="layout layout-left" style={style}>
        <PageListArea />
        <div>a</div>
      </div>
    );
  }
}

LayoutLeft.propTypes = {
  left: PropTypes.number.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  left: state.boxReducer.getIn([ "layout", "left" ,]),
});

LayoutLeft = connect(mapStateToProps)(LayoutLeft);

export default LayoutLeft;
