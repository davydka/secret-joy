import * as React from 'react';
import { graphql } from 'gatsby';
import { Link } from 'gatsby';

import * as styles from './styles.module.scss';

interface PageProps {
  data: {
    site: {
      siteMetadata: {
        name: string;
        tagline: string;
      };
    };
  };
}

export const pageQuery = graphql`
  query PageQuery {
    site {
      siteMetadata {
        name
        tagline
      }
    }
  }
`;

const Page2: React.FC<PageProps> = ({ data }) => {
  const { name, tagline } = data.site.siteMetadata;

  return (
    <div className={styles.container}>
      <h1>Page 2</h1>
      <p>{tagline}</p>
      <p>
        <Link to='/'>Home</Link>
      </p>
    </div>
  );
};

export default Page2;
