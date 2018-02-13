import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logout } from 'plugin-api/beta/client/actions/auth';
import UserBox from '../components/UserBox';

const mapStateToProps = ({ auth }) => ({
  user: auth.user,
});

const mapDispatchToProps = dispatch => bindActionCreators({ logout }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserBox);
