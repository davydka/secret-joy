import React from 'react';

import Layout from './src/components/Layout/Layout';
// import wrapWithProvider from './wrap-with-provider'

// export const wrapRootElement = wrapWithProvider;

export const wrapPageElement = ({ element, props }) => {
  // props provide same data to Layout as Page element will get
  // including location, data, etc - you don't need to pass it
  if (props.location.pathname === '/404/') {
    return <div {...props}>{element}</div>;
  }
  return <Layout {...props}>{element}</Layout>;
};
