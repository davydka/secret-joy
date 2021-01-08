import * as React from 'react';

import * as styles from './styles.module.scss';

const Page: React.FC = ({ children }) => {
  return (
    <div className={styles.container}>persistant menu item here{children}</div>
  );
};

export default Page;
