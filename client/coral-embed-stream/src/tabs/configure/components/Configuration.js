import React from 'react';
import Checkbox from './Checkbox';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './Configuration.css';
import uuid from 'uuid/v4';

class Configuration extends React.Component {

  id = uuid();

  render() {
    const {title, children, className, onCheckbox, checked, ...rest} = this.props;
    return (
      <div {...rest} className={cn(styles.root, className)}>
        {checked !== undefined &&
          <div className={styles.action}>
            <Checkbox
              id={this.id}
              className={styles.checkbox}
              onChange={onCheckbox}
              checked={checked} />
          </div>
        }
        <div className={cn(styles.wrapper, {
          [styles.content]: checked !== undefined,
        })}>
          <label htmlFor={this.id} className={styles.title}>{title}</label>
          <div>
            {children}
          </div>
        </div>
      </div>
    );
  }
}

Configuration.propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  onCheckbox: PropTypes.func,
  checked: PropTypes.bool,
  children: PropTypes.node,
};

export default Configuration;
