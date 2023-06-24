import { RuntimeValue, ValueType, MakeValue } from "./Values"
import * as NativeFunctions from "./NativeFunctions"

export function SetupGlobalScope(environment: Environment): void {
    environment.Declare("version", true, "number", MakeValue.Number(8))
    environment.Declare("true", true, "boolean", MakeValue.Boolean(true))
    environment.Declare("false", true, "boolean", MakeValue.Boolean(false))
    environment.Declare("null", true, "null", MakeValue.Null())
    environment.Declare("undefined", true, "undefined", MakeValue.Undefined())

    environment.Declare("print", true, "native-function", MakeValue.NativeFunction(NativeFunctions.Print))
    environment.Declare("getTime", true, "native-function", MakeValue.NativeFunction(NativeFunctions.GetTime))
}

export class Variable {
    public Constant: boolean
    public Type: ValueType
    public Value: RuntimeValue

    constructor(constant: boolean, type: ValueType, value: RuntimeValue) {
        this.Constant = constant
        this.Type = type
        this.Value = value
    }

    public Set(value: RuntimeValue): Variable {
        this.Value = value
        return this
    }
}

export class Environment {
    private Parent?: Environment
    private Variables: Map<string, Variable>
    private EnvironmentVariables: string[] = [
        "version",
        "true",
        "false",
        "null",
        "undefined",
        
        "print",
        "getTime"
    ]

    constructor(parent_environment?: Environment) {
        this.Parent = parent_environment
        this.Variables = new Map()
        if (!parent_environment) SetupGlobalScope(this)
    }

    public Declare(name: string, constant: boolean, type: ValueType, value: RuntimeValue): RuntimeValue {
        if (type == "native-function" && !this.EnvironmentVariables.includes(name)) throw new Error("Cannot declare native function")
        if (this.Variables.has(name)) throw new Error(`Variable "${name}" has already been defined`)
        if (value.type != type) throw new Error(`Cannot apply type "${value.type}" to type "${type}"`)
        this.Variables.set(name, new Variable(
            constant, type, value
        ))
        return value
    }

    public Assign(name: string, value: RuntimeValue): RuntimeValue {
        const environment = this.Resolve(name)
        if (this.EnvironmentVariables.includes(name)) throw new Error("Cannot reassign environment variables")
        if (this.Search(name).Constant) throw new Error(`Cannot reassign constant variable`)
        if (this.Search(name).Type != value.type) throw new Error(`Cannot assign type "${value.type}" to type "${this.Search(name).Type}"`)
        environment.Variables.set(name, this.Search(name).Set(value))
        return value
    }

    public Delete(name: string): RuntimeValue {
        if (this.EnvironmentVariables.includes(name)) throw new Error("Cannot delete environment variables")
        const environment = this.Resolve(name)
        const value = this.Search(name).Value
        environment.Variables.delete(name)
        return value
    }

    public Search(name: string): Variable {
        const environment = this.Resolve(name)
        return environment.Variables.get(name) as Variable
    }

    public Resolve(name: string): Environment {
        if (this.Variables.has(name)) return this
        if (this.Parent == undefined) throw new Error(`"${name}" is not defined`)
        return this.Parent.Resolve(name)
    }
}