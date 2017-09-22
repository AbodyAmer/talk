import React from 'react';
import {Link} from 'react-router';
import styles from './NotFoundAsset.css';

const NotFound = (props) => (
  <div className={`mdl-card mdl-shadow--2dp ${styles.notFound}`}>
    <p>
      The provided asset id <Link to={`/admin/moderate/${props.assetId}`}>{props.assetId}</Link> does not exist.
      <Link className={styles.goToStreams} to="/admin/stories">Go to Streams</Link>
    </p>
  </div>
);

export default NotFound;
