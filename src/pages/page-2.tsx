import React from 'react';
import { Link } from 'gatsby';

import styles from './styles.module.scss';

const Page2: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>===============================================================</h1>
      <p>+++++++______________+++++++</p>
      <p>
        <Link to="/">Home</Link>
      </p>
    </div>
  );
};

export default Page2;
