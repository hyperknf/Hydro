import { MakeValue, RuntimeValue } from "./Values";

export function Print(args, scope): RuntimeValue {
    console.log(...args)
    return MakeValue.Undefined()
}

export function GetTime(args, scope): RuntimeValue {
    return MakeValue.Number(Date.now())
}