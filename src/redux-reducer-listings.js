/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import {memoizedSelector} from './redux-helpers.js';

const defaultState = {
  loading: false,
  items: {},
  inView: [],
  current: [],
  selected: null,
  sortCriteria: {
    sortBy: undefined,
    sortDir: undefined
  },
  filterCriteria: {
    minBeds: 0,
    minBaths: 0,
    minPrice: 0,
    maxPrice: 1000000
  },
  mapOpened: false,
  narrowLayout: false
};

function filter(items, inView, criteria) {
  return inView.map(id => items[id])
    .filter(item => (
      (item.price >= criteria.minPrice) &&
      (item.price <= criteria.maxPrice) &&
      (item.bedrooms >= criteria.minBeds) &&
      (item.bathrooms >= criteria.minBaths)
    )).map(item => item.id);
}

export function listings(prevState = defaultState, action) {
  switch (action.type) {
    case 'LISTINGS_REQUESTED':
      return {...prevState, loading: true};
    case 'LISTINGS_RECEIVED': {
      const {listings} = action;
      const inView = Object.keys(listings);
      const current = filter(listings, inView, prevState.filterCriteria);
      return {
        ...prevState,
        loading: false,
        items: {...prevState.items, ...listings},
        inView,
        current,
        selected: prevState.selected || current[0]
      };
    }
    case 'LISTING_SELECTED':
      return { ...prevState, selected: action.id };
    case 'LISTING_FILTER_CHANGED': {
      const criteria = {...prevState.filterCriteria, ...action.filterCriteria};
      const current = filter(prevState.items, prevState.inView, criteria);
      return {
        ...prevState,
        filterCriteria: criteria,
        current,
        selected: prevState.inView.indexOf(prevState.selected) ? prevState.selected : current[0]
      };
    }
    case 'LISTING_SORT_CHANGED':
      return { ...prevState, sortCriteria: action.sortCriteria };
    case 'MAP_OPENED_CHANGED':
      return { ...prevState, mapOpened: action.mapOpened };
    case 'NARROW_LAYOUT_CHANGED':
      return { ...prevState, narrowLayout: action.narrowLayout };
    default:
      return prevState;
  }
}

export const getSelectedItem = memoizedSelector(
  state => state.listings.items,
  state => state.listings.selected,
  (items, selected) => items && items[selected]
);

export const getCurrentItems = memoizedSelector(
  state => state.listings.items,
  state => state.listings.current,
  (items, current) => current.map(id => items[id])
);

export const getSortCriteria = state => state.listings.sortCriteria;
export const getFilterCriteria = state => state.listings.filterCriteria;
export const getMapOpened = state => state.listings.mapOpened;
export const getNarrowLayout = state => state.listings.narrowLayout;
