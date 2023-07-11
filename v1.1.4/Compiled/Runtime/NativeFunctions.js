"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval = exports.GetTime = void 0;
var Parser_1 = require("../Frontend/Parser");
var Interpreter_1 = require("./Interpreter");
var Values_1 = require("./Values");
function GetTime(args, scope) {
    return Values_1.MakeValue.Number(Date.now());
}
exports.GetTime = GetTime;
function Eval(args, scope) {
    if (args[0] && args[0].type != "string")
        throw new Error("Expected string in evaluate input");
    var value = args[0].value;
    var parser = new Parser_1.default();
    var ast = parser.ProduceAST(value);
    return (0, Interpreter_1.Evaluate)(ast, scope);
}
exports.Eval = Eval;
