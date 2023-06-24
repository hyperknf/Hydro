import { Statement, Program, Expression, BinaryExpression, NumericLiteral, StringLiteral, Identifier, Declaration, Deletion, Parameter, Property, ObjectLiteral, CallExpression, MemberExpression } from "./AST"
import { Tokenize, Token, TokenType } from "./Lexer"
import { ValueType } from "../Runtime/Values"
import { AssignmentExpression } from "./AST"

export default class Parser {
    private Tokens: Token[] = []

    private NotEOF(): boolean {
        return this.Tokens[0].type != TokenType.EndOfFile
    }

    private At(): Token {
        return this.Tokens[0] as Token
    }

    private Eat(): Token {
        const previous_token = this.Tokens.shift() as Token
        return previous_token
    }

    private Expect(type: TokenType, error: any) {
        const previous = this.Eat() as Token
        if (!previous || previous.type != type) throw new Error(`${error} ${previous.type}, expected: ${type}`)
        return previous
    }

    private ExpectMultiple(type_list: TokenType[], error: any) {
        const previous = this.Eat() as Token
        if (!type_list.includes(previous.type)) throw new Error(`${error} ${previous.type}, expected: ${type_list.join(" | ")}`)
        return previous
    }

    private ParseAdditiveExpression(): Expression {
        let left = this.ParseMultiplicativeExpression()
        while (this.At().value == "+" || this.At().value == "-") {
            const operator = this.Eat().value
            const right = this.ParseMultiplicativeExpression()
            left = {
                kind: "BinaryExpression",
                left,
                right,
                operator
            } as BinaryExpression
        }
        return left
    }

    private ParseMultiplicativeExpression(): Expression {
        let left = this.ParseCallMemberExpression()
        while (this.At().value == "*" || this.At().value == "/" || this.At().value == "%") {
            const operator = this.Eat().value
            const right = this.ParseCallMemberExpression()
            left = {
                kind: "BinaryExpression",
                left,
                right,
                operator
            } as BinaryExpression
        }
        return left
    }

    private ParseCallMemberExpression(): Expression {
        const member = this.ParseMemberExpression()
        if (this.At().type == TokenType.OpenParenthesis) return this.ParseCallExpression(member)
        return member
    }

    private ParseCallExpression(caller: Expression): Expression {
        let call_expression: Expression = {
            kind: "CallExpression",
            caller,
            arguments: this.ParseArguments()
        } as CallExpression

        if (this.At().type == TokenType.OpenParenthesis) {
            call_expression = this.ParseCallExpression(call_expression)
        }

        return call_expression
    }

    private ParseArguments(): Expression[] {
        this.Expect(
            TokenType.OpenParenthesis,
            `Expected "(", got:`
        )
        const args: Expression[] = this.At().type == TokenType.CloseParenthesis ? [] : this.ParseArgumentsList()
        this.Expect(
            TokenType.CloseParenthesis,
            `Expected ")" after arguments list, got:`
        )
        return args
    }

    private ParseArgumentsList(): Expression[] {
        const args = [
            this.ParseExpression()
        ]

        while (this.At().type == TokenType.Comma && this.Eat()) {
            args.push(this.ParseExpression())
        }

        return args
    }

    private ParseMemberExpression(): Expression {
        let object: Expression = this.ParsePrimaryExpression()

        while (this.At().type == TokenType.Dot || this.At().type == TokenType.OpenBracket){
            const operator = this.Eat()
            let property: Expression
            let computed: boolean

            if (operator.type == TokenType.Dot) {
                computed = false
                property = this.ParsePrimaryExpression()

                if (property.kind != "Identifier") throw new Error(`Expected identifier, got: ${property.kind}`)
            } else {
                computed = true
                property = this.ParseExpression()
                this.Expect(
                    TokenType.CloseBracket,
                    `Expected "]", got:`
                )
            }

            object = {
                kind: "MemberExpression",
                object,
                property,
                computed
            } as MemberExpression
        }

        return object
    }

    private ParsePrimaryExpression(): Expression {
        const token_type = this.At().type

        switch (token_type) {
            case TokenType.Identifier:
                return {
                    kind: "Identifier",
                    symbol: this.Eat().value
                } as Identifier
            case TokenType.Number:
                return {
                    kind: "NumericLiteral",
                    value: parseFloat(this.Eat().value)
                } as NumericLiteral
            case TokenType.String:
                return {
                    kind: "StringLiteral",
                    value: this.Eat().value
                } as StringLiteral
            case TokenType.OpenParenthesis:
                this.Eat()
                const value = this.ParseExpression()
                this.Expect(
                    TokenType.CloseParenthesis,
                    "Unexpected token found inside parentheses: "
                )
                return value
            case TokenType.OpenBrace:
                return this.ParseObjectExpression()
            case TokenType.Set:
                return this.ParseAssignmentExpression()
            default:
                throw new Error(`Unexpected token found during parsing: ${this.At().value}`)
        }
    }

    private ParseDeclaration(): Statement {
        const declare = this.Eat()
        const changeable = this.Eat()
        let constant: boolean
        if (changeable.type == TokenType.Constant) {
            constant = true
        } else if (changeable.type == TokenType.Variable) {
            constant = false
        } else throw new Error(`Unexpected "${changeable.value}"`)
        const type_identifier = this.Expect(TokenType.Identifier, `Expected value type, got:`).value

        if (type_identifier == "function" as ValueType) return this.ParseFunctionDeclaration()

        const type = type_identifier == "number" ? "number" as ValueType :
        type_identifier == "string" ? "string" as ValueType :
        type_identifier == "boolean" ? "boolean" as ValueType :
        type_identifier == "undefined" ? "undefined" as ValueType :
        type_identifier == "object" ? "object" as ValueType :
        type_identifier == "function" ? "function" as ValueType :
        "null" as ValueType
        
        const identifier = this.Expect(
            TokenType.Identifier,
            "Expected identifier name, got:"
        ).value

        if (this.At().type != TokenType.As) {
            this.Eat()
            if (constant) throw new Error("Missing assignment to constant variable")
            return {
                kind: "Declaration",
                constant: false,
                type,
                identifier,
                value: undefined
            } as unknown as Declaration
        }

        this.Expect(TokenType.As, "Expected \"as\" after identifier in variable declaration")
        const declaration = {
            kind: "Declaration",
            constant,
            type: type,
            identifier,
            value: this.ParseExpression()
        } as unknown as Declaration

        return declaration
    }

    private ParseFunctionDeclaration(): Statement {
        const name = this.Expect(
            TokenType.Identifier,
            "Expected function name after function type, got:"
        ).value
        const with_keyword = this.Expect(
            TokenType.Identifier,
            `Expected "with" identifier after function name, got:`
        ).value
        if (with_keyword != "with") throw new Error(`Expected "with" identifier after function name, got: ${with_keyword}`)
        const parameters: Parameter[] = this.ParseParameters()
        const returns_keyword = this.Expect(
            TokenType.Identifier,
            `Expected "returns" identifier after parameters list, got:`
        ).value
        if (returns_keyword != "returns") throw new Error(`Expected "returns" identifier after parameters list, got: ${returns_keyword}`)
        
        throw new Error()
    }

    private ParseParameters(): Parameter[] {
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

        throw new Error()
    }

    private ParseDeletion(): Statement {
        const delete_token = this.Eat()
        const target = this.Expect(
            TokenType.Identifier,
            `Expected "identifier", got:`
        ).value
        const deletion = {
            kind: "Deletion",
            target: target
        } as unknown as Deletion

        return deletion
    }

    private ParseExpression(): Expression {
        return this.ParseAdditiveExpression()
    }

    private ParseObjectExpression(): Expression {
        if (this.At().type != TokenType.OpenBrace) return this.ParseAdditiveExpression()

        this.Eat()
        const properties = new Array<Property>()

        while (this.NotEOF() && this.At().type != TokenType.CloseBrace) {
            const key = this.Expect(
                TokenType.Identifier,
                `Expected "{" at the start of dictionary declaration, got:`
            ).value

            if (this.At().type == TokenType.CloseBrace) {
                properties.push({
                    key,
                    kind: "Property"
                } as unknown as Property)
                continue
            }

            const colon = this.Expect(
                TokenType.Colon,
                `Expected ":", got:`
            )
            const value = this.ParseExpression()
            properties.push({
                kind: "Property",
                value,
                key
            } as unknown as Property)

            if (this.At().type != TokenType.CloseBrace) this.Expect(
                TokenType.Comma,
                `Expected "," if not "}", got:`
            )
        }

        this.Expect(
            TokenType.CloseBrace,
            `Expected "}" at the end of dictionary, got:`
        )
        return {
            kind: "ObjectLiteral",
            properties
        } as ObjectLiteral
    }

    private ParseAssignmentExpression(): Expression {
        this.Eat()
        const left = this.ParseObjectExpression()
        if (this.At().type == TokenType.To) {
            this.Eat()
            const value = this.ParseExpression()
            return {
                value: value as Expression,
                target: left,
                kind: "AssignmentExpression"
            } as AssignmentExpression
        } else throw new Error(`Expected "to" after identifier in variable assignment, got ${this.At().type}`)
    }

    private ParseStatement(): Statement {
        switch (this.At().type) {
            case TokenType.Declare:
                return this.ParseDeclaration()
            case TokenType.Delete:
                return this.ParseDeletion()
            default: return this.ParseExpression()
        }
    }

    public ProduceAST(source: string): Program {
        this.Tokens = Tokenize(source)
        const program: Program = {
            kind: "Program",
            body: []
        }

        while (this.NotEOF()) {
            program.body.push(this.ParseStatement())
        }

        return program
    }
}