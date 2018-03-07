---
title: Additional Plugins
permalink: /additional-plugins/
class: configuration
toc: true
---

Talk ships with several plugins that aren't enabled by default. These plugins
can be enabled by consulting the [Plugins Overview](./plugins/)
page.

## talk-plugin-like

Source: [plugins/talk-plugin-like](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-like)

Enables a `like` reaction button.

## talk-plugin-sort-most-liked

Source: [plugins/talk-plugin-sort-most-liked](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-sort-most-liked)

Requires: [talk-plugin-viewing-options](./default-plugins/#talk-plugin-viewing-options), [talk-plugin-like](#talk-plugin-like)

Provides a sort for the comments with the most `like` reactions first.

## talk-plugin-love

Source: [plugins/talk-plugin-love](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-love)

Enables a `love` reaction button.

## talk-plugin-sort-most-loved

Source: [plugins/talk-plugin-sort-most-loved](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-sort-most-loved)

Requires: [talk-plugin-viewing-options](./default-plugins/#talk-plugin-viewing-options), [talk-plugin-love](#talk-plugin-love)

Provides a sort for the comments with the most `love` reactions first.

## talk-plugin-remember-sort

Source: [plugins/talk-plugin-remember-sort](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-remember-sort)

Requires: [talk-plugin-viewing-options](./default-plugins/#talk-plugin-viewing-options)

Enables saving a user’s last sort selection as they browse other articles.

## talk-plugin-deep-reply-count

Source: [plugins/talk-plugin-deep-reply-count](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-deep-reply-count)

Enables counting of comments to include replies via a new graph edge. Not
recommended for large installations as it will unreasonably reduce the query
efficiency to compute this number.

## talk-plugin-slack-notifications

Source: [plugins/talk-plugin-slack-notifications](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-slack-notifications)

Enables all new comments that are written to be posted to a Slack channel as
well. Configure an
[Incoming Webhook](https://api.slack.com/incoming-webhooks)
app and provide that url in the form of the `SLACK_WEBHOOK_URL`
detailed below.

*Warning: On high volume sites, this means every single comment will flow into
Slack, if this isn't what you want, be sure to use the provided plugin as a
recipe to further customize the behavior*.

Configuration:

- `SLACK_WEBHOOK_URL` (**required**) - The webhook url that will be
  used to post new comments to.

## talk-plugin-toxic-comments

Source: [plugins/talk-plugin-toxic-comments](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-toxic-comments)

Using the [Perspective API](http://perspectiveapi.com/), this
plugin will warn users and reject comments that exceed the predefined toxicity
threshold. For more information on what Toxic Comments are, check out the
[Toxic Comments](./toxic-comments/) documentation.

Configuration:

- `TALK_PERSPECTIVE_API_KEY` (**required**) - The API Key for Perspective. You
  can register and get your own key at [http://perspectiveapi.com/](http://perspectiveapi.com/).
- `TALK_TOXICITY_THRESHOLD` - If the comments toxicity exceeds this threshold,
  the comment will be rejected. (Default `0.8`)
- `TALK_PERSPECTIVE_API_ENDPOINT` - API Endpoint for hitting the
  perspective API. (Default `https://commentanalyzer.googleapis.com/v1alpha1`)
- `TALK_PERSPECTIVE_TIMEOUT` - The timeout for sending a comment to
  be processed before it will skip the toxicity analysis, parsed by
  [ms](https://www.npmjs.com/package/ms). (Default `300ms`)
- `TALK_PERSPECTIVE_DO_NOT_STORE` - Whether the API is permitted to store comment and context from this request. Stored comments will be used for future research and community model building purposes to improve the API over time. (Default `true`) [Perspective API - Analize Comment Request](https://github.com/conversationai/perspectiveapi/blob/master/api_reference.md#analyzecomment-request)

## talk-plugin-subscriber

Source: [plugins/talk-plugin-subscriber](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-subscriber)

Enables a `Subscriber` badge to be added to comments where the author has the
`SUBSCRIBER` tag. This must match with a custom auth integration that adds the
tag to the users that are subscribed to the service.

## talk-plugin-akismet

Source: [plugins/talk-plugin-akismet](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-akismet)

Enables spam detection from [Akismet](https://akismet.com/). Comments will be passed to the Akismet API for spam detection. If a comment
is determined to be spam, it will prompt the user, indicating that the comment might be considered spam. If the user continues after this
point with the still spam-like comment, the comment will be reported as containing spam, and sent for moderator approval.

**Note: [Akismet](https://akismet.com/) is a premium service, charges may apply.**

Configuration:

- `TALK_AKISMET_API_KEY` (**required**) - The Akismet API key located on your account page.
- `TALK_AKISMET_SITE` (**required**) - The URL where you are embedding the comment stream on to provide context to Akismet. If you're hosting talk on https://talk.mynews.org/, and your news site is https://mynews.org/, then you should set this parameter to `https://mynews.org/`

## talk-plugin-notifications

Source: [plugins/talk-plugin-notifications](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-notifications){:target="_blank"}

Enables the Notification system for sending out enabled email notifications to
users when they interact with Talk. By itself, this plugin will not send
anything. You need to enable one of the `talk-plugin-notifications-category-*` plugins.

**Note that all `talk-plugin-notifications-*` plugins must be registered
*before* this plugin in order to work. For example:**

```js
{
  "server": [
    // ...
    "talk-plugin-notifications-category-reply",
    "talk-plugin-notifications",
    // ...
  ]
}
```
{:.no-copy}

Configuration:

- `DISABLE_REQUIRE_EMAIL_VERIFICATIONS` - When `TRUE`, it will disable the verification email check before sending notifications for those emails. **Note that organizations implementing a custom authentication system _must_ disable this feature, as they don't use our integrated auth**. (Default `FALSE`).

### talk-plugin-notifications-category-reply
{:.param}

Source: [plugins/talk-plugin-notifications-category-reply](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-notifications-category-reply){:target="_blank"}

Replies made to each user will trigger an email to be sent with the notification
details if enabled.

### talk-plugin-notifications-category-featured
{:.param}

Source: [plugins/talk-plugin-notifications-category-featured](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-notifications-category-featured){:target="_blank"}

When a comment is featured (via the `talk-plugin-featured-comments` plugin), the
user will receive a notification email.

### talk-plugin-notifications-category-staff
{:.param}

Source: [plugins/talk-plugin-notifications-category-staff](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-notifications-category-staff){:target="_blank"}

Replies made to each user by a staff member will trigger an email to be sent
with the notification details if enabled.
