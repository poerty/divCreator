import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { changePage } from '../actions';

class PageLink extends Component {
  render() {
    return (
      <div
        className='pageLink'
        onClick={this.props.onClick.bind(this, this.props.pageId)}
      >
        {this.props.pageName}
      </div>
    );
  }
}

PageLink.propTypes = {
  pageId: PropTypes.number.isRequired,
  pageName: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => {
  return {
    onClick: (pageId) => dispatch(changePage(pageId)),
  };
};

export default connect(
  undefined,
  mapDispatchToProps
)(PageLink);
