import React from 'react';
import cn from 'classnames';
import styles from './styles.css';
import Table from './Table';
import {Icon} from 'coral-ui';
import EmptyCard from '../../../components/EmptyCard';
import t from 'coral-framework/services/i18n';

import PropTypes from 'prop-types';

const People = (props) => {
  const {
    users = [],
    searchValue,
    onSearchChange,
    onHeaderClickHandler,
    onPageChange,
    totalPages,
    page,
    setRole,
    banUser,
    unBanUser,
    viewUserDetail,
  } = props;

  const hasResults = !!users.length;

  return (
    <div className={cn(styles.container, 'talk-admin-community-people-container')}>
      <div className={styles.leftColumn}>
        <div className={styles.searchBox}>
          <Icon name='search' className={styles.searchIcon}/>
          <input
            id="commenters-search"
            type="text"
            className={styles.searchBoxInput}
            value={searchValue}
            onChange={onSearchChange}
            placeholder={t('streams.search')}
          />
        </div>
      </div>
      <div className={styles.mainContent}>
        {
          hasResults
            ? <Table
              users={users}
              setRole={setRole}
              viewUserDetail={viewUserDetail}
              banUser={banUser}
              unBanUser={unBanUser}
              onHeaderClickHandler={onHeaderClickHandler}
              pageCount={totalPages}
              onPageChange={onPageChange}
              page={page}
            />
            : <EmptyCard>{t('community.no_results')}</EmptyCard>
        }
      </div>
    </div>
  );
};

People.propTypes = {
  onHeaderClickHandler: PropTypes.func,
  users: PropTypes.array,
  page: PropTypes.number.isRequired,
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func,
  totalPages: PropTypes.number,
  onPageChange: PropTypes.func,
  banUser: PropTypes.func.isRequired,
  unBanUser: PropTypes.func.isRequired,
  setRole: PropTypes.func.isRequired,
  viewUserDetail: PropTypes.func.isRequired,
};

export default People;
