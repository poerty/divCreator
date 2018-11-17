import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { changeProp } from './../actions';

import OnBlurUpdateInput from './OnBlurUpdateInput';

const PropBoxContainer = ({ name, properties, onBlur }) => {
  return (
    <div className={'propBoxContainer'}>
      <div className={'propTitle'}>{name}</div>
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
    const { selectedBoxIds, boxList, onBlur } = this.props;
    const defaultProps = {
      id: 0,
      top: 0, left: 0, width: 0, height: 0,
      background: 'gray', border: 'none',
    };
    let layoutProps = ['top', 'left', 'height', 'width'];
    let styleProps = ['background', 'border'];

    let boxInfo;
    let boxId = 0;
    if (selectedBoxIds.size === 0) {
      boxInfo = { ...defaultProps };
    } else if (selectedBoxIds.size === 1) {
      boxId = selectedBoxIds.get(0);
      boxInfo = { ...defaultProps, ...boxList.get(boxId).toJS() };
    }

    layoutProps = layoutProps.map(key => ({ key, value: boxInfo[key] }));
    styleProps = styleProps.map(key => ({ key, value: boxInfo[key] }));

    return (
      <div id='EditArea' className='source-area area'>
        <PropBoxContainer
          name='LAYOUT'
          properties={layoutProps}
          onBlur={(name, value) => onBlur(boxId, name, parseInt(value, 10))}
        />
        <PropBoxContainer
          name='STYLE'
          properties={styleProps}
          onBlur={(name, value) => onBlur(boxId, name, value)}
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
