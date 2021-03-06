# index-hashify
[![version](https://img.shields.io/npm/v/index-hashify.svg)](https://www.npmjs.org/package/index-hashify)
[![status](https://travis-ci.org/zoubin/index-hashify.svg)](https://travis-ci.org/zoubin/index-hashify)
[![dependencies](https://david-dm.org/zoubin/index-hashify.svg)](https://david-dm.org/zoubin/index-hashify)
[![devDependencies](https://david-dm.org/zoubin/index-hashify/dev-status.svg)](https://david-dm.org/zoubin/index-hashify#info=devDependencies)

A [browserify] plugin to replace numeric indexes with hashes.

## The problem with numeric hashes
[browserify] uses numbers to identify module functions in the final bundle by default.
Since modules are sorted according to their file paths,
and those identification numbers are just their corresponding indexes in the sorted array (in most cases),
they are prone to changing when dependencies inserted and deleted.

Suppose there are two modules `'/a.js'` and `'/c.js'`,
which will get `1` and `2` as their identification number in the final bundle, respectively.
Now if we add `require('/b.js')` in `'a.js'`,
`'/c.js'` will get `3` as its identification number even if nothing happens to the original module.

That may cause problems in some cases:
* common shared bundles.
  When using [factor-bundle], the contents of the common bundle may change due to just the change of identification numbers,
  invalidating the application cache for it.
* hot module replacement.
  Tools like [browserify-hmr] replace changed modules, but not those who just suffer a identification number change,
  thus breaking the dependency chain. (See [browserify-hmr#28](https://github.com/AgentME/browserify-hmr/issues/28))


This plugin will take the sha1 of the result of concating the file path (relative to `basedir`) with the contents of the module 
as the identification number instead, which will not change as long as the module keeps,
thus fixing the above problems.

## Usage

```javascript
var b = browserify(opts)
var hashify = require('index-hashify')
b.plugin(hashify)
b.bundle().pipe(process.stdout)

```

[browserify]: https://github.com/substack/node-browserify
[factor-bundle]: https://github.com/substack/factor-bundle
[browserify-hmr]: https://github.com/AgentME/browserify-hmr

