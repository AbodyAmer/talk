---
title: Authenticating with Talk
permalink: /integrating/authentication/
---

You can integrate Talk with any external authentication service that will enable
seamless single sign-on for users within your organization. There are a few
methods of doing so:

1. Passport Middleware
2. Custom Token Integration

Both methods work, but there are product decisions that will affect the overall
choice.

## Passport Middleware

You would choose the **Passport Middleware** route when you are OK using an auth
that is triggered from inside Talk that is not connected to an external auth
state (you don't use the auth anywhere else now). A great example of this is our
Facebook plugin.

## Custom Token Integration 

You can integrate Talk with any authentication service to enable single sign-on for users. The steps to do that are:

## Create auth middleware

Create a middleware service that generates a JWT, which is passed as an option to the Talk embed code (see https://github.com/coralproject/talk/blob/master/client/coral-embed/src/index.js#L36) OR embed bridge (see https://github.com/coralproject/talk/blob/master/client/coral-embed/src/index.js#L44).

## Generate a key to sign the JWT

Use https://github.com/coralproject/coralcert to generate a key with which to sign the JWTs and specify the secret as an environment variable (see https://coralproject.github.io/talk/advanced-configuration/#talk_jwt_secret). 

You may also provide configuration for other optional JWT components (see https://coralproject.github.io/talk/advanced-configuration/#).

## Create server plugin to handle auth

Provide an implementation for the tokenUserNotFound hook within a server side plugin (see https://github.com/coralproject/talk/blob/ef49d9a3d2acc4d2fc03b00e0c872dfbc57f005a/docs/_docs/04-04-plugins-server.md#field-tokenusernotfound) 
