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

class ReListingCard extends Polymer.Element {

  static get is() { return 're-listing-card'; }

  static get template() { return `
    <style>
      :host {
        display: flex;
      }
      .image-link {
        flex: 1;
        display: flex;
      }
      .image {
        display: block;
        flex: 1;
        background-color: white;
        background-size: cover;
        position: relative;
      }
      .details {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 10px;
        background-image: linear-gradient(to top, #444 0%,rgba(0, 0, 0, 0) 100%);
        color: white;
        display: flex;
        height: 64px;
        align-items: flex-end;
      }
      .price {
        font-size: 1.4em;
      }
      .address {
        flex: 1;
        text-align: end;
      }
    </style>
    <a class="image-link" href="detail/[[listing.id]]">
      <div class="image" style="background-image:url([[listing.photos.0]])">
        <div class="details">
          <div class="price">[[currency(listing.price)]]</div>
          <div class="address">[[listing.address]]</div>
        </div>
      </div>
    </a>
    `;
  }
  
  currency(val) {
    return val && '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

}

customElements.define(ReListingCard.is, ReListingCard);