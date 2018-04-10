/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import {importModule} from './utils-import.js';

export function connect(store) {
  document.body.addEventListener('click', e => {
    if ((e.button !== 0) ||           // Left click only
        (e.metaKey || e.ctrlKey)) {   // No modifiers
      return;
    }
    let origin;
    if (window.location.origin) {
      origin = window.location.origin;
    } else {
      origin = window.location.protocol + '//' + window.location.host;
    }
    let anchor = e.composedPath().filter(n=>n.localName=='a')[0];
    if (anchor && anchor.href.indexOf(origin) === 0) {
      e.preventDefault();
      window.history.pushState({}, '', anchor.href);
      handleUrlChange();
    }
  });
  const handleUrlChange = () => {
    store.dispatch(changeRoute(window.decodeURIComponent(window.location.pathname)));
  }
  window.addEventListener('popstate', _ => handleUrlChange());
  handleUrlChange();
}

export function push(href) {
  return dispatch => {
    history.pushState({}, '', href);
    dispatch(changeRoute(window.decodeURIComponent(window.location.pathname)));
  }
}

export function changeRoute(path) {
  return (dispatch, getState) => {
    const state = getState();
    const parts = path.slice(1).split('/');
    const [page, ...subPath] = parts;
    if (page !== state.currentPage) {
      dispatch(loadPage(page || 'home', subPath));
    } else {
      dispatch(loadPage(page, subPath));
    }
  }
}

function loadPage(page, subPath) {
  return (dispatch, getState) => {
    switch(page) {
      case 'detail':
        if (subPath[0]) {
          Promise.all([
            importModule('./src/redux-actions-listings.js'),
          ]).then(([{fetchAndSelectListing}]) => {
            dispatch(fetchAndSelectListing(subPath[0]));
          });
        }
      break;
    }
    importModule('/src/re-page-' + page + '.js',
      _ => dispatch(changePage(page, subPath)),
      _ => dispatch(loadPage('404')), true);
  }
}

function changePage(page, subPath) {
  return { type: 'PAGE_CHANGED', page, subPath };
}