"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokenize = exports.TokenType = void 0;
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Number"] = 0] = "Number";
    TokenType[TokenType["String"] = 1] = "String";
    TokenType[TokenType["Identifier"] = 2] = "Identifier";
    TokenType[TokenType["OpenParenthesis"] = 3] = "OpenParenthesis";
    TokenType[TokenType["CloseParenthesis"] = 4] = "CloseParenthesis";
    TokenType[TokenType["BinaryOperator"] = 5] = "BinaryOperator";
    TokenType[TokenType["Declare"] = 6] = "Declare";
    TokenType[TokenType["Delete"] = 7] = "Delete";
    TokenType[TokenType["Constant"] = 8] = "Constant";
    TokenType[TokenType["Variable"] = 9] = "Variable";
    TokenType[TokenType["As"] = 10] = "As";
    TokenType[TokenType["Set"] = 11] = "Set";
    TokenType[TokenType["To"] = 12] = "To";
    TokenType[TokenType["OpenBracket"] = 13] = "OpenBracket";
    TokenType[TokenType["CloseBracket"] = 14] = "CloseBracket";
    TokenType[TokenType["OpenBrace"] = 15] = "OpenBrace";
    TokenType[TokenType["CloseBrace"] = 16] = "CloseBrace";
    TokenType[TokenType["Colon"] = 17] = "Colon";
    TokenType[TokenType["Comma"] = 18] = "Comma";
    TokenType[TokenType["Dot"] = 19] = "Dot";
    TokenType[TokenType["EndOfFile"] = 20] = "EndOfFile";
})(TokenType || (exports.TokenType = TokenType = {}));
var keywords = {
    "declare": TokenType.Declare,
    "delete": TokenType.Delete,
    "constant": TokenType.Constant,
    "variable": TokenType.Variable,
    "as": TokenType.As,
    "set": TokenType.Set,
    "to": TokenType.To
};
function is_alpha(character) {
    return character.toUpperCase() != character.toLowerCase();
}
function is_integer(character) {
    var unicode = character.charCodeAt(0);
    var boundaries = ["0".charCodeAt(0), "9".charCodeAt(0)];
    return (unicode >= boundaries[0] && unicode <= boundaries[1]);
}
function is_skippable(character) {
    return character == " " || character == "\t" || character == "\r" || character == "\n";
}
function token(value, type) {
    if (value === void 0) { value = ""; }
    return {
        value: value,
        type: type
    };
}
function Tokenize(source) {
    var tokens = new Array();
    var source_characters = source.split("");
    while (source_characters.length > 0) {
        if (source_characters[0] == "(") {
            tokens.push(token(source_characters.shift(), TokenType.OpenParenthesis));
        }
        else if (source_characters[0] == ")") {
            tokens.push(token(source_characters.shift(), TokenType.CloseParenthesis));
        }
        else if (source_characters[0] == "{") {
            tokens.push(token(source_characters.shift(), TokenType.OpenBrace));
        }
        else if (source_characters[0] == "}") {
            tokens.push(token(source_characters.shift(), TokenType.CloseBrace));
        }
        else if (source_characters[0] == "[") {
            tokens.push(token(source_characters.shift(), TokenType.OpenBracket));
        }
        else if (source_characters[0] == "]") {
            tokens.push(token(source_characters.shift(), TokenType.CloseBracket));
        }
        else if (source_characters[0] == ":") {
            tokens.push(token(source_characters.shift(), TokenType.Colon));
        }
        else if (source_characters[0] == ",") {
            tokens.push(token(source_characters.shift(), TokenType.Comma));
        }
        else if (source_characters[0] == ".") {
            tokens.push(token(source_characters.shift(), TokenType.Dot));
        }
        else if (source_characters[0] == "+" || source_characters[0] == "-" || source_characters[0] == "*" || source_characters[0] == "/" || source_characters[0] == "%") {
            tokens.push(token(source_characters.shift(), TokenType.BinaryOperator));
        }
        else if (source_characters[0] == ";") {
            throw new Error("Expected token, got: \";\"");
        }
        else if (source_characters[0] == "\"") {
            source_characters.shift();
            var string = "";
            while (source_characters[0] != "\"") {
                if (source_characters[0] == "\n" || !source_characters[0])
                    throw new Error("Unexpected end of string");
                string += source_characters.shift();
            }
            source_characters.shift();
            tokens.push(token(string, TokenType.String));
        }
        else {
            if (is_integer(source_characters[0])) {
                var number = "";
                while (source_characters.length > 0 && is_integer(source_characters[0]))
                    number += source_characters.shift();
                tokens.push(token(number, TokenType.Number));
            }
            else if (is_alpha(source_characters[0])) {
                var identifier = "";
                while (source_characters.length > 0 && is_alpha(source_characters[0]))
                    identifier += source_characters.shift();
                var reserved = keywords[identifier];
                if (typeof reserved == "number") {
                    tokens.push(token(identifier, reserved));
                }
                else {
                    tokens.push(token(identifier, TokenType.Identifier));
                }
            }
            else if (is_skippable(source_characters[0])) {
                source_characters.shift();
            }
            else
                throw new Error("Unrecognized character found in source: ".concat(source_characters[0]));
        }
    }
    tokens.push({
        type: TokenType.EndOfFile,
        value: "End"
    });
    return tokens;
}
exports.Tokenize = Tokenize;
