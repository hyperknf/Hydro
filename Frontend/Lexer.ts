export enum TokenType {
    Number,
    String,
    Identifier,
    OpenParenthesis,
    CloseParenthesis,
    BinaryOperator,
    Declare,
    Delete,
    Constant,
    Variable,
    As,
    Set,
    To,

    OpenBracket, // [
    CloseBracket,
    OpenBrace, // {
    CloseBrace,
    Colon,
    Comma,
    Dot,
    
    EndOfFile
}

const keywords: Record<string, TokenType> = {
    "declare": TokenType.Declare,
    "delete": TokenType.Delete,
    "constant": TokenType.Constant,
    "variable": TokenType.Variable,
    "as": TokenType.As,
    "set": TokenType.Set,
    "to": TokenType.To
}

export interface Token {
    value: string,
    type: TokenType
}

function is_alpha(character: string): boolean {
    return character.toUpperCase() != character.toLowerCase()
}

function is_integer(character: string): boolean {
    const unicode: number = character.charCodeAt(0)
    const boundaries: Array<number> = ["0".charCodeAt(0), "9".charCodeAt(0)]
    return (unicode >= boundaries[0] && unicode <= boundaries[1])
}

function is_skippable(character: string): boolean {
    return character == " " || character == "\t" || character == "\r" || character == "\n"
}

function token(value = "", type: TokenType): Token {
    return {
        value,
        type
    } as Token
}

export function Tokenize(source: string): Token[] {
    const tokens: Array<Token> = new Array<Token>()
    const source_characters: Array<string> = source.split("")

    while (source_characters.length > 0) {
        if (source_characters[0] == "(") {
            tokens.push(token(source_characters.shift(), TokenType.OpenParenthesis))
        } else if (source_characters[0] == ")") {
            tokens.push(token(source_characters.shift(), TokenType.CloseParenthesis))
        } else if (source_characters[0] == "{") {
            tokens.push(token(source_characters.shift(), TokenType.OpenBrace))
        } else if (source_characters[0] == "}") {
            tokens.push(token(source_characters.shift(), TokenType.CloseBrace))
        } else if (source_characters[0] == "[") {
            tokens.push(token(source_characters.shift(), TokenType.OpenBracket))
        } else if (source_characters[0] == "]") {
            tokens.push(token(source_characters.shift(), TokenType.CloseBracket))
        } else if (source_characters[0] == ":") {
            tokens.push(token(source_characters.shift(), TokenType.Colon))
        } else if (source_characters[0] == ",") {
            tokens.push(token(source_characters.shift(), TokenType.Comma))
        } else if (source_characters[0] == ".") {
            tokens.push(token(source_characters.shift(), TokenType.Dot))
        } else if (source_characters[0] == "+" || source_characters[0] == "-" || source_characters[0] == "*" || source_characters[0] == "/" || source_characters[0] == "%") {
            tokens.push(token(source_characters.shift(), TokenType.BinaryOperator))
        } else if (source_characters[0] == ";") {
            throw new Error(`Expected token, got: ";"`)
        } else if (source_characters[0] == "\"") {
            source_characters.shift()
            let string: string = ""
            while (source_characters[0] != "\"") {
                if (source_characters[0] == "\n" || !source_characters[0]) throw new Error("Unexpected end of string")
                string += source_characters.shift()
            }
            source_characters.shift()
            tokens.push(token(string, TokenType.String))
        } else {
            if (is_integer(source_characters[0])) {
                let number: string = ""
                while (source_characters.length > 0 && is_integer(source_characters[0])) number += source_characters.shift()
                tokens.push(token(number, TokenType.Number))
            } else if (is_alpha(source_characters[0])) {
                let identifier: string = ""
                while (source_characters.length > 0 && is_alpha(source_characters[0])) identifier += source_characters.shift()
                
                const reserved = keywords[identifier]
                if (typeof reserved == "number") {
                    tokens.push(token(identifier, reserved))
                } else {
                    tokens.push(token(identifier, TokenType.Identifier))
                }
            } else if (is_skippable(source_characters[0])) {
                source_characters.shift()
            } else throw new Error(`Unrecognized character found in source: ${source_characters[0]}`)
        }
    }

    tokens.push({
        type: TokenType.EndOfFile,
        value: "End"
    })
    
    return tokens
}