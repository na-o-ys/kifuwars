"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = function (url) {
  return (0, _nodeFetch2.default)(url).then(function (res) {
    return res.text();
  }).then(function (body) {
    var game_data = extractGameData(body);
    var moves = extractMoves(body);
    return { game_data: game_data, moves: moves };
  });
};

var _nodeFetch = require("node-fetch");

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function extractGameData(body) {
  var black_grade = body.match(/\s+dan0:\s"(.*)"/)[1];
  var white_grade = body.match(/\s+dan1:\s"(.*)"/)[1];
  var gtype = body.match(/\s+gtype:\s"(.*)"/)[1];
  var raw_name = body.match(/\s+name:\s"(.*)"/)[1];

  var _raw_name$match = raw_name.match(/(.*)-(.*)-(.*)/);

  var _raw_name$match2 = _slicedToArray(_raw_name$match, 4);

  var black_name = _raw_name$match2[1];
  var white_name = _raw_name$match2[2];
  var raw_date = _raw_name$match2[3];

  var _raw_date$match = raw_date.match(/(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/);

  var _raw_date$match2 = _slicedToArray(_raw_date$match, 7);

  var Y = _raw_date$match2[1];
  var M = _raw_date$match2[2];
  var D = _raw_date$match2[3];
  var H = _raw_date$match2[4];
  var m = _raw_date$match2[5];
  var S = _raw_date$match2[6];

  return {
    date: new Date(Y + "-" + M + "-" + D + "T" + H + ":" + m + ":" + S + "+09:00"),
    gtype: gtype,
    players: {
      black: {
        name: black_name,
        grade: black_grade
      },
      white: {
        name: white_name,
        grade: white_grade
      }
    }
  };
}

function extractMoves(body) {
  var move_data = body.match(/receiveMove\("(.*)"\)/)[1];
  return move_data.split("\t");
}