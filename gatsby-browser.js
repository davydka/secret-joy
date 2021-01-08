import React from 'react';

import Layout from './src/components/Layout/Layout';

// import './src/styles/fonts.scss';
// import './src/styles/resets.scss';
// import './src/styles/defaults.scss';

// export const wrapRootElement = wrapWithProvider;

export const wrapPageElement = ({ element, props }) => {
  // props provide same data to Layout as Page element will get
  // including location, data, etc - you don't need to pass it
  return <Layout {...props}>{element}</Layout>;
};

export const onInitialClientRender = () => {
  console.log('🎨🎨🎨 Initial Client Render 🎨🎨🎨');
};

// disabling for now...
export const shouldUpdateScroll = () => {
  return false;
};
