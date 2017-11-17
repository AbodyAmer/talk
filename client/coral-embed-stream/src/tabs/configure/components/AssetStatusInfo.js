import React from 'react';
import {Button} from 'coral-ui';
import PropTypes from 'prop-types';
import t, {timeago} from 'coral-framework/services/i18n';

class AssetStatusInfo extends React.Component {

  timer = null;

  constructor(props) {
    super(props);
    this.setupTimer(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setupTimer(nextProps);
  }

  interval(closedAt) {
    const diff = new Date(closedAt).getTime() - new Date().getTime();
    return diff > 60000 ? 60000 : 1000;
  }

  setupTimer({closedAt, isClosed} = this.props) {
    if (this.timer && (isClosed || !closedAt)) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (isClosed || !closedAt) {
      this.timer = null;
      return;
    }
    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.timer = null;
        this.forceUpdate();
        this.setupTimer();
      }, this.interval(closedAt));
    }
  }

  render() {
    const {isClosed, closedAt, onClose, onOpen} = this.props;
    return (
      <div>
        <h3>{!isClosed ? t('configure.close') : t('configure.open')} {t('configure.comment_stream')}</h3>
        {(!isClosed && closedAt) ? <p>{t('configure.comment_stream_will_close')} {timeago(new Date(closedAt))}.</p> : ''}
        <div className="close-comments-intro-wrapper">
          <p>
            {!isClosed ? t('configure.open_stream_configuration') : t('configure.close_stream_configuration')}
          </p>
          <Button onClick={!isClosed ? onClose : onOpen}>
            {!isClosed ? t('configure.close_stream') : t('configure.open_stream')}
          </Button>
        </div>
      </div>
    );
  }
}

AssetStatusInfo.propTypes = {
  isClosed: PropTypes.bool.isRequired,
  closedAt: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
};

export default AssetStatusInfo;
