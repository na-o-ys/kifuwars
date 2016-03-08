"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (game_data, moves) {
  var header = generateHeader(game_data);
  var body = generateBody(game_data, moves);
  return [header, body].join("\n");
};

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateHeader(game_data) {
  var rule = g_rules[game_data.gtype];
  var date = (0, _moment2.default)(game_data.date).format("YYYY/MM/DD HH:mm:SS");
  var players = {
    black: game_data.players.black.name + (" (" + game_data.players.black.grade + ")"),
    white: game_data.players.white.name + (" (" + game_data.players.white.grade + ")")
  };
  return ["N+" + players.black, "N-" + players.white, "V2.2", "$EVENT:将棋ウォーズ " + rule.rule, "$START_TIME:" + date, "$TIME_LIMIT:" + rule.time_limit, "+" // 先手番
  ].join("\n");
}

// WarsCSA -> CSA


function generateBody(game_data, raw_moves) {
  var time_limit = g_rules[game_data.gtype].initial_time_limit;
  var prev = [time_limit, time_limit];
  var moves = [];
  raw_moves.forEach(function (raw_move, i) {
    // 消費時間のフォーマット
    if (["+", "-"].includes(raw_move[0])) {
      var curr = Number(raw_move.match(/,L(\d{1,3})/)[1]);
      var consumed = prev[i % 2] - curr;
      prev[i % 2] = curr;
      var move = raw_move.match(/^(.*)(,L)?/)[1];
      moves.push([move, "T" + consumed].join("\n"));
    } else if (raw_move.includes("_WIN_TORYO") || raw_move.includes("_WIN_DISCONNECT")) {
      moves.push("%TORYO");
    } else if (raw_move.includes("_WIN_TIMEOUT")) {
      moves.push("%TIME_UP");
    } else if (raw_move.includes("_WIN_ENTERINGKING")) {
      moves.push("%KACHI");
    } else if (raw_move.includes("DRAW_SENNICHI")) {
      moves.push("%SENNICHITE");
    }
  });
  return moves.join("\n");
}

var g_rules = {
  '': {
    initial_time_limit: 600,
    rule: "10分切れ負け",
    time_limit: "00:10+00"
  },
  'sb': {
    initial_time_limit: 360,
    rule: "3分切れ負け",
    time_limit: "00:03+00"
  },
  's1': {
    initial_time_limit: 3600,
    rule: "秒読み10秒",
    time_limit: "00:00+10"
  }
};