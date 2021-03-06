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

class RePage404 extends Polymer.Element {

  static get is() { return 're-page-404'; }

  static get template() { return `
    <style>
      :host {
        display: block;

        padding: 10px 20px;
      }
    </style>
    Oops you hit a 404. <a href="[[rootPath]]">Head back to home.</a>`;
  }
  
}

customElements.define(RePage404.is, RePage404);