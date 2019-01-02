'use babel';

import _ from 'lodash';

import { CompositeDisposable } from 'atom';
import ExtendedBase from './extended-base';
import ExtendedProjectSwitch from './extended-project-switch';

export default class ProjectSwitch extends ExtendedBase {
  constructor() {
    super();

    this.dockTitle = 'Switch Project';

    this.state = {dirs: []};

    this.setState = this.setState.bind(this);
    this.syncDirs = this.syncDirs.bind(this);

    this.dirSubs = new CompositeDisposable();
    this.dirSubs.add(
      atom.project.onDidChangeFiles(this.syncDirs)
    );
    this.syncDirs();
  }

  // Tear down any state and detach
  destroy() {
    super.destroy();
		this.dirSubs.dispose();
  }

  setState(state = {}, cb = _.noop) {
    _.extend(this.state, state);
    cb();
  }

  // When a user is switching project folders (usually with project manager)
  // dirs are added and removed.
  // This file syncs the views against what dirs are currently displayed.
  syncDirs() {
    const currentDirs = atom.project.getPaths();

    if (this.state.dirs.toString() != currentDirs.toString()) {
      this.setState({dirs: currentDirs});
      const view = new ExtendedProjectSwitch({
        title: "Project Switch",
        activeItem: currentDirs && currentDirs[0],
        items: currentDirs
      });
      this.element.appendChild(view.element);
    }
  }
}
