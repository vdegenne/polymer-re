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

import {connect} from './redux-helpers.js';
import {
  listings,
  getSelectedItem
} from './redux-reducer-listings.js';
store.addReducers({listings});
 
class RePageDetail extends Polymer.Element {

  static get is() { return 're-page-detail'; }

  static get template() { return `
    <style>
      :host {
        display: block;
        padding: 10px 20px;
      }
      .card {
        margin: auto;
        max-width: 800px
      }
      h1.title {
        display: flex;
      }
      h1.title span:first-child {
        flex: 1;
      }
      img.main {
        width: 100%;
        max-height: 400px;
      }
    </style>
    <div class="card">
      <h1 class="title">
        <span>[[selectedItem.address]]</span>
        <span>[[currency(selectedItem.price)]]</span>
      </h1>
      <p>[[selectedItem.bedrooms]] bed / [[selectedItem.bathrooms]] bath, [[selectedItem.size]] sqft [[selectedItem.type]] in [[selectedItem.city]], [[selectedItem.state]]</p>
      <img class="main" src="[[selectedItem.photos.0]]">
      <h3>Overview:</h3>
      <p>[[selectedItem.description]]</p>
      <h3>Details:</h3>
      <ul>
        <li>Type: [[selectedItem.type]]</li>
        <li>HOA Dues: [[selectedItem.hoaDues]]</li>
        <li>Bedrooms: [[selectedItem.bedrooms]]</li>
        <li>Bathrooms: [[selectedItem.bathrooms]]</li>
        <li>Size: [[selectedItem.size]] sqft</li>
        <li>Year built: [[selectedItem.yearBuilt]]</li>
        <li>Parking spaces: [[selectedItem.parking]]</li>
        <li>Address: [[selectedItem.address]], [[selectedItem.city]], [[selectedItem.state]] [[selectedItem.zip]]</li>
        <li>Listed: [[selectedItem.listed]]</li>
      </ul>
    </div>`;
  }
}


const ConnectedRePageDetail = connect(store, class extends RePageDetail {
  currency(val) {
    return '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  _mapStateToProps(state) {
    return {
      selectedItem: getSelectedItem(state)
    }
  }
});

customElements.define(ConnectedRePageDetail.is, ConnectedRePageDetail);