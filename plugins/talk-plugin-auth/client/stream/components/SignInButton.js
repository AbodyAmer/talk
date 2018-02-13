import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'plugin-api/beta/client/components/ui';
import { t } from 'plugin-api/beta/client/services';

const SignInButton = ({ currentUser, showSignInDialog }) => (
  <div className="talk-stream-auth-sign-in-button">
    {!currentUser ? (
      <Button id="coralSignInButton" onClick={showSignInDialog} full>
        {t('talk-plugin-auth.login.sign_in_to_comment')}
      </Button>
    ) : null}
  </div>
);

SignInButton.propTypes = {
  currentUser: PropTypes.object,
  showSignInDialog: PropTypes.func,
};

export default SignInButton;
