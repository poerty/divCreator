import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { changeProp } from './../actions';

import OnBlurUpdateInput from './OnBlurUpdateInput';

const PropBoxContainer = ({ name, properties, onBlur }) => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: '10px',
    border: '1px solid lightgray',
    padding: '5px',
    paddingLeft: '10px',
  };
  const titleStyle = {
    color: 'darkgray',
    marginTop: '5px',
    marginBottom: '5px',
  };
  return (
    <div style={containerStyle}>
      <div style={titleStyle}>{name}</div>
      {properties.map(prop => {
        if (['top', 'left', 'width', 'height'].includes(prop.key)) {
          return (
            <OnBlurUpdateInput
              key={prop.key}
              name={prop.key}
              type={'number'}
              value={prop.value}
              onBlur={onBlur}
            />
          );
        } else {
          return (
            <OnBlurUpdateInput
              key={prop.key}
              name={prop.key}
              type={'string'}
              value={prop.value}
              onBlur={onBlur}
            />
          );
        }
      })}
    </div>
  );
};

PropBoxContainer.propTypes = {
  name: PropTypes.string.isRequired,
  properties: PropTypes.arrayOf(PropTypes.object).isRequired,
  onBlur: PropTypes.func.isRequired,
};

class EditArea extends Component {
  render() {
    const defaultProps = {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      background: 'gray',
      border: 'none',
    };
    const layoutProps = [];
    const styleProps = [];
    let boxId = 0;
    if (this.props.selectedBoxIds.size === 1) {
      boxId = this.props.selectedBoxIds.get(0);
      const boxInfo = Object.assign(
        {},
        defaultProps,
        this.props.boxList.get(boxId).toJS()
      );
      Object.keys(boxInfo).forEach(key => {
        if (['top', 'left', 'width', 'height'].includes(key))
          layoutProps.push({ key, value: boxInfo[key] });
        else if (['background', 'border'].includes(key))
          styleProps.push({ key, value: boxInfo[key] });
      });
    }

    return (
      <div id='EditArea' className='source-area area'>
        <PropBoxContainer
          name='LAYOUT'
          properties={layoutProps}
          onBlur={(name, value) =>
            this.props.onBlur(boxId, name, parseInt(value, 10))
          }
        />
        <PropBoxContainer
          name='STYLE'
          properties={styleProps}
          onBlur={(name, value) => this.props.onBlur(boxId, name, value)}
        />
      </div>
    );
  }
}

EditArea.propTypes = {
  selectedBoxIds: ImmutablePropTypes.list.isRequired,
  boxList: ImmutablePropTypes.map.isRequired,
  onBlur: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    selectedBoxIds: state.mainReducer.getIn(['targetBox', 'childIds']),
    boxList: state.mainReducer.getIn(['boxs', 'byId']),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onBlur: (boxId, propName, propValue) =>
      dispatch(changeProp(boxId, propName, propValue)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditArea);
