'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _scrape = require('./scrape.js');

var _scrape2 = _interopRequireDefault(_scrape);

var _convert_csa = require('./convert_csa.js');

var _convert_csa2 = _interopRequireDefault(_convert_csa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (url, options) {
  (0, _scrape2.default)(url).then(function (_ref) {
    var game_data = _ref.game_data;
    var moves = _ref.moves;

    switch (options.format) {
      default:
        return (0, _convert_csa2.default)(game_data, moves);
    }
  }).catch(function (e) {
    return e;
  });
};