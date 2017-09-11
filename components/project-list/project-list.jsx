import React from 'react';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';
import ProjectCardSimple from '../project-card/project-card-simple.jsx';
import Utility from '../../js/utility.js';
import pageSettings from '../../js/app-page-settings';

class ProjectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inPageUpdate: false
    };
  }

  componentDidUpdate() {
    if (!this.state.inPageUpdate && this.props.restoreScrollPosition) {
      pageSettings.restoreScrollPosition();
    }
  }

  handleLoadMoreBtnClick() {
    ReactGA.event({
      category: `Broswe`,
      action: `View more tap`,
      label: window.location.pathname
    });
    this.props.fetchData();
    this.setState({inPageUpdate: true});
  }

  renderProjectCards() {
    return this.props.entries.map(project => {
      return <ProjectCardSimple key={project.id} onModerationMode={this.props.onModerationMode} {...Utility.processEntryData(project)} />;
    });
  }

  renderLoadingNotice() {
    if (!this.props.loadingData ) return null;

    // 3 empty <div></div> here are for the loading animation dots (done in CSS) to show.
    return <div className="loading my-5 d-flex justify-content-center align-items-center">
              <div></div>
              <div></div>
              <div></div>
            </div>;
  }

  renderViewMoreBtn() {
    if (!this.props.moreEntriesToFetch) return null;

    return <div className="view-more text-center">
            <button type="button" className="btn btn-outline-info" onClick={() => this.handleLoadMoreBtnClick()}>View more</button>
           </div>;
  }

  render() {
    return (<div className="project-list">
              <div className="projects row justify-content-center">
                { this.renderProjectCards() }
              </div>
              { this.renderLoadingNotice() }
              { this.renderViewMoreBtn() }
            </div>);
  }
}
ProjectList.propTypes = {
  entries: PropTypes.array.isRequired,
  loadingData: PropTypes.bool.isRequired,
  moreEntriesToFetch: PropTypes.bool.isRequired,
  fetchData: PropTypes.func.isRequired,
};
ProjectList.defaultProps = {
  entries: []
};

export default ProjectList;
