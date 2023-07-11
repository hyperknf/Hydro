"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluateUseLibrary = exports.EvaluateDeletion = exports.EvaluateDeclaration = exports.EvaluateProgram = void 0;
var Values_1 = require("../Values");
var Interpreter_1 = require("../Interpreter");
function EvaluateProgram(program, environment) {
    var last_evaluated = Values_1.MakeValue.Null();
    for (var _i = 0, _a = program.body; _i < _a.length; _i++) {
        var statement = _a[_i];
        last_evaluated = (0, Interpreter_1.Evaluate)(statement, environment);
    }
    return last_evaluated;
}
exports.EvaluateProgram = EvaluateProgram;
function EvaluateDeclaration(declaration, environment) {
    if (declaration.type == "native-function")
        throw new Error("Cannot declare native function");
    return environment.Declare(declaration.identifier, declaration.constant, declaration.type, declaration.value ? (0, Interpreter_1.Evaluate)(declaration.value, environment) : Values_1.MakeValue.Undefined());
}
exports.EvaluateDeclaration = EvaluateDeclaration;
function EvaluateDeletion(deletion, environment) {
    return environment.Delete(deletion.target);
}
exports.EvaluateDeletion = EvaluateDeletion;
function EvaluateUseLibrary(library, environment) {
    return environment.UseLibrary(library.target);
}
exports.EvaluateUseLibrary = EvaluateUseLibrary;
