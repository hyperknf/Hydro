"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval = exports.GetTime = exports.Prompt = exports.Print = void 0;
var Parser_1 = require("../Frontend/Parser");
var Interpreter_1 = require("./Interpreter");
var Values_1 = require("./Values");
var prompt = require("prompt-sync")();
function Print(args, scope) {
    var print_args = [];
    for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
        var arg = args_1[_i];
        print_args.push(String(arg.value));
    }
    console.log.apply(console, print_args);
    return Values_1.MakeValue.Undefined();
}
exports.Print = Print;
function Prompt(args, scope) {
    var prompt_args = [];
    for (var _i = 0, args_2 = args; _i < args_2.length; _i++) {
        var prompt_arg = args_2[_i];
        prompt_args.push(prompt_arg.value);
    }
    console.log.apply(console, prompt_args);
    return Values_1.MakeValue.String(prompt());
}
exports.Prompt = Prompt;
function GetTime(args, scope) {
    return Values_1.MakeValue.Number(Date.now());
}
exports.GetTime = GetTime;
function Eval(args, scope) {
    var value = args[0].value;
    var parser = new Parser_1.default();
    var ast = parser.ProduceAST(value);
    return (0, Interpreter_1.Evaluate)(ast, scope);
}
exports.Eval = Eval;
