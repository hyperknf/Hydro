import { AssignmentExpression, BinaryExpression, CallExpression, Identifier, ObjectLiteral } from "../../Frontend/AST"
import { RuntimeValue, MakeValue, NumberValue, ObjectValue, NativeFunctionValue } from "../Values"
import { Environment } from "../Environment"
import { Evaluate } from "../Interpreter"

export function EvaluateBinaryExpression(binary_operation: BinaryExpression, environment: Environment): RuntimeValue {
    const left = Evaluate(binary_operation.left, environment)
    const right = Evaluate(binary_operation.right, environment)
    
    if (left.type == "number" && right.type == "number") {
        return EvaluateNumericBinaryExpression(left as NumberValue, right as NumberValue, binary_operation.operator)
    }

    return MakeValue.Null()
}

export function EvaluateIdentifier(identifier: Identifier, environment: Environment): RuntimeValue {
    const variable = environment.Search(identifier.symbol)
    return variable.Value
}

export function EvaluateObjectExpression(object: ObjectLiteral, environment: Environment): RuntimeValue {
    const return_object = {
        type: "object",
        properties: new Map()
    } as unknown as ObjectValue

    for (const {
        key,
        value
    } of object.properties) {
        const runtime_value = (value == undefined) ? environment.Search(key).Value : Evaluate(value, environment)
        return_object.properties.set(key, runtime_value)
    }

    return return_object
}

export function EvaluateNumericBinaryExpression(left: NumberValue, right: NumberValue, operator: string): NumberValue {
    let result: number = 0
    
    if (operator == "+") {
        result = left.value + right.value
    } else if (operator == "-") {
        result = left.value - right.value
    } else if (operator == "*") {
        result = left.value * right.value
    } else if (operator == "/") {
        result = left.value / right.value
    } else if (operator == "%") {
        result = left.value % right.value
    } else throw new Error("Invalid binary operation operator")
    return MakeValue.Number(result)
}

export function EvaluateAssignment(node: AssignmentExpression, environment: Environment): RuntimeValue {
    if (node.target.kind != "Identifier") throw new Error(`Invalid assignment target, got: ${JSON.stringify(node.target)}`)

    const name = (node.target as Identifier).symbol
    return environment.Assign(name, Evaluate(node.value, environment))
}

export function EvaluateCallExpression(expression: CallExpression, environment: Environment): RuntimeValue {
    const args: RuntimeValue[] = expression.arguments.map(
        arg => Evaluate(arg, environment)
    )
    const func = Evaluate(expression.caller, environment)
    
    if (func.type != "native-function") throw new Error(`Cannot function call a type "${func.type}"`)

    return (func as NativeFunctionValue).call(args, environment)
}