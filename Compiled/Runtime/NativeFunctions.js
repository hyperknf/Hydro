"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTime = exports.Print = void 0;
var Values_1 = require("./Values");
function Print(args, scope) {
    console.log.apply(console, args);
    return Values_1.MakeValue.Undefined();
}
exports.Print = Print;
function GetTime(args, scope) {
    return Values_1.MakeValue.Number(Date.now());
}
exports.GetTime = GetTime;
