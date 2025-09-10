import React from 'react';

interface LazyComponentWithPreload
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extends React.LazyExoticComponent<React.ComponentType<any>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  preload: () => Promise<any>;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyWithPreloading(importFn: () => Promise<any>) {
  const Component = React.lazy(importFn) as LazyComponentWithPreload;
  Component.preload = importFn;
  return Component;
}
