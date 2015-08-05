# index-hashify
## DEPRECATED
There are problems with dedupe.

Plugin to apply sha1 index to [browserify](https://www.npmjs.com/package/browserify) rows instead of integers, which is unstable when new rows come and go.

This problem looms when using browserify with [factor-bundle](https://www.npmjs.com/package/factor-bundle). The [pr](https://github.com/substack/deps-sort/pull/13) means to fix it with an option to use sha1 index. You can use this plugin to fix it right now.

[Here](https://github.com/zoubin/deps-sort-integer-index-problem) is an example:

* `a.js` depends upon `base.js`
* we use `factor-bundle` to build two bundles, and only `base.js` will go to `common.js` (built from `b.bundle()` stream)
* after bundle, we can see that `base.js` gets id `2`, and `a.js` `1`
* if we `require('b.js')` in `a.js` (like `a.modified.js`), though `b.js` will be kept out of `common.js`, `base.js` now gets id `3`. That means we have changed the contents of `common.js` and the browser cache will be invalidated.

Browserify gives each row an index at `sort`, according to their sorted orders. And when a new row comes into the deps map, it will be inserted into the sorted rows, thus increasing the index of each row after it.

This plugin will transform `row.index` to `shasum(row.source).slice(0, 7)` before the end of `sort` stage.

## Usage

```javascript
var b = browserify(opts);
var hashify = require('index-hashify');
var factor = require('factor-bundle');
b.plugin(hashify)
 .plugin(factor, factorOpts);
b.bundle().pipe(process.stdout);

```
