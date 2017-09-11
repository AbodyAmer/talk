import React from 'react';
import cn from 'classnames';
import Tooltip from './Tooltip';
import styles from './ModerationActions.css';
import {Icon} from 'plugin-api/beta/client/components/ui';
import ClickOutside from 'coral-framework/components/ClickOutside';
import RejectCommentAction from '../containers/RejectCommentAction';
import ApproveCommentAction from '../containers/ApproveCommentAction';
import {Slot} from 'plugin-api/beta/client/components';

export default class ModerationActions extends React.Component {
  constructor() {
    super();

    this.state = {
      tooltip: false
    };
  }

  toogleTooltip = () => {
    const {tooltip} = this.state;
    this.setState({
      tooltip: !tooltip
    });
  }

  hideTooltip = () => {
    this.setState({
      tooltip: false
    });
  }

  render() {
    const {tooltip} = this.state;
    const {comment, asset, data} = this.props;

    return(
      <ClickOutside onClickOutside={this.hideTooltip}>
        <div className={cn(styles.moderationActions, 'talk-plugin-moderation-actions')}>
          <span onClick={this.toogleTooltip} className={cn(styles.arrow, 'talk-plugin-moderation-actions-arrow')}>
            {tooltip ? <Icon name="keyboard_arrow_up" className={styles.icon} /> : 
              <Icon name="keyboard_arrow_down" className={styles.icon} />}
          </span>
          {tooltip && (
            <Tooltip>

              <Slot
                className="talk-plugin-modetarion-actions-slot"
                fill="moderationActions"
                queryData={{comment, asset}}
                data={data}
              />

              <ApproveCommentAction comment={comment} />
              <RejectCommentAction comment={comment} />
            </Tooltip>
          )}
        </div>
      </ClickOutside>
    );
  }
}
