import Parser from "../Frontend/Parser"
import { Evaluate } from "./Interpreter"
import { MakeValue, RuntimeValue } from "./Values"

const prompt = require("prompt-sync")()

export function Print(args, scope): RuntimeValue {
    const print_args: string[] = []
    for (const arg of args) print_args.push(String(arg.value))
    console.log(...print_args)
    return MakeValue.Undefined()
}

export function Prompt(args, scope): RuntimeValue {
    const prompt_args: string[] = []
    for (const prompt_arg of args) {
        prompt_args.push(prompt_arg.value)
    }
    console.log(...prompt_args)
    return MakeValue.String(prompt())
}

export function GetTime(args, scope): RuntimeValue {
    return MakeValue.Number(Date.now())
}

export function Eval(args, scope): RuntimeValue {
    const value = args[0].value
    const parser = new Parser()
    const ast = parser.ProduceAST(value)
    return Evaluate(ast, scope)
}