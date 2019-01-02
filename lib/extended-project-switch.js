'use babel';

import { basename } from 'path';
import _ from 'lodash';
import yo from 'yo-yo';
import { CompositeDisposable } from 'atom';

export default class ExtendedProjectSwitch {
  constructor(initialState = {}) {
    this.setState = this.setState.bind(this);
    this.render = this.render.bind(this);

    this.state = _.extend({
      activeItem: {},
      title: 'Pane',
      items: []
    }, initialState);

    this.render();
  }

  destroy() {
    this.element.remove();
    this.state = null;
  }

  setState(state = {}, cb = _.noop) {
    _.extend(this.state, state);
    this.render();

    if (this.itemSubs) {
      this.itemSubs.dispose();
    }
    this.itemSubs = new CompositeDisposable();
    cb();
  }

  expand(evt) {
    evt.stopPropagation();
    console.log(evt.target.value);
  }

  render() {
    const {
      activeItem,
      title,
      items
    } = this.state;

    const element = yo`
      <div>
        <div class="title">${title}</div>
        <select name="dir" onchange=${this.expand}>
            ${items.map((item, i) => {
              return yo`
                <option value="${item}" ${i == 0 && "selected"}>
                  ${basename(item)}
                </option>
              `;
            })}
        </select>
      </div>
    `;

    if (!this.element) {
      this.element = element;
    }

    yo.update(this.element, element);

    return this.element;
  }
}
