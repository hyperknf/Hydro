"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Console = exports.Base64 = void 0;
var Values_1 = require("./Values");
var buffer_1 = require("buffer");
var utilities = require("util");
var prompt = require("prompt-sync")();
exports.Base64 = {
    functions: {
        "baseEncode": function (args, scope) {
            if (args[0] && args[0].type != "string")
                throw new Error("Expected string in encode input");
            var string = args[0];
            if (string.type != "string")
                throw new Error("Encoding text must be a string");
            var str = string.value;
            var encoded = buffer_1.Buffer.from(str, "ascii").toString("base64");
            return {
                type: "string",
                value: encoded
            };
        },
        "baseDecode": function (args, scope) {
            if (args[0] && args[0].type != "string")
                throw new Error("Expected string in decode input");
            var string = args[0];
            if (string.type != "string")
                throw new Error("Encoding text must be a string");
            var str = string.value;
            var encoded = buffer_1.Buffer.from(str, "base64").toString("ascii");
            return {
                type: "string",
                value: encoded
            };
        }
    }
};
exports.Console = {
    "functions": {
        "print": function (args, scope) {
            var print_args = [];
            for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
                var arg = args_1[_i];
                print_args.push(String(arg.value));
            }
            console.log.apply(console, print_args);
            return Values_1.MakeValue.Undefined();
        },
        "prompt": function (args, scope) {
            var prompt_args = [];
            for (var _i = 0, args_2 = args; _i < args_2.length; _i++) {
                var prompt_arg = args_2[_i];
                prompt_args.push(prompt_arg.value);
            }
            return Values_1.MakeValue.String(prompt(utilities.format.apply(utilities, prompt_args)));
        }
    }
};
