import React from 'react';
import { graphql } from 'gatsby';
import { Link } from 'gatsby';

import styles from './styles.module.scss';

interface IndexPageProps {
  data: {
    site: {
      siteMetadata: {
        name: string;
        tagline: string;
      };
    };
  };
}

export const indexPageQuery = graphql`
  query IndexPageQuery {
    site {
      siteMetadata {
        name
        tagline
      }
    }
  }
`;

const IndexPage: React.FC<IndexPageProps> = ({ data }) => {
  const { name, tagline } = data.site.siteMetadata;

  return (
    <div className={styles.container}>
      <h1>{name}</h1>
      <p>{tagline}</p>
      <p>
        <Link to="/page-2">.::\ .::''\ |</Link>
      </p>
    </div>
  );
};

export default IndexPage;
