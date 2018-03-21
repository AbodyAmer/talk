import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import t from 'coral-framework/services/i18n';
import Slot from 'coral-framework/components/Slot';
import DraftAreaContent from './DraftAreaContent';
import styles from './DraftArea.css';

// TODO: (kiwi) Need to adapt CSS classes post refactor to match the rest.

/**
 * An enhanced textarea to make comment drafts.
 */
export default class DraftArea extends React.Component {
  renderCharCount() {
    const { input, maxCharCount } = this.props;

    const className = cn(
      styles.charCount,
      'talk-plugin-commentbox-char-count',
      {
        [`${styles.charMax} talk-plugin-commentbox-char-max`]:
          input.body.length > maxCharCount,
      }
    );
    const remaining = maxCharCount - input.body.length;

    return (
      <div className={className}>
        {remaining} {t('comment_box.characters_remaining')}
      </div>
    );
  }

  render() {
    const {
      input,
      placeholder,
      id,
      disabled,
      label,
      charCountEnable,
      maxCharCount,
      onInputChange,
      isReply,
      isEdit,
      registerHook,
      unregisterHook,
      root,
      comment,
    } = this.props;

    return (
      <div id={id}>
        <div
          className={cn(styles.container, 'talk-plugin-commentbox-container')}
        >
          <label htmlFor={id} className="screen-reader-text" aria-hidden={true}>
            {label}
          </label>
          <Slot
            fill="draftArea"
            defaultComponent={DraftAreaContent}
            className={styles.content}
            passthrough={{
              root,
              comment,
              registerHook,
              unregisterHook,
              input,
              placeholder,
              id,
              onInputChange,
              disabled,
              isReply,
              isEdit,
            }}
          />
          <Slot fill="commentInputArea" />
        </div>
        {charCountEnable && maxCharCount > 0 && this.renderCharCount()}
      </div>
    );
  }
}

DraftArea.propTypes = {
  charCountEnable: PropTypes.bool,
  maxCharCount: PropTypes.number,
  id: PropTypes.string,
  input: PropTypes.object,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  onInputChange: PropTypes.func,
  disabled: PropTypes.bool,
  root: PropTypes.object.isRequired,
  comment: PropTypes.object,
  registerHook: PropTypes.func,
  unregisterHook: PropTypes.func,
  isReply: PropTypes.bool,
  isEdit: PropTypes.bool,
};
