import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Button } from 'plugin-api/beta/client/components/ui';
import styles from './DeleteMyAccountStep.css';

const DeleteMyAccountStep3 = props => (
  <div className={styles.step}>
    <h4 className={styles.subTitle}>
      Are you sure you want to delete your account?
    </h4>
    <p className={styles.description}>
      To confirm you would like to delete your account please type in the
      following phrase into the text box below:
    </p>
    <input
      className={styles.textBox}
      disabled={true}
      readOnly={true}
      value="delete"
    />
    <div className={cn(styles.actions)}>
      <Button
        className={cn(styles.button, styles.cancel)}
        onClick={props.cancel}
      >
        Cancel
      </Button>
      <Button
        className={cn(styles.button, styles.danger)}
        onClick={props.goToNextStep}
      >
        Delete My Account
      </Button>
    </div>
  </div>
);

DeleteMyAccountStep3.propTypes = {
  goToNextStep: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
};

export default DeleteMyAccountStep3;
