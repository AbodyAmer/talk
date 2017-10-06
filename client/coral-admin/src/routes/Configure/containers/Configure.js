import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose, gql} from 'react-apollo';
import withQuery from 'coral-framework/hocs/withQuery';
import {Spinner} from 'coral-ui';
import {notify} from 'coral-framework/actions/notification';
import merge from 'lodash/merge';
import {withUpdateSettings} from 'coral-framework/graphql/mutations';
import {getErrorMessages} from 'coral-framework/utils';
import {
  updatePending,
  clearPending,
} from '../../../actions/configure';

import Configure from '../components/Configure';

class ConfigureContainer extends Component {

  updateWordlist = (listName, list) => {
    this.props.updatePending({updater: {
      wordlist: {$apply: (wordlist) => {
        const changeSet = {[listName]: list};
        if (!wordlist) {
          return changeSet;
        }
        return {
          ...wordlist,
          ...changeSet,
        };
      }},
    }});
  };

  updateDomainlist = (listName, list) => {
    this.props.updatePending({updater: {
      domains: {$apply: (domains) => {
        const changeSet = {[listName]: list};
        if (!domains) {
          return changeSet;
        }
        return {
          ...domains,
          ...changeSet,
        };
      }},
    }});
  };

  updateSettings = (settings, {setError = {}} = {}) => {
    this.props.updatePending({updater: {$merge: settings}, errorUpdater: {$merge: setError}});
  };

  savePending = async () => {
    try {
      await this.props.updateSettings(this.props.pending);
      this.props.clearPending();
    }
    catch(err) {
      this.props.notify('error', getErrorMessages(err));
    }
  };

  render () {
    if(this.props.data.loading) {
      return <Spinner/>;
    }

    const merged = merge({}, this.props.root.settings, this.props.pending);

    return <Configure
      notify={this.props.notify}
      updateWordlist={this.updateWordlist}
      updateDomainlist={this.updateDomainlist}
      updateSettings={this.updateSettings}
      errors={this.props.errors}
      auth={this.props.auth}
      data={this.props.data}
      root={this.props.root}
      settings={merged}
      canSave={this.props.canSave}
      savePending={this.savePending}
    />;
  }
}

const withConfigureQuery = withQuery(gql`
  query TalkAdmin_Configure {
    settings {
      moderation
      requireEmailConfirmation
      infoBoxEnable
      infoBoxContent
      questionBoxEnable
      questionBoxContent
      premodLinksEnable
      questionBoxIcon
      autoCloseStream
      customCssUrl
      closedTimeout
      closedMessage
      editCommentWindowLength
      charCountEnable
      charCount
      organizationName
      wordlist {
        suspect
        banned
      }
      domains {
        whitelist
      }
    }
  }
  `, {
    options: () => ({
      variables: {},
    }),
  });

const mapStateToProps = (state) => ({
  auth: state.auth,
  pending: state.configure.pending,
  canSave: state.configure.canSave,
  errors: state.configure.errors,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    notify,
    updatePending,
    clearPending,
  }, dispatch);

export default compose(
  withUpdateSettings,
  withConfigureQuery,
  connect(mapStateToProps, mapDispatchToProps),
)(ConfigureContainer);

