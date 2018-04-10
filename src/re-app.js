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
import './../bower_components/app-layout/app-header/app-header.html';
import './../bower_components/app-layout/app-header-layout/app-header-layout.html';
import './../bower_components/app-layout/app-scroll-effects/app-scroll-effects.html';
import './../bower_components/app-layout/app-toolbar/app-toolbar.html';
import './../bower_components/iron-pages/iron-pages.html';
import './../bower_components/iron-selector/iron-selector.html';
import './../bower_components/iron-icon/iron-icon.html';
import './../bower_components/paper-tabs/paper-tabs.html';
import './../bower_components/paper-tabs/paper-tab.html';
import './re-icons.html';

import './../bower_components/redux/index.js';
import './../bower_components/redux-thunk/index.js';

import {connect, lazyReducerEnhancer} from './redux-helpers.js';

import {user, signedIn} from './redux-reducer-login.js';
import {currentPage} from './redux-reducer-routing.js';
import {toastInfo} from './redux-reducer-toast.js';

import {loadSDK, toggleLogin} from './redux-actions-login.js';
import {connect as connectRouter} from './redux-actions-routing.js';

const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || Redux.compose;

const store = Redux.createStore((state, action) => { return {}; }, {},
  compose(lazyReducerEnhancer, Redux.applyMiddleware(ReduxThunk.default)));

// Initial store setup
store.addReducers({ currentPage, user, signedIn, toastInfo });
connectRouter(store);
store.dispatch(loadSDK());

// For debugging
window.store = store;

const ReApp = connect(store, class extends Polymer.Element {

  static get template() {
    return `
    <style>
      :host {
        display: block;
        --app-primary-color: #4285f4;
      }

      app-header {
        background-color: white;
        color: #4285f4;
      }

      app-toolbar {
        padding: 0;
      }

      .title {
        background: var(--app-primary-color);
        color: white;
        padding: 16px;
        white-space: nowrap;
        border: 1px solid var(--app-primary-color);
      }

      paper-tab > a {
        display: flex;
        align-items: center;
        padding: 0 16px;
        text-decoration: none;
        color: currentcolor;
        font-size: 16px;
      }

      paper-tabs {
        height: 100%;
        --paper-tabs-selection-bar-color: var(--app-primary-color);
        --paper-tab-ink: var(--app-primary-color);
      }

      paper-tab iron-icon {
        margin-right: 10px;
      }

      @media screen and (max-width: 640px) {
        paper-tab span {
          display: none;
        }
      }

      .hide {
        visibility: hidden;
      }

      .title i {
        font-style: italic;
        position: relative;
        font-size: 1.3em;
        line-height: 1em;
      }
      .title i:last-child {
        left: -2px;
        top: 5px;
      }

    </style>

    <app-header-layout>

      <app-header effects="waterfall" condenses reveals slot="header">
        <app-toolbar>
          <div class="title">Polymer <i>R</i><i>E</i></div>
          <paper-tabs selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">
            <paper-tab name="home">
              <a href="home">
                <iron-icon icon="re:home"></iron-icon><span>Home</span>
              </a>
            </paper-tab>
            <paper-tab name="explore">
              <a href="explore">
                <iron-icon icon="re:results"></iron-icon><span>Explore</span>
              </a>
            </paper-tab>
            <paper-tab name="detail" class$="[[_showDetailClass(selected)]]">
              <a href="detail/[[selected]]">
                <iron-icon icon="re:detail"></iron-icon><span>Detail</span>
              </a>
            </paper-tab>
          </paper-tabs>
        </app-toolbar>
      </app-header>

      <iron-pages selected="[[page]]" attr-for-selected="name" fallback-selection="view404" role="main">
        <re-page-home name="home"></re-page-home>
        <re-page-explore name="explore"></re-page-explore>
        <re-page-detail name="detail"></re-page-detail>
        <re-page-404 name="404"></re-page-404>
      </iron-pages>
    
    </app-header-layout>

    <paper-toast opened="[[toastInfo.showing]]" text="[[toastInfo.text]]" duration="0"></paper-toast>`;
  }

  _mapStateToProps(state) {
    const videos = state.videos;
    return {
      signedIn: state.signedIn,
      user: state.user,
      toastInfo: state.toastInfo,
      page: state.currentPage,
      listings: state.listings,
      selected: state.listings && state.listings.selected,
      map: state.map
    };
  }

  ready() {
    super.ready();
    this.selected = null;
  }

  _loginIcon(signedIn) {
    return signedIn ? 'person' : 'person-outline';
  }

  _showDetailClass(selected) {
    return selected ? '' : 'hide';
  }

});

customElements.define('re-app', ReApp);
