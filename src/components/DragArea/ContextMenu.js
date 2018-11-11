import React, { Component, } from 'react';
import { connect, } from 'react-redux';
import {
  makeGroup,
  unmakeGroup,
  copyBox,
  pasteBox,
  deleteBox,
} from '../../actions';

class ContextMenu extends Component {
  constructor(props) {
    super(props);

    this.groupClickHandler = this.groupClickHandler.bind(this);
    this.ungroupClickHandler = this.ungroupClickHandler.bind(this);
    this.copyClickHandler = this.copyClickHandler.bind(this);
    this.pasteClickHandler = this.pasteClickHandler.bind(this);
    this.deleteClickHandler = this.deleteClickHandler.bind(this);
  }
  groupClickHandler(e) {
    const { groupClick, } = this.props;
    groupClick();
    e.stopPropagation();
  }
  ungroupClickHandler(e) {
    const { ungroupClick, } = this.props;
    ungroupClick();
    e.stopPropagation();
  }
  copyClickHandler(e) {
    const { copyClick, } = this.props;
    copyClick();
    e.stopPropagation();
  }
  pasteClickHandler(e) {
    const { pasteClick, } = this.props;
    pasteClick();
    e.stopPropagation();
  }
  deleteClickHandler(e) {
    const { deleteClick, } = this.props;
    deleteClick();
    e.stopPropagation();
  }
  render() {
    const style = this.props.style.toJS();
    if (style.visible === false) return null;

    const options = this.props.options.toJS();
    const optionList = {};
    for (let optionName in options) {
      if (optionName === 'separator') {
        optionList[optionName] = 'contextMenu--separator';
      } else if (options[optionName] === false) {
        optionList[optionName] =
          'contextMenu--option contextMenu--option__disabled';
      } else {
        optionList[optionName] = 'contextMenu--option';
      }
    }

    return (
      <div style={style} className='contextMenu'>
        <div
          className={optionList['group']}
          onMouseDown={this.groupClickHandler}
        >
          group
        </div>
        <div
          className={optionList['ungroup']}
          onMouseDown={this.ungroupClickHandler}
        >
          unGroup
        </div>
        <div className={optionList['component']}>component</div>
        <div className={optionList['uncomponent']}>uncomponent</div>
        <div className={optionList['copy']} onMouseDown={this.copyClickHandler}>
          copy
        </div>
        <div
          className={optionList['paste']}
          onMouseDown={this.pasteClickHandler}
        >
          paste
        </div>
        <div
          className={optionList['delete']}
          onMouseDown={this.deleteClickHandler}
        >
          delete
        </div>
        <div className={optionList['settings']}>Settings</div>
        <div className={optionList['separator']} />
        <div className={optionList['appInfo']}>About this app</div>
      </div>
    );
  }
}

let mapStateToProps = (state, ownProps) => {
  return {
    style: state.mainReducer.get('contextMenu').get('style'),
    options: state.mainReducer.get('contextMenu').get('options'),
  };
};
let mapDispatchToProps = dispatch => {
  return {
    groupClick: () => dispatch(makeGroup()),
    ungroupClick: () => dispatch(unmakeGroup()),
    copyClick: () => dispatch(copyBox()),
    pasteClick: () => dispatch(pasteBox()),
    deleteClick: () => dispatch(deleteBox()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContextMenu);
