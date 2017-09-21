import React, {Component} from 'react';
import key from 'keymaster';
import styles from './styles.css';

import ModerationQueue from './ModerationQueue';
import ModerationMenu from './ModerationMenu';
import ModerationHeader from './ModerationHeader';
import ModerationKeysModal from '../../../components/ModerationKeysModal';
import StorySearch from '../containers/StorySearch';
import Slot from 'coral-framework/components/Slot';

export default class Moderation extends Component {
  constructor() {
    super();

    this.state = {
      selectedIndex: 0
    };

  }

  componentWillMount() {
    const {toggleModal, singleView} = this.props;

    key('s', () => singleView());
    key('shift+/', () => toggleModal(true));
    key('esc', () => toggleModal(false));
    key('j', this.select(true));
    key('k', this.select(false));
    key('f', this.moderate(false));
    key('d', this.moderate(true));
  }

  onClose = () => {
    this.props.toggleModal(false);
  }

  closeSearch = () => {
    const {toggleStorySearch} = this.props;
    toggleStorySearch(false);
  }

  openSearch = () => {
    this.props.toggleStorySearch(true);
  }

  moderate = (accept) => () => {
    const {acceptComment, rejectComment} = this.props;
    const {selectedIndex} = this.state;
    const comments = this.getComments();
    const comment = comments[selectedIndex];
    const commentId = {commentId: comment.id};

    if (accept) {
      comment.status !== 'ACCEPTED' && acceptComment(commentId);
    } else {
      comment.status !== 'REJECTED' && rejectComment(commentId);
    }
  }

  getComments = () => {
    const {root, activeTab} = this.props;
    return root[activeTab].nodes;
  }

  select = (next) => () => {
    if (next) {
      this.setState((state) => ({
        ...state,
        selectedIndex: state.selectedIndex < this.getComments().length - 1
          ? state.selectedIndex + 1 : state.selectedIndex
      }));
    } else {
      this.setState((state) => ({
        ...state,
        selectedIndex: state.selectedIndex > 0
          ? state.selectedIndex - 1 : state.selectedIndex
      }));
    }
  }

  componentWillUnmount() {
    key.unbind('s');
    key.unbind('shift+/');
    key.unbind('esc');
    key.unbind('j');
    key.unbind('k');
    key.unbind('f');
    key.unbind('d');
  }

  componentDidUpdate(_, prevState) {

    // If paging through using keybaord shortcuts, scroll the page to keep the selected
    // comment in view.
    if (prevState.selectedIndex !== this.state.selectedIndex) {

      // the 'smooth' flag only works in FF as of March 2017
      document.querySelector(`.${styles.selected}`).scrollIntoView({behavior: 'smooth'});
    }
  }

  render () {
    const {root, data, moderation, settings, viewUserDetail, hideUserDetail, activeTab, getModPath, queueConfig, handleCommentChange, ...props} = this.props;
    const {asset} = root;
    const assetId = asset && asset.id;

    const comments = root[activeTab];

    const activeTabCount = root[`${activeTab}Count`];
    const menuItems = Object.keys(queueConfig).map((queue) => ({
      key: queue,
      name: queueConfig[queue].name,
      icon: queueConfig[queue].icon,
      count: root[`${queue}Count`]
    }));

    return (
      <div>
        <ModerationHeader
          searchVisible={this.props.moderation.storySearchVisible}
          openSearch={this.openSearch}
          closeSearch={this.closeSearch}
          asset={asset}
        />
        <ModerationMenu
          asset={asset}
          getModPath={getModPath}
          items={menuItems}
          selectSort={this.props.setSortOrder}
          sort={this.props.moderation.sortOrder}
          activeTab={activeTab}
        />
        <ModerationQueue
          key={`${activeTab}_${this.props.moderation.sortOrder}`}
          data={this.props.data}
          root={this.props.root}
          currentAsset={asset}
          comments={comments.nodes}
          activeTab={activeTab}
          singleView={moderation.singleView}
          selectedIndex={this.state.selectedIndex}
          bannedWords={settings.wordlist.banned}
          suspectWords={settings.wordlist.suspect}
          showBanUserDialog={props.showBanUserDialog}
          showSuspendUserDialog={props.showSuspendUserDialog}
          acceptComment={props.acceptComment}
          rejectComment={props.rejectComment}
          loadMore={props.loadMore}
          assetId={assetId}
          sort={this.props.moderation.sortOrder}
          commentCount={activeTabCount}
          currentUserId={this.props.auth.user.id}
          viewUserDetail={viewUserDetail}
          hideUserDetail={hideUserDetail}
        />
        <ModerationKeysModal
          hideShortcutsNote={props.hideShortcutsNote}
          shortcutsNoteVisible={moderation.shortcutsNoteVisible}
          open={moderation.modalOpen}
          onClose={this.onClose}/>

        <StorySearch
          assetId={assetId}
          moderation={this.props.moderation}
          closeSearch={this.closeSearch}
          storySearchChange={this.props.storySearchChange}
        />

        <Slot
          data={data}
          queryData={{root, asset}}
          activeTab={activeTab}
          handleCommentChange={handleCommentChange}
          fill='adminModeration'
        />
      </div>
    );
  }
}
