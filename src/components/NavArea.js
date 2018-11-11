import React, { Component } from 'react';
import PropTypes from 'prop-types';

const NavItem = ({ text, flex, img }) => {
  const style = { flex: flex + ' ' + flex + ' auto' };
  const imgStyle = {};
  if (img === undefined) {
    style.fontWeight = '800';
    style.fontSize = '20px';
    imgStyle.display = 'none';
  } else imgStyle.backgroundImage = 'url(' + img + ')';
  return (
    <div className='nav-item' style={style}>
      <div className='nav-item-img' style={imgStyle} />
      <div className='nav-item-text'>{text}</div>
    </div>
  );
};

NavItem.propTypes = {
  text: PropTypes.string.isRequired,
  flex: PropTypes.number.isRequired,
  img: PropTypes.string,
};

class NavArea extends Component {
  render() {
    return (
      <div id='navArea' className='area'>
        <NavItem text='DIV-CREATOR' flex={2} />
        <NavItem text='UNDO' flex={0.5} img='./img/undo.png' />
        <NavItem text='REDO' flex={0.5} img='./img/redo.png' />
        <NavItem text='' flex={20} />
        <NavItem text='SAVE' flex={1} img='./img/save.png' />
        <NavItem text='' flex={5} />
      </div>
    );
  }
}

export default NavArea;
