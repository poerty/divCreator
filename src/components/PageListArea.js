import React, { Component } from 'react';
import { connect } from 'react-redux';

import PageLink from './PageLink';

class PageListArea extends Component {
  render() {
    let pageList = [];
    this.props.pageList.forEach((page, id) => {
      pageList.push(
        <PageLink
          key={'page' + id}
          pageId={id}
          pageName={page.get('pageName')}
        />
      );
    });
    return (
      <div id="pageListArea" className="">
        <div className="pageList-tabs">
          <div className="pageList-tab selected">PAGES</div>
          <div className="pageList-tab">COMPONENTS</div>
        </div>
        <div className="pageList-pages">{pageList}</div>
      </div>
    );
  }
}

let mapStateToProps = state => {
  return {
    pageList: state.mainReducer.get('pageList')
  };
};

export default connect(mapStateToProps)(PageListArea);
