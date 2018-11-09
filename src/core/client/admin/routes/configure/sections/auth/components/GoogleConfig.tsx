import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { HorizontalGutter, TextLink, Typography } from "talk-ui/components";

import HorizontalRule from "../../../components/HorizontalRule";
import ClientIDField from "./ClientIDField";
import ClientSecretField from "./ClientSecretField";
import ConfigBoxWithToggleField from "./ConfigBoxWithToggleField";
import RedirectField from "./RedirectField";
import RegistrationField from "./RegistrationField";
import TargetFilterField from "./TargetFilterField";

interface Props {
  disabled?: boolean;
  callbackURL: string;
}

const GoogleLink = () => (
  <TextLink target="_blank">
    {
      "https://developers.google.com/identity/protocols/OAuth2WebServer#creatingcred"
    }
  </TextLink>
);

const GoogleConfig: StatelessComponent<Props> = ({ disabled, callbackURL }) => (
  <ConfigBoxWithToggleField
    title={
      <Localized id="configure-auth-google-loginWith">
        <span>Login with Google</span>
      </Localized>
    }
    name="auth.integrations.google.enabled"
    disabled={disabled}
  >
    {disabledInside => (
      <HorizontalGutter size="double">
        <Localized
          id="configure-auth-google-toEnableIntegration"
          link={<GoogleLink />}
        >
          <Typography>
            To enable the integration with Google Authentication you need to
            create and set up a web application. For more information visit:<br />
            https://developers.google.com/identity/protocols/OAuth2WebServer#creatingcred
          </Typography>
        </Localized>
        <ClientIDField
          name="auth.integrations.google.clientID"
          disabled={disabledInside}
        />
        <ClientSecretField
          name="auth.integrations.google.clientSecret"
          disabled={disabledInside}
        />
        <TargetFilterField
          label={
            <Localized id="configure-auth-google-useLoginOn">
              <span>Use Google login on</span>
            </Localized>
          }
          name="auth.integrations.google.targetFilter"
          disabled={disabledInside}
        />
        <RegistrationField
          name="auth.integrations.google.allowRegistration"
          disabled={disabledInside}
        />
        <HorizontalRule />
        <RedirectField url={callbackURL} />
      </HorizontalGutter>
    )}
  </ConfigBoxWithToggleField>
);

export default GoogleConfig;
