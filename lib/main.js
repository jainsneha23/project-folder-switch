'use babel';

import { CompositeDisposable } from 'atom';
import ProjectSwitch from './project-switch';

export default {
  config: {
  },

  activate(state) {
    this.projectSwitch = new ProjectSwitch();

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Explicitly check if the values are not false so that we default to showing each view.

    if (state.projectSwitchIsShowing !== false) {
      this.projectSwitch.show();
    }

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'tree-view-switch:toggle-all': () => {
        this.projectSwitch.toggle();
      }
    }));

    this.subscriptions.add(
      atom.workspace.onWillDestroyPaneItem(({ item }) => {
        if (item instanceof ProjectSwitch) {
          this.projectSwitch.destroy();
        }
      })
    )
  },

  deactivate() {
    this.subscriptions.dispose();
    if (this.projectSwitch) {
      this.projectSwitch.destroy();
    }
  },

  serialize() {
    return {
      projectSwitchIsShowing: this.projectSwitch.isShowing()
    };
  },
};
