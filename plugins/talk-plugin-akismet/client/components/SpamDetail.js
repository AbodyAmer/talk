import React from 'react';
import { CommentDetail } from 'plugin-api/beta/client/components';
import PropTypes from 'prop-types';
import { t } from 'plugin-api/beta/client/services';

const SpamLabel = () => (
  <CommentDetail
    icon={'add_box'}
    header={t('talk-plugin-akismet.spam_comment')}
  />
);

SpamLabel.propTypes = {
  comment: PropTypes.shape({
    actions: PropTypes.array,
    spam: PropTypes.spam,
  }),
};

export default SpamLabel;
