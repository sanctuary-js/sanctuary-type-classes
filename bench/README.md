# Benchmarks

## Running

* Install node modules required for the benchmark you wish to run
* Use `npm run bench -- --help` for options

For example, let's say you like to know how the performance of `equals`
compares to what it was at version 2.x.x:

```console
$ (cd bench && npm install sanctuary-type-classes@2.x.x)
$ npm run bench -- --benchmark old-vs-new --match methods.equals.*
```
