import { StringValue, RuntimeValue, MakeValue } from "./Values"
import { Buffer } from "buffer"

const utilities = require("util")
const prompt = require("prompt-sync")()

export const Base64: Record<string, any> = {
    functions: {
        "baseEncode": (args, scope): StringValue => {
            if (args[0] && args[0].type != "string") throw new Error("Expected string in encode input")
            const string = args[0]
            if (string.type != "string") throw new Error("Encoding text must be a string")
            const str: string = string.value
            const encoded = Buffer.from(str, "ascii").toString("base64")
            return {
                type: "string",
                value: encoded
            } as StringValue
        },
        "baseDecode": (args, scope): StringValue => {
            if (args[0] && args[0].type != "string") throw new Error("Expected string in decode input")
            const string = args[0]
            if (string.type != "string") throw new Error("Encoding text must be a string")
            const str: string = string.value
            const encoded = Buffer.from(str, "base64").toString("ascii")
            return {
                type: "string",
                value: encoded
            } as StringValue
        }
    }
}

export const Console: Record<string, any> = {
    "functions": {
        "print": (args, scope): RuntimeValue => {
            const print_args: string[] = []
            for (const arg of args) print_args.push(String(arg.value))
            console.log(...print_args)
            return MakeValue.Undefined()
        },
        
        "prompt": (args, scope): RuntimeValue => {
            const prompt_args: string[] = []
            for (const prompt_arg of args) {
                prompt_args.push(prompt_arg.value)
            }
            return MakeValue.String(prompt(utilities.format(...prompt_args)))
        }
    }
}