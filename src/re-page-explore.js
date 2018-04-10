/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

// Non-connected component -----------------------------

import './../bower_components/polymer/polymer-element.html';
import './../bower_components/app-layout/app-drawer/app-drawer.html';
import './../bower_components/app-layout/app-drawer-layout/app-drawer-layout.html';
import './../bower_components/iron-selector/iron-selector.html';
import './../bower_components/paper-button/paper-button.html';
import './../bower_components/paper-icon-button/paper-icon-button.html';
import './../bower_components/good-map/good-map.html';

import './re-listing-card.js';

class RePageExplore extends Polymer.Element {

  static get is() { return 're-page-explore'; }

  static get template() { return `
    <style>
      :host {
        display: block;
        --app-drawer-width: 100vw;
      }
      app-drawer {
        margin-top: 304px;
        --app-drawer-content-container: {
          background-color: #eee;
        }
      }
      re-listing-card {
        height: 275px;
      }
      good-map {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }
      .rows {
        display: flex;
        flex-direction: column;
        height: calc(100vh - 64px);
      }
      .thead {
        background: lightgray;
        padding: 5px 0;
      }
      .tbody {
        flex: 1;
        overflow: auto;
      }
      .tr {
        display: flex;
        flex-direction: row;
        padding: 5px 10px;
      }
      .tbody .tr {
        border-bottom: 1px solid #ddd;
      }
      .like {
        width: 30px;
      }
      .td.like:hover::after {
        content: '♡'
      }
      .td.like.liked::after {
        content: '♥︎'
      }
      .td.like.liked:hover::after {
        content: '𝖷︎'
      }
      .td.like.disliked::after {
        content: '𝖷'
      }
      .addr {
        flex: 1;        
      }
      .price {
        width: 100px;
        text-align: end;
      }
      .int {
        width: 70px;
        text-align: end;
      }
      .tr.selected {
        background: #ddf;
      }
      .asc .th.iron-selected::before {
        font-size: 0.6em;
        content: '▲ ';
      }
      .desc .th.iron-selected::before {
        font-size: 0.6em;
        content: '▼ ';
      }
      .header {
        padding: 10px 0;
        background: white;
        border-top: 1px solid #eee;
        display: flex
      }
      .location {
        border: none;
        font-size: 1.6em;
        flex: 1;
        white-space: nowrap;
      }
      .location * { 
        display: inline;
        white-space: nowrap;
      }
      .location br { display: none; }
      .location::after {
        content: ' Real Estate';
      }
      .filter {
        padding: 10px 20px;
      }
      .filter select {
        -webkit-appearance: none;
        padding: 10px;
        font-size: 14px;
      }
      .info-price {
        font-weight: bold;
        font-size: 1.2em;
      }
      @media screen and (min-width: 641px) {
        :host {
          --app-drawer-width: calc(100vw - 500px)
        }
        app-drawer {
          margin-top: 184px;
        }
        .toggleMap {
          display: none;
        }
        .header {
          padding: 20px 10px;
        }
      }
    </style>

    <app-drawer-layout id="drawerLayout" on-narrow-changed="_changeNarrowLayout">

      <app-drawer slot="drawer" id="drawer" opened="[[_shouldDrawerOpen(mapOpened, narrowLayout)]]">
        <good-map
          on-google-map-ready="onMapReady"
          api-key="AIzaSyCTozTMXyzTNcvdUfdFBlePm2-QDf6-1Vk"
          latitude="[[lat]]"
          longitude="[[lng]]"
          zoom="[[zoom]]"
        ></good-map>
      </app-drawer>

      <div class="rows">
        <div class="header">
          <paper-icon-button class="toggleMap" icon="[[_openCloseMapIcon(mapOpened)]]" on-click="_changeMapOpen"></paper-icon-button>
          <div contenteditable id="location" class="location" on-keyup="trySearch">[[location]]</div>
          <paper-icon-button icon="re:search" on-click="search"></paper-icon-button>
        </div>
        <div class="filter">
          <select on-change="onMinPriceChanged" value="[[minPrice]]">
            <option value="0">No min</option>
            <option value="500000">$500k</option>
            <option value="1000000">$1M</option>
            <option value="2000000">$2M</option>
            <option value="3000000">$3M</option>
            <option value="4000000">$4M</option>
            <option value="5000000">$5M</option>
          </select>
          to
          <select on-change="onMaxPriceChanged" value="[[maxPrice]]">
            <option value="999999999">No max</option>
            <option value="500000">$500k</option>
            <option value="1000000">$1M</option>
            <option value="2000000">$2M</option>
            <option value="3000000">$3M</option>
            <option value="4000000">$4M</option>
            <option value="5000000">$5M+</option>
          </select>
          <select on-change="onMinBedsChanged" value="[[minBaths]]">
            <option value="0">Any beds</option>
            <option value="1">1 bed</option>
            <option value="2">2 bedss</option>
            <option value="3">3 beds</option>
            <option value="4">4 beds</option>
            <option value="5">5+ beds</option>
          </select>
          <select on-change="onMinBathsChanged" value="[[maxBaths]]">
            <option value="0">Any baths</option>
            <option value="1">1 bath</option>
            <option value="2">2 baths</option>
            <option value="3">3 baths</option>
            <option value="4">4 baths</option>
            <option value="5">5+ baths</option>
          </select>
        </div>
        
        <re-listing-card listing="[[selectedItem]]"></re-listing-card>

        <div class="thead">
          <iron-selector class$="tr [[sortDir]]" on-click="updateSort" selected="[[sortBy]]" attr-for-selected="name">
            <div class="th like" name="like"></div>
            <div class="th addr" name="address">Address</div>
            <div class="th price" name="price">Price</div>
            <div class="th int" name="bedrooms">Beds</div>
            <div class="th int" name="bathrooms">Bath</div>
          </iron-selector>
        </div>
        <div class="tbody flex" id="items">
          <template is="dom-repeat" items="[[currentItems]]" sort="[[sortFunction(sortBy, sortDir)]]" on-dom-change="scrollToSelected">
            <div class$="tr [[selectedClass(selectedItem, item)]]" on-click="onSelected" on-mouseover="onHoverIn" on-mouseout="onHoverOut">
              <div class$="td like [[item.likeStatus]]"></div>
              <div class="td addr">[[item.address]]</div>
              <div class="td price">[[currency(item.price)]]</div>
              <div class="td int">[[item.bedrooms]]</div>
              <div class="td int">[[item.bathrooms]]</div>
            </div>
          </template>
        </div>

      </div>
      
    </app-drawer-layout>
    `;
  }

  static get observers() {
    return [
      'updateMarkers(currentItems)',
      'showMarkerInfo(selectedItem)',
      'updateBounds(lat, lng, zoom)'
    ]
  }

  constructor() {
    super();
    this.markerMap = new Map();
    this.location = 'San Francisco';
  }

  currency(val) {
    return '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  onMapReady(e) {
    this.map = e.detail;
    this.map.addListener('bounds_changed', () => this.changeBounds());
  }

  scrollToSelected() {
    const selectedRow = this.$.items.querySelector('.selected');
    if (selectedRow) {
      selectedRow.scrollIntoViewIfNeeded();
    }
  }

  updateBounds(lat, lng, zoom) {
    if (this.map) {
      this.map.setCenter({lat, lng});
      this.map.setZoom(zoom);
    }
  }

  _changeNarrowLayout(e) {
    this.dispatchEvent(new CustomEvent('change-narrow-layout', {detail: e.detail.value}));
  }

  _changeMapOpen() {
    this.dispatchEvent(new CustomEvent('change-map-opened', {detail: !this.mapOpened}));
  }

  _openCloseMapIcon(mapOpened) {
    return mapOpened ? 're:list' : 're:map';
  }

  _shouldDrawerOpen(mapOpened, narrowLayout) {
    return !narrowLayout || mapOpened;
  }

  trySearch(e) {
    if (e.keyCode == '13') {
      this.search();
    }
  }

  search() {
    this.dispatchEvent(new CustomEvent('search-requested', {detail: this.$.location.textContent}));    
  }

  changeBounds() {
    const center = this.map.getCenter();
    const mapBounds = this.map.getBounds();
    const sw = mapBounds.getSouthWest();
    const ne = mapBounds.getNorthEast();
    const newBounds = {
      north: ne.lat(), 
      south: sw.lat(), 
      east: ne.lng(), 
      west: sw.lng(), 
      lat: center.lat(), 
      lng: center.lng(), 
      zoom: this.map.getZoom()
    };
    const dispatch = () => {
      this.dispatchEvent(new CustomEvent('change-bounds', {detail: newBounds}));
    }
    const prevBounds = this.bounds;
    if (prevBounds) {
      if (prevBounds.west !== newBounds.west &&
          prevBounds.east !== newBounds.east &&
          prevBounds.north !== newBounds.north &&
          prevBounds.south !== newBounds.south) {
        clearTimeout(this.boundsDebouncer);
        this.boundsDebouncer = setTimeout(_ => dispatch(), 1000);
      }
    } else {
      dispatch();
    }
  }

  updateMarkers(items = []) {
    if (this.map) {
      const markerMap = new Map();
      items.forEach(item => {
        let marker;
        if (marker = this.markerMap.get(item.id)) {
          this.markerMap.delete(item.id);
        } else {
          marker = new google.maps.Marker({
            position: {
              lat: item.latitude,
              lng: item.longitude
            },
            map: this.map,
            animation: google.maps.Animation.DROP,
            title: item.address
          });
          marker.addListener('click', e => this.selectItem(item));
          marker.addListener('mouseover', e => this.showMarkerInfo(item));
          marker.addListener('mouseout', e => this.infoWindow.close());
        }
        markerMap.set(item.id, marker);
      });
      this.markerMap.forEach(marker => {
        marker.setMap(null);
      });
      this.markerMap = markerMap;
    }
  }

  showMarkerInfo(item) {
    if (item && this.map) {
      const marker = this.markerMap.get(item.id);
      const info = this.infoWindow = this.infoWindow || new google.maps.InfoWindow({disableAutoPan: true});
      const content = document.createElement('div');
      content.innerHTML = `<div class="info-price">${this.currency(item.price)}</div>${item.address}<br>${item.bedrooms}BR ${item.bathrooms}BA`;
      content.addEventListener('click', e => {
        this.dispatchEvent(new CustomEvent('change-map-opened', {detail: false}))
      });
      info.setContent(content);
      info.open(this.map, marker);
    }
  }

  onSelected(e) {
    this.selectItem(e.model.item);
  }

  selectItem(item) {
    this.dispatchEvent(new CustomEvent('select-listing', {detail: item.id}))
    this.scrollToSelected();
  }

  onHoverIn(e) {
    this.showMarkerInfo(e.model.item);
  }

  onHoverOut(e) {
    if (this.selectedItem) {
      this.showMarkerInfo(this.selectedItem);
    } else {
      this.infoWindow.close();
    }
  }

  selectedClass(selected, item) {
    return item == selected ? 'selected' : '';
  }

  onMinPriceChanged(e) {
    this.changeListingFilter({minPrice: parseInt(e.target.value)});
  }

  onMaxPriceChanged(e) {
    this.changeListingFilter({maxPrice: parseInt(e.target.value)});
  }

  onMinBedsChanged(e) {
    this.changeListingFilter({minBeds: parseInt(e.target.value)});
  }

  onMinBathsChanged(e) {
    this.changeListingFilter({minBaths: parseInt(e.target.value)});
  }

  changeListingFilter(params) {
    this.dispatchEvent(new CustomEvent('change-listing-filter', {detail: params}));
  }

  sortFunction(sortBy, sortDir) {
    return (a, b) => {
      const av = a[sortBy];
      const bv = b[sortBy];
      if (sortDir == 'asc') {
        return av.localeCompare ? av.localeCompare(bv) : av - bv;
      } else {
        return bv.localeCompare ? bv.localeCompare(av) : bv - av;
      }
    }
  }

  updateSort(e) {
    const sortBy = e.target.getAttribute('name');
    const sortDir = (this.sortBy == sortBy) ? 
      (this.sortDir == 'asc' ? 'desc' : 'asc') : 'asc';
    this.dispatchEvent(new CustomEvent('change-listing-sort', {detail: {sortBy, sortDir}}));
  }

}

// Connected component -----------------------------

import {connect} from './redux-helpers.js';
import {changeBounds} from './redux-actions-map.js';
import {push} from './redux-actions-routing.js';
import {
  selectListing,
  changeListingSort,
  changeListingFilter,
  changeMapOpened,
  changeNarrowLayout
} from './redux-actions-listings.js';
import {
  listings,
  getCurrentItems,
  getSelectedItem,
  getSortCriteria,
  getFilterCriteria,
  getMapOpened,
  getNarrowLayout
} from './redux-reducer-listings.js';
import {
  map,
  getBounds
} from './redux-reducer-map.js';

store.addReducers({listings, map});

const ConnectedRePageExplore = connect(store, class extends RePageExplore {
  _mapStateToProps(state) {
    return {
      currentItems: getCurrentItems(state),
      selectedItem: getSelectedItem(state),
      mapOpened: getMapOpened(state),
      narrowLayout: getNarrowLayout(state),
      bounds: getBounds(state),
      lat: getBounds(state).lat,
      lng: getBounds(state).lng,
      zoom: getBounds(state).zoom,
      ...getSortCriteria(state),
      ...getFilterCriteria(state)
    };
  }
  _mapDispatchToEvents(dispatch) {
    return {
      'change-listing-sort'({detail: {sortBy, sortDir}}) {
        dispatch(changeListingSort(sortBy, sortDir));
      },
      'change-bounds'({detail: bounds}) {
        dispatch(changeBounds(bounds));
      },
      'select-listing'({detail: id}) {
        dispatch(selectListing(id));
      },
      'change-listing-filter'({detail: params}) {
        dispatch(changeListingFilter(params));
      },
      'change-map-opened'({detail: mapOpened}) {
        dispatch(changeMapOpened(mapOpened));
      },
      'change-narrow-layout'({detail: narrowLayout}) {
        dispatch(changeNarrowLayout(narrowLayout));
      },
      'search-requested'({detail: searchText}) {
        dispatch(push(`/explore/${encodeURIComponent(searchText)}`));
      }
    }
  }
});

customElements.define(RePageExplore.is, ConnectedRePageExplore);