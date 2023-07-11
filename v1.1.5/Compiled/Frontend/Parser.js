"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Lexer_1 = require("./Lexer");
var Parser = /** @class */ (function () {
    function Parser() {
        this.Tokens = [];
    }
    Parser.prototype.NotEOF = function () {
        return this.Tokens[0].type != Lexer_1.TokenType.EndOfFile;
    };
    Parser.prototype.At = function () {
        return this.Tokens[0];
    };
    Parser.prototype.Eat = function () {
        var previous_token = this.Tokens.shift();
        return previous_token;
    };
    Parser.prototype.Expect = function (type, error) {
        var previous = this.Eat();
        if (!previous || previous.type != type)
            throw new Error("".concat(error, " ").concat(previous.type, ", expected: ").concat(type));
        return previous;
    };
    Parser.prototype.ExpectMultiple = function (type_list, error) {
        var previous = this.Eat();
        if (!type_list.includes(previous.type))
            throw new Error("".concat(error, " ").concat(previous.type, ", expected: ").concat(type_list.join(" | ")));
        return previous;
    };
    Parser.prototype.ParseAdditiveExpression = function () {
        var left = this.ParseMultiplicativeExpression();
        while (this.At().value == "+" || this.At().value == "-") {
            var operator = this.Eat().value;
            var right = this.ParseMultiplicativeExpression();
            left = {
                kind: "BinaryExpression",
                left: left,
                right: right,
                operator: operator
            };
        }
        return left;
    };
    Parser.prototype.ParseMultiplicativeExpression = function () {
        var left = this.ParseCallMemberExpression();
        while (this.At().value == "*" || this.At().value == "/" || this.At().value == "%") {
            var operator = this.Eat().value;
            var right = this.ParseCallMemberExpression();
            left = {
                kind: "BinaryExpression",
                left: left,
                right: right,
                operator: operator
            };
        }
        return left;
    };
    Parser.prototype.ParseCallMemberExpression = function () {
        var member = this.ParseMemberExpression();
        if (this.At().type == Lexer_1.TokenType.OpenParenthesis)
            return this.ParseCallExpression(member);
        return member;
    };
    Parser.prototype.ParseCallExpression = function (caller) {
        var call_expression = {
            kind: "CallExpression",
            caller: caller,
            arguments: this.ParseArguments()
        };
        if (this.At().type == Lexer_1.TokenType.OpenParenthesis) {
            call_expression = this.ParseCallExpression(call_expression);
        }
        return call_expression;
    };
    Parser.prototype.ParseArguments = function () {
        this.Expect(Lexer_1.TokenType.OpenParenthesis, "Expected \"(\", got:");
        var args = this.At().type == Lexer_1.TokenType.CloseParenthesis ? [] : this.ParseArgumentsList();
        this.Expect(Lexer_1.TokenType.CloseParenthesis, "Expected \")\" after arguments list, got:");
        return args;
    };
    Parser.prototype.ParseArgumentsList = function () {
        var args = [
            this.ParseExpression()
        ];
        while (this.At().type == Lexer_1.TokenType.Comma && this.Eat()) {
            args.push(this.ParseExpression());
        }
        return args;
    };
    Parser.prototype.ParseMemberExpression = function () {
        var object = this.ParsePrimaryExpression();
        while (this.At().type == Lexer_1.TokenType.Dot || this.At().type == Lexer_1.TokenType.OpenBracket) {
            var operator = this.Eat();
            var property = void 0;
            var computed = void 0;
            if (operator.type == Lexer_1.TokenType.Dot) {
                computed = false;
                property = this.ParsePrimaryExpression();
                if (property.kind != "Identifier")
                    throw new Error("Expected identifier, got: ".concat(property.kind));
            }
            else {
                computed = true;
                property = this.ParseExpression();
                this.Expect(Lexer_1.TokenType.CloseBracket, "Expected \"]\", got:");
            }
            object = {
                kind: "MemberExpression",
                object: object,
                property: property,
                computed: computed
            };
        }
        return object;
    };
    Parser.prototype.ParsePrimaryExpression = function () {
        var token_type = this.At().type;
        switch (token_type) {
            case Lexer_1.TokenType.Identifier:
                return {
                    kind: "Identifier",
                    symbol: this.Eat().value
                };
            case Lexer_1.TokenType.Number:
                return {
                    kind: "NumericLiteral",
                    value: parseFloat(this.Eat().value)
                };
            case Lexer_1.TokenType.String:
                return {
                    kind: "StringLiteral",
                    value: this.Eat().value
                };
            case Lexer_1.TokenType.OpenParenthesis:
                this.Eat();
                var value = this.ParseExpression();
                this.Expect(Lexer_1.TokenType.CloseParenthesis, "Unexpected token found inside parentheses: ");
                return value;
            case Lexer_1.TokenType.OpenBrace:
                return this.ParseObjectExpression();
            case Lexer_1.TokenType.Set:
                return this.ParseAssignmentExpression();
            default:
                throw new Error("Unexpected token found during parsing: ".concat(this.At().value));
        }
    };
    Parser.prototype.ParseDeclaration = function () {
        var declare = this.Eat();
        var changeable = this.Eat();
        var constant;
        if (changeable.type == Lexer_1.TokenType.Constant) {
            constant = true;
        }
        else if (changeable.type == Lexer_1.TokenType.Variable) {
            constant = false;
        }
        else
            throw new Error("Unexpected \"".concat(changeable.value, "\""));
        var type_identifier = this.Expect(Lexer_1.TokenType.Identifier, "Expected value type, got:").value;
        if (type_identifier == "function")
            return this.ParseFunctionDeclaration();
        var type = type_identifier == "number" ? "number" :
            type_identifier == "string" ? "string" :
                type_identifier == "boolean" ? "boolean" :
                    type_identifier == "undefined" ? "undefined" :
                        type_identifier == "object" ? "object" :
                            type_identifier == "function" ? "function" :
                                "null";
        var identifier = this.Expect(Lexer_1.TokenType.Identifier, "Expected identifier name, got:").value;
        if (this.At().type != Lexer_1.TokenType.As) {
            this.Eat();
            if (constant)
                throw new Error("Missing assignment to constant variable");
            return {
                kind: "Declaration",
                constant: false,
                type: type,
                identifier: identifier,
                value: undefined
            };
        }
        this.Expect(Lexer_1.TokenType.As, "Expected \"as\" after identifier in variable declaration");
        var declaration = {
            kind: "Declaration",
            constant: constant,
            type: type,
            identifier: identifier,
            value: this.ParseExpression()
        };
        return declaration;
    };
    Parser.prototype.ParseFunctionDeclaration = function () {
        var name = this.Expect(Lexer_1.TokenType.Identifier, "Expected function name after function type, got:").value;
        var with_keyword = this.Expect(Lexer_1.TokenType.Identifier, "Expected \"with\" identifier after function name, got:").value;
        if (with_keyword != "with")
            throw new Error("Expected \"with\" identifier after function name, got: ".concat(with_keyword));
        var parameters = this.ParseParameters();
        var returns_keyword = this.Expect(Lexer_1.TokenType.Identifier, "Expected \"returns\" identifier after parameters list, got:").value;
        if (returns_keyword != "returns")
            throw new Error("Expected \"returns\" identifier after parameters list, got: ".concat(returns_keyword));
        throw new Error();
    };
    Parser.prototype.ParseParameters = function () {
        //const open_parenthesis = this.Eat()
        //if (open_parenthesis.value != "(") throw new Error(`Expected "(" after "with" keyword, got: ${open_parenthesis.value}`)
        //const tokens: Token[] = []
        //while (this.At().value != ")") tokens.push(this.Eat())
        //while (tokens.length > 0) {
        //    if (tokens[0].type != TokenType.Identifier) throw new Error(`Expected parameter type after "with" keyword, got: ${tokens[0].value}`)
        //    const type = tokens.shift()
        //    if (!(
        //        type.value == "null" ||
        //        type.value == "undefined" ||
        //        type.value == "number" ||
        //        type.value == "boolean" ||
        //        type.value == "function"
        //    )) throw new Error(`Expected parameter type, got: Identifier`)
        //    const identifier = tokens.shift
        //}
        throw new Error();
    };
    Parser.prototype.ParseDeletion = function () {
        var delete_token = this.Eat();
        var target = this.Expect(Lexer_1.TokenType.Identifier, "Expected \"identifier\", got:").value;
        var deletion = {
            kind: "Deletion",
            target: target
        };
        return deletion;
    };
    Parser.prototype.ParseExpression = function () {
        return this.ParseAdditiveExpression();
    };
    Parser.prototype.ParseObjectExpression = function () {
        if (this.At().type != Lexer_1.TokenType.OpenBrace)
            return this.ParseAdditiveExpression();
        this.Eat();
        var properties = new Array();
        while (this.NotEOF() && this.At().type != Lexer_1.TokenType.CloseBrace) {
            var key = this.Expect(Lexer_1.TokenType.Identifier, "Expected \"{\" at the start of dictionary declaration, got:").value;
            if (this.At().type == Lexer_1.TokenType.CloseBrace) {
                properties.push({
                    key: key,
                    kind: "Property"
                });
                continue;
            }
            var colon = this.Expect(Lexer_1.TokenType.Colon, "Expected \":\", got:");
            var value = this.ParseExpression();
            properties.push({
                kind: "Property",
                value: value,
                key: key
            });
            if (this.At().type != Lexer_1.TokenType.CloseBrace)
                this.Expect(Lexer_1.TokenType.Comma, "Expected \",\" if not \"}\", got:");
        }
        this.Expect(Lexer_1.TokenType.CloseBrace, "Expected \"}\" at the end of dictionary, got:");
        return {
            kind: "ObjectLiteral",
            properties: properties
        };
    };
    Parser.prototype.ParseUseLibrary = function () {
        this.Eat();
        if (this.At().type != Lexer_1.TokenType.String)
            throw new Error("Expected string after \"use\" keyword");
        var library = this.Eat().value;
        return {
            kind: "UseLibrary",
            target: library
        };
    };
    Parser.prototype.ParseAssignmentExpression = function () {
        this.Eat();
        var left = this.ParseObjectExpression();
        if (this.At().type == Lexer_1.TokenType.To) {
            this.Eat();
            var value = this.ParseExpression();
            return {
                value: value,
                target: left,
                kind: "AssignmentExpression"
            };
        }
        else
            throw new Error("Expected \"to\" after identifier in variable assignment, got ".concat(this.At().type));
    };
    Parser.prototype.ParseStatement = function () {
        switch (this.At().type) {
            case Lexer_1.TokenType.Declare:
                return this.ParseDeclaration();
            case Lexer_1.TokenType.Delete:
                return this.ParseDeletion();
            case Lexer_1.TokenType.Use:
                return this.ParseUseLibrary();
            default: return this.ParseExpression();
        }
    };
    Parser.prototype.ProduceAST = function (source) {
        this.Tokens = (0, Lexer_1.Tokenize)(source);
        var program = {
            kind: "Program",
            body: []
        };
        while (this.NotEOF()) {
            program.body.push(this.ParseStatement());
        }
        return program;
    };
    return Parser;
}());
exports.default = Parser;
