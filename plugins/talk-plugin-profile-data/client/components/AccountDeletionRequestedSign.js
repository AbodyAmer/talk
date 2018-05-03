import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { t } from 'plugin-api/beta/client/services';
import moment from 'moment';
import { Button, Icon } from 'plugin-api/beta/client/components/ui';
import styles from './AccountDeletionRequestedSign.css';
import { getErrorMessages } from 'coral-framework/utils';

class AccountDeletionRequestedSign extends React.Component {
  cancelAccountDeletion = async () => {
    const { cancelAccountDeletion, notify } = this.props;
    try {
      await cancelAccountDeletion();
      notify(
        'success',
        t('talk-plugin-profile-data.delete_request.account_deletion_cancelled')
      );
    } catch (err) {
      notify('error', getErrorMessages(err));
    }
  };

  render() {
    const { me: { scheduledDeletionDate } } = this.props.root;

    const deletionScheduledFor = moment(scheduledDeletionDate).format(
      'MMM Do YYYY, h:mm:ss a'
    );
    const deletionScheduledOn = moment(scheduledDeletionDate)
      .subtract(12, 'hours')
      .format('MMM Do YYYY, h:mm:ss a');

    return (
      <div className={styles.container}>
        <h4 className={styles.title}>
          <Icon name="warning" className={styles.icon} />{' '}
          {t(
            'talk-plugin-profile-data.delete_request.account_deletion_requested'
          )}
        </h4>
        <p className={styles.description}>
          {t('talk-plugin-profile-data.delete_request.received_on')}
          {deletionScheduledFor}.
        </p>
        <p className={styles.description}>
          {t(
            'talk-plugin-profile-data.delete_request.cancel_request_description'
          )}
          <b>
            {' '}
            {t('talk-plugin-profile-data.delete_request.before')}{' '}
            {deletionScheduledOn}
          </b>.
        </p>
        <div className={styles.actions}>
          <Button
            className={cn(styles.button, styles.secondary)}
            onClick={this.cancelAccountDeletion}
          >
            {t(
              'talk-plugin-profile-data.delete_request.cancel_account_deletion_request'
            )}
          </Button>
        </div>
      </div>
    );
  }
}

AccountDeletionRequestedSign.propTypes = {
  cancelAccountDeletion: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
  root: PropTypes.object.isRequired,
};

export default AccountDeletionRequestedSign;
