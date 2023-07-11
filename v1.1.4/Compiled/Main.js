"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Run = void 0;
var Parser_1 = require("./Frontend/Parser");
var Environment_1 = require("./Runtime/Environment");
var Interpreter_1 = require("./Runtime/Interpreter");
var FileSystem = require("fs");
var Path = require("path");
var prompt = require("prompt-sync")();
Run(process.argv[2]);
function Run(path) {
    return __awaiter(this, void 0, void 0, function () {
        var https, fs, parser, environment, run_path, absolute_path, data, main, config, input, program, result;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    https = require("https");
                    fs = require("fs");
                    return [4 /*yield*/, https.get("https://cdn.hyperknf.com/hydro/latest", function (response) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                response.on("data", function (data) {
                                    if (data.toString().split("\n")[0] != fs.readFileSync("".concat(__dirname, "\\Version"), "utf-8"))
                                        console.log("\nNEW VERSION FOR HYDRO IS AVAILABLE");
                                });
                                return [2 /*return*/];
                            });
                        }); })];
                case 1:
                    _a.sent();
                    parser = new Parser_1.default();
                    environment = new Environment_1.Environment();
                    run_path = function (path) {
                        var input = FileSystem.readFileSync(path, "utf-8");
                        var program = parser.ProduceAST(input);
                        var result = (0, Interpreter_1.Evaluate)(program, environment);
                        return result;
                    };
                    if (path) {
                        absolute_path = Path.resolve(process.argv[2]);
                        console.log("\nRunning ".concat(absolute_path, "\n"));
                        if (!FileSystem.existsSync(absolute_path))
                            throw new Error("Cannot find module or file in path ".concat(absolute_path));
                        data = FileSystem.statSync(absolute_path);
                        if (data.isFile()) {
                            run_path(absolute_path);
                        }
                        else if (data.isDirectory()) {
                            main = void 0;
                            if (FileSystem.existsSync(absolute_path + "\\hydro_config.json")) {
                                config = require(absolute_path + "\\hydro_config.json");
                                if (config.main)
                                    main = absolute_path + "\\" + config.main;
                            }
                            else if (FileSystem.existsSync(absolute_path + "\\main.hyd")) {
                                main = absolute_path + "\\main.hyd";
                            }
                            else
                                throw new Error("Cannot find main.hyd in module ".concat(absolute_path));
                            if (!FileSystem.existsSync(main))
                                throw new Error("Cannot find file ".concat(main));
                            run_path(main);
                        }
                        else
                            throw new Error("Path ".concat(absolute_path, " is neither module nor file"));
                    }
                    else {
                        console.log("\nHydro Repl v1.0\nMade by HyperKNF, all rights reserved\nCopyrighted under HyperKNF.com\nTo exit, type \"exit\"");
                        while (true) {
                            input = prompt("> ");
                            if (!input || input == "exit")
                                break;
                            try {
                                program = parser.ProduceAST(input);
                                result = (0, Interpreter_1.Evaluate)(program, environment);
                            }
                            catch (exception) {
                                console.log(exception);
                            }
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.Run = Run;
