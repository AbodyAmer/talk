import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './ChangeUsername.css';
import { Button } from 'plugin-api/beta/client/components/ui';
import ChangeUsernameDialog from './ChangeUsernameDialog';
import ChangeEmailDialog from './ChangeEmailDialog';
import { t } from 'plugin-api/beta/client/services';
import InputField from './InputField';
import { getErrorMessages } from 'coral-framework/utils';
import validate from 'coral-framework/helpers/validate';
import errorMsj from 'coral-framework/helpers/error';

const initialState = {
  editing: false,
  showDialog: false,
  formData: {},
  errors: {},
};

class ChangeUsername extends React.Component {
  state = initialState;

  clearForm = () => {
    this.setState(initialState);
  };

  enableEditing = () => {
    this.setState({
      editing: true,
    });
  };

  disableEditing = () => {
    this.setState({
      editing: false,
    });
  };

  cancel = () => {
    this.clearForm();
    this.disableEditing();
  };

  showDialog = () => {
    this.setState({
      showDialog: true,
    });
  };

  onSave = async () => {
    this.showDialog();
  };

  saveChanges = async () => {
    const { newUsername } = this.state.formData;
    const { id } = this.props;

    try {
      await this.props.changeUsername({
        id,
        username: newUsername,
      });
      this.props.notify(
        'success',
        t('talk-plugin-auth.change_username.changed_username_success_msg')
      );
    } catch (err) {
      this.props.notify('error', getErrorMessages(err));
    }

    this.clearForm();
    this.disableEditing();
  };

  addError = err => {
    this.setState(({ errors }) => ({
      errors: { ...errors, ...err },
    }));
  };

  removeError = errKey => {
    this.setState(state => {
      const { [errKey]: _, ...errors } = state.errors;
      return {
        errors,
      };
    });
  };

  fieldValidation = (value, type, name) => {
    if (!value.length) {
      this.addError({
        [name]: t('talk-plugin-auth.change_password.required_field'),
      });
    } else if (!validate[type](value)) {
      this.addError({ [name]: errorMsj[type] });
    } else {
      this.removeError(name);
    }
  };

  onChange = e => {
    const { name, value, type, dataset } = e.target;
    const validationType = dataset.validationType || type;

    this.setState(
      state => ({
        formData: {
          ...state.formData,
          [name]: value,
        },
      }),
      () => {
        this.fieldValidation(value, validationType, name);
      }
    );
  };

  closeDialog = () => {
    this.setState({
      showDialog: false,
    });
  };

  hasError = err => {
    return Object.keys(this.state.errors).indexOf(err) !== -1;
  };

  isSaveEnabled = () => {
    const formHasErrors = !!Object.keys(this.state.errors).length;
    const validUsername =
      this.state.formData.newUsername &&
      this.state.formData.newUsername !== this.props.username;
    const validEmail =
      this.state.formData.newEmail &&
      this.state.formData.newEmail !== this.props.emailAddress;

    return !formHasErrors && (validUsername || validEmail);
  };

  render() {
    const { username, emailAddress } = this.props;
    const { editing } = this.state;

    return (
      <section
        className={cn('talk-plugin-auth--edit-profile', styles.container, {
          [styles.editing]: editing,
        })}
      >
        <ChangeUsernameDialog
          showDialog={this.state.showDialog}
          onChange={this.onChange}
          formData={this.state.formData}
          username={username}
          closeDialog={this.closeDialog}
          saveChanges={this.saveChanges}
        />

        <ChangeEmailDialog
          showDialog={this.state.showDialog}
          onChange={this.onChange}
          formData={this.state.formData}
          username={username}
          closeDialog={this.closeDialog}
          saveChanges={this.saveChanges}
        />

        {editing ? (
          <div className={styles.content}>
            <div className={styles.detailList}>
              <InputField
                icon="person"
                id="newUsername"
                name="newUsername"
                onChange={this.onChange}
                defaultValue={username}
                validationType="username"
                columnDisplay
              >
                <span className={styles.bottomText}>
                  {t('talk-plugin-auth.change_username.change_username_note')}
                </span>
              </InputField>
              <InputField
                icon="email"
                id="newEmail"
                name="newEmail"
                onChange={this.onChange}
                defaultValue={emailAddress}
                validationType="email"
                columnDisplay
              />
            </div>
          </div>
        ) : (
          <div className={styles.content}>
            <h2 className={styles.username}>{username}</h2>
            {emailAddress ? (
              <p className={styles.email}>{emailAddress}</p>
            ) : null}
          </div>
        )}
        {editing ? (
          <div className={styles.actions}>
            <Button
              className={cn(styles.button, styles.saveButton)}
              icon="save"
              onClick={this.onSave}
              disabled={!this.isSaveEnabled()}
            >
              {t('talk-plugin-auth.change_username.save')}
            </Button>
            <a className={styles.cancelButton} onClick={this.cancel}>
              {t('talk-plugin-auth.change_username.cancel')}
            </a>
          </div>
        ) : (
          <div className={styles.actions}>
            <Button
              className={styles.button}
              icon="settings"
              onClick={this.enableEditing}
            >
              {t('talk-plugin-auth.change_username.edit_profile')}
            </Button>
          </div>
        )}
      </section>
    );
  }
}

ChangeUsername.propTypes = {
  changeUsername: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
  username: PropTypes.string,
  emailAddress: PropTypes.string,
};

export default ChangeUsername;
