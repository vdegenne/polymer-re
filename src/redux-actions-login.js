/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import {importScript, importModule} from './utils-import.js';
import {showToastFor} from './redux-actions-toast.js';

let sdkLoadedPromise;

export function sdkLoaded() {
  return sdkLoadedPromise;
}

export function loadSDK() {
  return dispatch => {
    // sdkLoadedPromise = importScript('../mock/api.js').then(() => {
    sdkLoadedPromise = Promise.resolve().then(() => {
      dispatch(setSignedIn(true));
    });
  }
}

function setSignedIn(signedIn) {
  return (dispatch, getState) => {
    const prevSignedIn = getState().signedIn;
    if (signedIn) {
      const user = {title: 'Kevin Schaaf'};
      dispatch(refreshSignedInState());
      dispatch({type: 'USER_LOGGED_IN', user});
      dispatch(showToastFor(`Logged in as ${user.title}.`, 1000));
    } else {
      if (prevSignedIn) {
        dispatch(showToastFor(`Logged out.`, 1000));
        dispatch({type: 'USER_LOGGED_OUT'});
      }
    }
  }
}

function refreshSignedInState() {
  return (dispatch, getState) => {
    const state = getState();
    switch (state.currentPage) {
    }
  }
}

export function toggleLogin() {
  return (dispatch, getState) => {
    dispatch(setSignedIn(!getState().signedIn));
  }
}
