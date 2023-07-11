"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluateCallExpression = exports.EvaluateAssignment = exports.EvaluateNumericBinaryExpression = exports.EvaluateObjectExpression = exports.EvaluateIdentifier = exports.EvaluateBinaryExpression = void 0;
var Values_1 = require("../Values");
var Interpreter_1 = require("../Interpreter");
function EvaluateBinaryExpression(binary_operation, environment) {
    var left = (0, Interpreter_1.Evaluate)(binary_operation.left, environment);
    var right = (0, Interpreter_1.Evaluate)(binary_operation.right, environment);
    if (left.type == "number" && right.type == "number") {
        return EvaluateNumericBinaryExpression(left, right, binary_operation.operator);
    }
    return Values_1.MakeValue.Null();
}
exports.EvaluateBinaryExpression = EvaluateBinaryExpression;
function EvaluateIdentifier(identifier, environment) {
    var variable = environment.Search(identifier.symbol);
    return variable.Value;
}
exports.EvaluateIdentifier = EvaluateIdentifier;
function EvaluateObjectExpression(object, environment) {
    var return_object = {
        type: "object",
        properties: new Map()
    };
    for (var _i = 0, _a = object.properties; _i < _a.length; _i++) {
        var _b = _a[_i], key = _b.key, value = _b.value;
        var runtime_value = (value == undefined) ? environment.Search(key).Value : (0, Interpreter_1.Evaluate)(value, environment);
        return_object.properties.set(key, runtime_value);
    }
    return return_object;
}
exports.EvaluateObjectExpression = EvaluateObjectExpression;
function EvaluateNumericBinaryExpression(left, right, operator) {
    var result = 0;
    if (operator == "+") {
        result = left.value + right.value;
    }
    else if (operator == "-") {
        result = left.value - right.value;
    }
    else if (operator == "*") {
        result = left.value * right.value;
    }
    else if (operator == "/") {
        result = left.value / right.value;
    }
    else if (operator == "%") {
        result = left.value % right.value;
    }
    else
        throw new Error("Invalid binary operation operator");
    return Values_1.MakeValue.Number(result);
}
exports.EvaluateNumericBinaryExpression = EvaluateNumericBinaryExpression;
function EvaluateAssignment(node, environment) {
    if (node.target.kind != "Identifier")
        throw new Error("Invalid assignment target, got: ".concat(JSON.stringify(node.target)));
    var name = node.target.symbol;
    return environment.Assign(name, (0, Interpreter_1.Evaluate)(node.value, environment));
}
exports.EvaluateAssignment = EvaluateAssignment;
function EvaluateCallExpression(expression, environment) {
    var args = expression.arguments.map(function (arg) { return (0, Interpreter_1.Evaluate)(arg, environment); });
    var func = (0, Interpreter_1.Evaluate)(expression.caller, environment);
    if (func.type != "native-function")
        throw new Error("Cannot function call a type \"".concat(func.type, "\""));
    return func.call(args, environment);
}
exports.EvaluateCallExpression = EvaluateCallExpression;
