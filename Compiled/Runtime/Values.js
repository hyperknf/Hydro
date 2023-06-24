"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeValue = void 0;
exports.MakeValue = {
    "Null": function () {
        return {
            type: "null",
            value: null
        };
    },
    "Undefined": function () {
        return {
            type: "undefined",
            value: undefined
        };
    },
    "Number": function (number) {
        if (number === void 0) { number = 0; }
        return {
            type: "number",
            value: number
        };
    },
    "String": function (string) {
        if (string === void 0) { string = ""; }
        return {
            type: "string",
            value: string
        };
    },
    "Boolean": function (bool) {
        if (bool === void 0) { bool = true; }
        return {
            type: "boolean",
            value: bool
        };
    },
    "NativeFunction": function (call) {
        return {
            type: "native-function",
            call: call
        };
    }
};
