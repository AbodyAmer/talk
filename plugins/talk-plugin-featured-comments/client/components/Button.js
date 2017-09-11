import React from 'react';
import cn from 'classnames';
import styles from './Button.css';
import {pluginName} from '../../package.json';
import {can} from 'plugin-api/beta/client/services';
import {withTags} from 'plugin-api/beta/client/hocs';
import {Icon} from 'plugin-api/beta/client/components/ui';

const Button = (props) => {
  const {alreadyTagged, deleteTag, postTag, user} = props;

  return can(user, 'MODERATE_COMMENTS') ? (
    <button
      className={cn([`${pluginName}-tag-button`, styles.button, {[styles.featured] : alreadyTagged}])}
      onClick={alreadyTagged ? deleteTag : postTag} >

      {alreadyTagged ?
        <Icon name="star" className={styles.icon} /> :
        <Icon name="star_border" className={styles.icon} />
      }

    </button>
  ) : null ;
};

export default withTags('featured')(Button);
