'use strict';

var Table = require('cli-table');
var colors = require('colors/safe');
var benchmark = require('benchmark');

var oldZ = require('sanctuary-type-classes');
var newZ = require('..');


function identity(x) {
  return x;
}

function formatPct(pct) {
  return ('+' + pct.toLocaleString('en', {
    minimumIntegerDigits: 3,
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    useGrouping: false
  })).slice(-6) + '%';
}

function format(res) {
  return res.hz.toLocaleString('en', {maximumFractionDigits: 0}) + ' Hz '
       + '±' + res.stats.rme.toFixed(2) + '%'
       + '(n ' + String(res.stats.sample.length) + ')';
}

module.exports = function runBenchmarks(specs) {
  var table = new Table({head: ['name', 'Old', 'New', 'change']});

  Object.keys(specs).forEach(function(name, i, keys) {
    process.stdout.write('Running ' + String(i + 1) + '/' + String(keys.length) + ': ' +  name);

    var suite = new benchmark.Suite(name);
    var spec = specs[name];
    var Old = spec.Old || spec;
    var New = spec.New || spec;

    suite.add('Old', {minSamples: 80, fn: Old.bind(null, oldZ)});
    suite.add('New', {minSamples: 80, fn: New.bind(null, newZ)});

    suite.on('complete', function() {
      var oldRes = this[0], newRes = this[1];
      var change = (newRes.hz - oldRes.hz) / oldRes.hz;
      var changePct = formatPct(change * 100);
      var colorize = change > +0.1 ? colors.green :
                     change < -0.1 ? colors.red :
                     identity;

      console.log(' ...', changePct);

      table.push([name,
                  format(oldRes),
                  colorize(format(newRes)),
                  colorize(changePct)]);
    });

    suite.run();

  });

  console.log(table.toString());
};
