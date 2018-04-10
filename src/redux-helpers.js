/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

export const connect = (store, superClass) => {

  return class extends superClass {

    constructor() {
      super();
      // Map dispatch to events
      if (this._mapDispatchToEvents) {
        const eventMap = this._mapDispatchToEvents(store.dispatch);
        for (let type in eventMap) {
          this.addEventListener(type, event => {
            event.stopImmediatePropagation();
            eventMap[type](event);
          });
        }
      }
      // Map state to props
      if (this._mapStateToProps) {
        const setProps = this.setProperties ?
          props => this.setProperties(props) :
          props => Object.assign(this, props);
        const update = () => setProps(this._mapStateToProps(store.getState()));
        // Sync with store
        store.subscribe(update);
        update();
      }
    }
  
  }

}

export function lazyReducerEnhancer(nextCreator) {
  return (origReducer, preloadedState) => {
    let lazyReducers = {};
    const nextStore = nextCreator(origReducer, preloadedState);
    return {
      ...nextStore,
      addReducers(newReducers) {
        this.replaceReducer(Redux.combineReducers(lazyReducers = {
          ...lazyReducers,
          ...newReducers
        }));
      }
    }
  }
}

export function memoizedSelector(...args) {
  let lastVals = [];
  let lastResult = null;
  const selector = args.pop();
  return state => {
    let changed = false;
    const vals = args.map((arg, i) => {
      const val = arg(state);
      changed = changed || lastVals[i] !== val;
      return val;
    });
    lastVals = vals;
    return changed ? (lastResult = selector.apply(this, vals)) : lastResult;
  }
}