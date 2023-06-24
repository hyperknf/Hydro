import { RuntimeValue, MakeValue, ValueType } from "../Values"
import { Environment } from "../Environment"
import { Program, Declaration, Deletion } from "../../Frontend/AST"
import { Evaluate } from "../Interpreter"

export function EvaluateProgram(program: Program, environment: Environment): RuntimeValue {
    let last_evaluated: RuntimeValue = MakeValue.Null()

    for (const statement of program.body) {
        last_evaluated = Evaluate(statement, environment)
    }

    return last_evaluated
}

export function EvaluateDeclaration(declaration: Declaration, environment: Environment): RuntimeValue {
    if (declaration.type == "native-function") throw new Error("Cannot declare native function")
    return environment.Declare(
        declaration.identifier,
        declaration.constant,
        declaration.type,
        declaration.value ? Evaluate(declaration.value, environment) : MakeValue.Undefined()
    )
}

export function EvaluateDeletion(deletion: Deletion, environment: Environment) {
    return environment.Delete(deletion.target)
}