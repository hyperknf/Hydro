"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environment = exports.Variable = exports.SetupGlobalScope = void 0;
var Values_1 = require("./Values");
var NativeFunctions = require("./NativeFunctions");
var Libraries = require("./Libraries");
function SetupGlobalScope(environment) {
    environment.Declare("version", true, "number", Values_1.MakeValue.Number(8));
    environment.Declare("true", true, "boolean", Values_1.MakeValue.Boolean(true));
    environment.Declare("false", true, "boolean", Values_1.MakeValue.Boolean(false));
    environment.Declare("null", true, "null", Values_1.MakeValue.Null());
    environment.Declare("undefined", true, "undefined", Values_1.MakeValue.Undefined());
    environment.Declare("getTime", true, "native-function", Values_1.MakeValue.NativeFunction(NativeFunctions.GetTime));
    environment.Declare("evaluate", true, "native-function", Values_1.MakeValue.NativeFunction(NativeFunctions.Eval));
}
exports.SetupGlobalScope = SetupGlobalScope;
var Variable = /** @class */ (function () {
    function Variable(constant, type, value) {
        this.Constant = constant;
        this.Type = type;
        this.Value = value;
    }
    Variable.prototype.Set = function (value) {
        this.Value = value;
        return this;
    };
    return Variable;
}());
exports.Variable = Variable;
var Environment = /** @class */ (function () {
    function Environment(parent_environment) {
        this.EnvironmentVariables = [
            "version",
            "true",
            "false",
            "null",
            "undefined",
            "print",
            "prompt",
            "getTime",
            "evaluate"
        ];
        this.LibraryVariables = [
            "baseEncode",
            "baseDecode"
        ];
        this.Parent = parent_environment;
        this.Variables = new Map();
        if (!parent_environment)
            SetupGlobalScope(this);
    }
    Environment.prototype.Declare = function (name, constant, type, value) {
        if (type == "native-function" && !this.EnvironmentVariables.includes(name) && !this.LibraryVariables.includes(name))
            throw new Error("Cannot declare native function");
        if (this.Variables.has(name))
            throw new Error("Variable \"".concat(name, "\" has already been defined"));
        if (value.type != type)
            throw new Error("Cannot apply type \"".concat(value.type, "\" to type \"").concat(type, "\""));
        this.Variables.set(name, new Variable(constant, type, value));
        return value;
    };
    Environment.prototype.Assign = function (name, value) {
        var environment = this.Resolve(name);
        if (this.EnvironmentVariables.includes(name))
            throw new Error("Cannot reassign environment variables");
        if (this.Search(name).Constant)
            throw new Error("Cannot reassign constant variable");
        if (this.Search(name).Type != value.type)
            throw new Error("Cannot assign type \"".concat(value.type, "\" to type \"").concat(this.Search(name).Type, "\""));
        environment.Variables.set(name, this.Search(name).Set(value));
        return value;
    };
    Environment.prototype.Delete = function (name) {
        if (this.EnvironmentVariables.includes(name))
            throw new Error("Cannot delete environment variables");
        if (this.LibraryVariables.includes(name))
            throw new Error("Cannot delete library variables");
        var environment = this.Resolve(name);
        var value = this.Search(name).Value;
        environment.Variables.delete(name);
        return value;
    };
    Environment.prototype.Search = function (name) {
        var environment = this.Resolve(name);
        return environment.Variables.get(name);
    };
    Environment.prototype.Resolve = function (name) {
        if (this.Variables.has(name))
            return this;
        if (this.Parent == undefined)
            throw new Error("\"".concat(name, "\" is not defined"));
        return this.Parent.Resolve(name);
    };
    Environment.prototype.UseLibrary = function (library) {
        if (this.Parent)
            throw new Error("Cannot \"use\" library in non-global scope");
        if (!Libraries[library])
            throw new Error("Cannot find built-in library \"".concat(library, "\""));
        if (Libraries[library].constants) {
            for (var item in Libraries[library].constants) {
                if (this.Variables.has(item))
                    throw new Error("\"".concat(item, "\" is already defined, therefore cannot use library"));
                this.Declare(item, true, Libraries[library].constants[item].type, Libraries[library].constants[item].value);
            }
        }
        if (Libraries[library].functions) {
            for (var item in Libraries[library].functions) {
                if (this.Variables.has(item))
                    throw new Error("\"".concat(item, "\" is already defined, therefore cannot use library"));
                this.Declare(item, true, "native-function", Values_1.MakeValue.NativeFunction(Libraries[library].functions[item]));
            }
        }
        return Values_1.MakeValue.Null();
    };
    return Environment;
}());
exports.Environment = Environment;
