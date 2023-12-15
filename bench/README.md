# Benchmarks

## Running

* Install node modules required for the benchmark you wish to run
* Use `npm run bench -- --help` for options

For example, let's say you like to know how the performance of `equals`
compares to what it was at version 2.x.x:

```console
$ npm --prefix bench install sanctuary-type-classes@2.x.x
$ npm run bench -- --benchmark old-vs-new --match methods.equals.*
```

To compare to a specific (possibly unpushed) commit as opposed to a published
version, simply install from a specific local commit:

```console
$ npm --prefix bench install "git+file://$(pwd)/#<commit_hash>"
```
