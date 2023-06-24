import { RuntimeValue, MakeValue } from "./Values"
import { Statement, NumericLiteral, BinaryExpression, Program, Identifier, AssignmentExpression, Deletion, ObjectLiteral, CallExpression, StringLiteral } from "../Frontend/AST"
import { Environment } from "./Environment"
import { Declaration } from "../Frontend/AST"
import { EvaluateBinaryExpression, EvaluateIdentifier, EvaluateAssignment, EvaluateObjectExpression, EvaluateCallExpression } from "./Evaluate/Expressions"
import { EvaluateProgram, EvaluateDeclaration, EvaluateDeletion } from "./Evaluate/Statements"

export function Evaluate(ast_node: Statement, environment: Environment): RuntimeValue {
    switch (ast_node.kind) {
        case "NumericLiteral":
            return MakeValue.Number((ast_node as NumericLiteral).value)
        case "StringLiteral":
            return MakeValue.String((ast_node as StringLiteral).value)
        case "Identifier":
            return EvaluateIdentifier(ast_node as Identifier, environment)
        case "ObjectLiteral":
            return EvaluateObjectExpression(ast_node as ObjectLiteral, environment)
        case "CallExpression":
            return EvaluateCallExpression(ast_node as CallExpression, environment)
        case "BinaryExpression":
            return EvaluateBinaryExpression(ast_node as BinaryExpression, environment)
        case "Program":
            return EvaluateProgram(ast_node as Program, environment)
        case "Declaration":
            return EvaluateDeclaration(ast_node as unknown as Declaration, environment)
        case "Deletion":
            return EvaluateDeletion(ast_node as Deletion, environment)
        case "AssignmentExpression":
            return EvaluateAssignment(ast_node as AssignmentExpression, environment)
        default:
            throw new Error(`This type of AST node has not been implemented for interpretation yet: ${JSON.stringify(ast_node, null, 2)}`)
    }
}