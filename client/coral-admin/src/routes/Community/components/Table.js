import React from 'react';
import styles from '../components/Table.css';
import t from 'coral-framework/services/i18n';
import PropTypes from 'prop-types';
import {Dropdown, Option} from 'coral-ui';
import cn from 'classnames';

const headers = [
  {
    title: t('community.username_and_email'),
    field: 'username'
  },
  {
    title: t('community.account_creation_date'),
    field: 'created_at'
  },
  {
    title: t('community.status'),
    field: 'status'
  },
  {
    title: t('community.newsroom_role'),
    field: 'role'
  }
];

const Table = ({users, onHeaderClickHandler, setRole, setCommenterStatus, viewUserDetail}) => (
  <table className={`mdl-data-table ${styles.dataTable}`}>
    <thead>
      <tr>
        {headers.map((header, i) =>(
          <th
            key={i}
            className="mdl-data-table__cell--non-numeric"
            scope="col"
            onClick={() => onHeaderClickHandler({field: header.field})}>
            {header.title}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {users.map((row, i)=> (
        <tr key={i}>
          <td className="mdl-data-table__cell--non-numeric">
            <button onClick={() => {viewUserDetail(row.id);}} className={cn(styles.username, styles.button)}>{row.username}</button>
            <span className={styles.email}>{row.profiles.map(({id}) => id)}</span>
          </td>
          <td className="mdl-data-table__cell--non-numeric">
            {row.created_at}
          </td>
          <td className="mdl-data-table__cell--non-numeric">
            <Dropdown 
              value={row.status}
              placeholder={t('community.status')}
              onChange={(status) => setCommenterStatus(row.id, status)}>     
              <Option value={'ACTIVE'} label={t('community.active')} />
              <Option value={'BANNED'} label={t('community.banned')} />
            </Dropdown>       
          </td>
          <td className="mdl-data-table__cell--non-numeric">
            <Dropdown
              value={row.roles[0] || ''}
              placeholder={t('community.role')}
              onChange={(role) => setRole(row.id, role)}>
              <Option value={''} label={t('community.none')} />
              <Option value={'STAFF'} label={t('community.staff')} />
              <Option value={'MODERATOR'} label={t('community.moderator')} />
              <Option value={'ADMIN'} label={t('community.admin')} />
            </Dropdown>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

Table.propTypes = {
  users: PropTypes.array,
  onHeaderClickHandler: PropTypes.func.isRequired,
  setRole: PropTypes.func.isRequired,
  setCommenterStatus: PropTypes.func.isRequired,
  viewUserDetail: PropTypes.func,
};

export default Table;
