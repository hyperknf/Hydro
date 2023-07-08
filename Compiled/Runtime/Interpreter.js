"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Evaluate = void 0;
var Values_1 = require("./Values");
var Expressions_1 = require("./Evaluate/Expressions");
var Statements_1 = require("./Evaluate/Statements");
function Evaluate(ast_node, environment) {
    switch (ast_node.kind) {
        case "NumericLiteral":
            return Values_1.MakeValue.Number(ast_node.value);
        case "StringLiteral":
            return Values_1.MakeValue.String(ast_node.value);
        case "Identifier":
            return (0, Expressions_1.EvaluateIdentifier)(ast_node, environment);
        case "ObjectLiteral":
            return (0, Expressions_1.EvaluateObjectExpression)(ast_node, environment);
        case "CallExpression":
            return (0, Expressions_1.EvaluateCallExpression)(ast_node, environment);
        case "BinaryExpression":
            return (0, Expressions_1.EvaluateBinaryExpression)(ast_node, environment);
        case "Program":
            return (0, Statements_1.EvaluateProgram)(ast_node, environment);
        case "Declaration":
            return (0, Statements_1.EvaluateDeclaration)(ast_node, environment);
        case "Deletion":
            return (0, Statements_1.EvaluateDeletion)(ast_node, environment);
        case "UseLibrary":
            return (0, Statements_1.EvaluateUseLibrary)(ast_node, environment);
        case "AssignmentExpression":
            return (0, Expressions_1.EvaluateAssignment)(ast_node, environment);
        default:
            throw new Error("This type of AST node has not been implemented for interpretation yet: ".concat(JSON.stringify(ast_node, null, 2)));
    }
}
exports.Evaluate = Evaluate;
