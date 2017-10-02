import {compose, gql} from 'react-apollo';
import FlagDetails from '../components/FlagDetails';
import {bindActionCreators} from 'redux';
import {withFragments, excludeIf} from 'plugin-api/beta/client/hocs';
import {viewUserDetail} from 'plugin-api/beta/client/actions/admin';
import {connect} from 'react-redux';
import {getSlotFragmentSpreads} from 'plugin-api/beta/client/utils';

const slots = [
  'adminCommentMoreFlagDetails',
];

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    viewUserDetail,
  }, dispatch)
});

const enhance = compose(
  connect(null, mapDispatchToProps),
  withFragments({
    root: gql`
      fragment CoralAdmin_FlagDetails_root on RootQuery {
        __typename
        ${getSlotFragmentSpreads(slots, 'root')}
      }
    `,
    comment: gql`
      fragment CoralAdmin_FlagDetails_comment on Comment {
        actions {
          __typename
          ... on FlagAction {
            id
            reason
            message
            user {
              id
              username
            }
          }
        }
        ${getSlotFragmentSpreads(slots, 'comment')}
      }
    `
  }),
  excludeIf(({comment: {actions}}) => !actions.some((action) => action.__typename === 'FlagAction')),
);

export default enhance(FlagDetails);
