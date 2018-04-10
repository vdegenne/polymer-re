/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import './../bower_components/polymer/polymer-element.html';
import './../bower_components/paper-button/paper-button.html';

class RePageHome extends Polymer.Element {

  static get is() { return 're-page-home'; }

  static get template() { return `
    <style>
      :host {
        display: block;
        position: relative;
      }
      .background {
        position: absolute;
        z-index: -1;
        left: -30px;
        right: -30px;
        top: -30px;
        bottom: -30px;
        background-image: url(https://upload.wikimedia.org/wikipedia/commons/3/3e/GoldenGateBridge.jpg);
        background-size: cover;
        filter: blur(5px);
      }
      .full {
        display: flex;
        align-items: center;
        text-align: center;
        height: calc(100vh - 80px);
      }
      .center {
        display: flex;
        width: 100%;
        align-items: center;
        flex-direction: column;
      }
      input {
        width: calc(100vw - 50px);
        max-width: 400px;
        border: 1px solid black;
        border-radius: 4px;
        font-size: 20px;
        padding: 10px;
        height: 32px;
        margin-bottom: 16px;
      }
      paper-button {
        background: var(--app-primary-color);
        color: white;
      }
      h1 {
        line-height: 0;
        color: white;
        text-shadow: 1px 1px 10px rgba(0,0,0, 0.4);
      }
      a {
        color: white;
        text-decoration: none;
      }
      ul {
        padding: 0;
      }
      li {
        list-style: none;
        display: inline-block;
        margin: 10px;
        font-weight: light;
        opacity: 0.8;
      }      
    </style>
    <div class="background"></div>
    <div class="full">
      <div class="center">
        <h1>Let's find you a home.</h1><br>
        <div>
          <input placeholder="Where would you like to live?" on-keypress="onKeypress" value="{{searchText::input}}">
          <a href="explore/[[encodeURIComponent(searchText)]]"><paper-button raised>Search</paper-button></a>
          <ul>
            <li><a href="#">About
            <li><a href="#">Find an Agent
            <li><a href="#">Legal
            <li><a href="#">Contact
          </ul>
        </div>
      </div>
    </div>
    `;
  }

  encodeURIComponent(s) {
    return encodeURIComponent(s);
  }

  onKeypress(e) {
    if (e.keyCode == 13) {
      this.dispatchEvent(new CustomEvent('search-requested', {detail: this.searchText}));
    }
  }
}

import {connect} from './redux-helpers.js';
import {push} from './redux-actions-routing.js';

const ConnectedRePageHome = connect(store, class extends RePageHome {
  _mapDispatchToEvents(dispatch) {
    return {
      'search-requested'({detail: searchText}) {
        dispatch(push(`explore/${encodeURIComponent(searchText)}`));
      }
    }
  }
});

customElements.define(ConnectedRePageHome.is, ConnectedRePageHome);