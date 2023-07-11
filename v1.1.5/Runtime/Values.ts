import { Environment } from "./Environment"

export type ValueType =
"null" |
"undefined" |
"number" |
"string" |
"boolean" |
"object" |
"function" |
"native-function"

export interface RuntimeValue {
    type: ValueType
}

export interface NullValue extends RuntimeValue {
    type: "null",
    value: null
}

export interface UndefinedValue extends RuntimeValue {
    type: "undefined",
    value: undefined
}

export interface NumberValue extends RuntimeValue {
    type: "number",
    value: number
}

export interface StringValue extends RuntimeValue {
    type: "string",
    value: string
}

export interface BooleanValue extends RuntimeValue {
    type: "boolean",
    value: boolean
}

export interface ObjectValue extends RuntimeValue {
    type: "object",
    properties: Map<string, RuntimeValue>
}

export type FunctionCall = (args: RuntimeValue[], environment: Environment) => RuntimeValue

export interface NativeFunctionValue extends RuntimeValue {
    type: "native-function",
    call: FunctionCall
}

export const MakeValue: Record<string, Function> = {
    "Null": (): NullValue => {
        return {
            type: "null",
            value: null
        } as NullValue
    },
    "Undefined": (): UndefinedValue => {
        return {
            type: "undefined",
            value: undefined
        } as UndefinedValue
    },
    "Number": (number: number = 0): NumberValue => {
        return {
            type: "number",
            value: number
        } as NumberValue
    },
    "String": (string: string = ""): StringValue => {
        return {
            type: "string",
            value: string
        } as StringValue
    },
    "Boolean": (bool: boolean = true): BooleanValue => {
        return {
            type: "boolean",
            value: bool
        } as BooleanValue
    },
    "NativeFunction": (call: FunctionCall): NativeFunctionValue => {
        return {
            type: "native-function",
            call
        } as NativeFunctionValue
    }
}