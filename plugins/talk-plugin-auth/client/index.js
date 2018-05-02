import UserBox from './stream/containers/UserBox';
import SignInButton from './stream/containers/SignInButton';
import SetUsernameDialog from './stream/containers/SetUsernameDialog';
import translations from './translations.yml';
import Login from './login/containers/Main';
import reducer from './login/reducer';
import DeleteMyAccount from './profile-settings/containers/DeleteMyAccount';
import AccountDeletionRequestedSign from './stream/containers/AccountDeletionRequestedSign';
import ChangePassword from './profile-settings/containers/ChangePassword';
import ChangeUsername from './profile-settings/containers/ChangeUsername';

export default {
  reducer,
  translations,
  slots: {
    stream: [
      AccountDeletionRequestedSign,
      UserBox,
      SignInButton,
      SetUsernameDialog,
    ],
    login: [Login],
    profileHeader: [ChangeUsername],
    profileSettings: [ChangePassword, DeleteMyAccount],
  },
};
