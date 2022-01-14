# avf (AVFoundation)

Bindings to use AVFoundation (Swift) functionality in nodejs

### Contribution Guidelines

Do not attempt to push directly to `master`, please checkout a branch and submit a Pull Request targeting `replayableio/node-avf` when you have completed a feature.

#### Submitting a feature

A typical feature will be a new binding. This will require four distinct steps

1. create and your Swift function
2. define its `Swift` interface in `main.Swift`
3. define and export its `Javascript` interface in `index.js`
4. create a `jest` test in `jest-tests`

Your `jest` test should live in and use the current directory structure.

```
jest-tests
├── input
│   └── committed_files_used_for_test_input
├── output
│   └── test_results.not_tracked_in_git
└── trim.test.js
```

If you are making a binding called `doThing` , its test file should be named `doThing.test.js`

When in doubt, copy the existing structure.

#### Test creation notes

If you are not comfortable with Jest, or your feature does not have a numerical or string output (see `trim` for an example) that is easily tested, please do the following instead:

1. write a `doThing.test.js` skeleton with all the relevant imports
2. do not include `const { expect } = require('@jest/globals');`
3. run it with `node doThing.test.js`
4. push the feature when you as a human believe the results are right

If you follow this flow, the responsibility of creating a working test falls on the code reviewer.
