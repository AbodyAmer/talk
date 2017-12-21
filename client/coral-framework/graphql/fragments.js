import {createDefaultResponseFragments} from '../utils';

// fragments defined here are automatically registered.
export default {
  ...createDefaultResponseFragments(
    'SetUserRoleResponse',
    'ChangeUsernameResponse',
    'BanUsersResponse',
    'UnBanUserResponse',
    'SetUserSuspensionStatusResponse',
    'SetCommentStatusResponse',
    'SetUsernameStatusResponse',
    'UnSuspendUserResponse',
    'SuspendUserResponse',
    'CreateCommentResponse',
    'CreateFlagResponse',
    'EditCommentResponse',
    'PostFlagResponse',
    'CreateDontAgreeResponse',
    'DeleteActionResponse',
    'ModifyTagResponse',
    'IgnoreUserResponse',
    'StopIgnoringUserResponse',
    'UpdateSettingsResponse',
    'UpdateAssetSettingsResponse',
    'UpdateAssetStatusResponse',
  )
};

