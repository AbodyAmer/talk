import React, { Component } from 'react';
import { compose, gql } from 'react-apollo';
import Indicator from '../../../components/Indicator';
import { withFragments } from 'plugin-api/beta/client/hocs';
import { handleIndicatorChange } from '../graphql';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withQueueConfig from '../hoc/withQueueConfig';
import baseQueueConfig from '../queueConfig';
import Slot from 'coral-framework/components/Slot';

class IndicatorContainer extends Component {
  subscriptions = [];

  handleCommentChange = (root, comment) => {
    return handleIndicatorChange(root, comment, this.props.queueConfig);
  };

  subscribeToUpdates() {
    const parameters = [
      {
        document: COMMENT_ADDED_SUBSCRIPTION,
        updateQuery: (
          prev,
          { subscriptionData: { data: { commentAdded: comment } } }
        ) => {
          return this.handleCommentChange(prev, comment);
        },
      },
      {
        document: COMMENT_FLAGGED_SUBSCRIPTION,
        updateQuery: (
          prev,
          { subscriptionData: { data: { commentFlagged: comment } } }
        ) => {
          return this.handleCommentChange(prev, comment);
        },
      },
      {
        document: COMMENT_ACCEPTED_SUBSCRIPTION,
        updateQuery: (
          prev,
          { subscriptionData: { data: { commentAccepted: comment } } }
        ) => {
          return this.handleCommentChange(prev, comment);
        },
      },
      {
        document: COMMENT_REJECTED_SUBSCRIPTION,
        updateQuery: (
          prev,
          { subscriptionData: { data: { commentRejected: comment } } }
        ) => {
          return this.handleCommentChange(prev, comment);
        },
      },
      {
        document: COMMENT_RESET_SUBSCRIPTION,
        updateQuery: (
          prev,
          { subscriptionData: { data: { commentReset: comment } } }
        ) => {
          return this.handleCommentChange(prev, comment);
        },
      },
    ];

    this.subscriptions = parameters.map(param =>
      this.props.data.subscribeToMore(param)
    );
  }

  unsubscribe() {
    this.subscriptions.forEach(unsubscribe => unsubscribe());
    this.subscriptions = [];
  }

  componentWillMount() {
    if (this.props.track) {
      this.subscribeToUpdates();
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.track && nextProps.track) {
      this.subscribeToUpdates();
    }
    if (this.props.track && !nextProps.track) {
      this.unsubscribe();
    }
  }

  render() {
    if (
      !this.props.root ||
      (!this.props.root.premodCount && !this.props.root.reportedCount)
    ) {
      return null;
    }

    return (
      <span>
        <Indicator />
        <Slot
          data={this.props.data}
          handleCommentChange={this.handleCommentChange}
          fill="adminModerationIndicator"
        />
      </span>
    );
  }
}

IndicatorContainer.propTypes = {
  data: PropTypes.object,
  root: PropTypes.object,
  track: PropTypes.bool,
  queueConfig: PropTypes.object,
};

const fields = `
  status
  actions {
    __typename
    ... on FlagAction {
      reason
    }
    user {
      id
      role
    }
  }
  status_history {
    type
    assigned_by {
      id
    }
  }
`;

const COMMENT_ADDED_SUBSCRIPTION = gql`
  subscription TalkAdmin_ModerationIndicator_CommentAdded {
    commentAdded {
      ${fields}
    }
  }
`;

const COMMENT_FLAGGED_SUBSCRIPTION = gql`
  subscription TalkAdmin_ModerationIndicator_CommentFlagged {
    commentFlagged {
      ${fields}
    }
  }
`;

const COMMENT_ACCEPTED_SUBSCRIPTION = gql`
  subscription TalkAdmin_ModerationIndicator_CommentAccepted {
    commentAccepted {
      ${fields}
    }
  }
`;

const COMMENT_REJECTED_SUBSCRIPTION = gql`
  subscription TalkAdmin_ModerationIndicator_CommentRejected {
    commentRejected {
      ${fields}
    }
  }
`;

const COMMENT_RESET_SUBSCRIPTION = gql`
  subscription TalkAdmin_ModerationIndicator_CommentReset {
    commentReset {
      ${fields}
    }
  }
`;

const mapStateToProps = state => ({
  track: state.moderation.indicatorTrack,
});

const enhance = compose(
  connect(mapStateToProps),
  withFragments({
    root: gql`
      fragment TalkAdmin_Moderation_Indicator_root on RootQuery {
        premodCount: commentCount(query: { statuses: [PREMOD] })
        reportedCount: commentCount(
          query: {
            statuses: [NONE, PREMOD, SYSTEM_WITHHELD]
            action_type: FLAG
          }
        )
      }
    `,
  }),
  withQueueConfig(baseQueueConfig)
);

export default enhance(IndicatorContainer);
