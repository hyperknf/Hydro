import Parser from "../Frontend/Parser"
import { Evaluate } from "./Interpreter"
import { MakeValue, RuntimeValue } from "./Values"

export function GetTime(args, scope): RuntimeValue {
    return MakeValue.Number(Date.now())
}

export function Eval(args, scope): RuntimeValue {
    if (args[0] && args[0].type != "string") throw new Error("Expected string in evaluate input")
    const value = args[0].value
    const parser = new Parser()
    const ast = parser.ProduceAST(value)
    return Evaluate(ast, scope)
}