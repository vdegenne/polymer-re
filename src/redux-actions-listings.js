/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import {fb} from './config.js';
// const fb = '/mock';

export function fetchListingsForBounds(bounds) {
  return dispatch => {
    dispatch({type: 'LISTINGS_REQUESTED', bounds});
    fetch(`${fb}/listings.json?orderBy="/longitude"&startAt=${bounds.west}&endAt=${bounds.east}`)
      .then(r => r.json())
      .then(listings => {
        const filtered = Object.keys(listings).filter(k => {
          const listing = listings[k];
          return (listing.latitude < bounds.north) &&
                 (listing.latitude > bounds.south) &&
                 (listing.longitude > bounds.west) &&
                 (listing.longitude < bounds.east);
        });
        listings = filtered.reduce((o,k) => (o[k]=listings[k], o), {});
        dispatch({type: 'LISTINGS_RECEIVED', listings});
      });
  }
}

export function fetchAndSelectListing(id) {
  return (dispatch, getState) => {
    const listings = getState().listings;
    if (!listings || !listings.items[id]) {
      dispatch({type: 'LISTING_REQUESTED', id});
      fetch(`${fb}/listings/${id}.json`)
        .then(r => r.json())
        .then(listing => {
          dispatch({type: 'LISTINGS_RECEIVED', listings: {[id]: listing}});
          dispatch(selectListing(id));
        });
    } else {
      dispatch(selectListing(id));
    }
  }
}

export function selectListing(id) {
  return {type: 'LISTING_SELECTED', id};
}

export function changeListingSort(sortBy, sortDir) {
  return {type: 'LISTING_SORT_CHANGED', sortCriteria: {sortBy, sortDir}};
}

export function changeListingFilter(filterCriteria) {
  return (dispatch, getState) => {
    dispatch({type: 'LISTING_FILTER_CHANGED', filterCriteria});
  }
}

export function changeNarrowLayout(narrowLayout) {
  return {type: 'NARROW_LAYOUT_CHANGED', narrowLayout}
}

export function changeMapOpened(mapOpened) {
  return {type: 'MAP_OPENED_CHANGED', mapOpened}
}
