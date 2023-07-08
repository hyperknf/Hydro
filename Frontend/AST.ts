import { StringValue, ValueType } from "../Runtime/Values"

export type NodeType =
"Program" |
"Declaration" |
"FunctionDeclaration" |
"Deletion" |
"UseLibrary" |
"NumericLiteral" |
"StringLiteral" |
"Property" |
"ObjectLiteral" |
"MemberExpression" |
"CallExpression" |
"Identifier" |
"AssignmentExpression" |
"BinaryExpression"

export class Parameter {
    public Name: string
    public Type: ValueType

    constructor(name: string, type: ValueType) {
        this.Name = name
        this.Type = type
    }
}

export interface Statement {
    kind: NodeType
}

export interface Program extends Statement {
    kind: "Program",
    body: Statement[]
}

export interface Declaration extends Statement {
    kind: "Declaration",
    constant: boolean,
    type: ValueType,
    identifier: string,
    value?: Expression
}

export interface FunctionDeclaration extends Statement {
    kind: "FunctionDeclaration",
    name: string,
    parameters: Parameter[],
    async: boolean,
    body: Statement,
    return: ValueType
}

export interface Deletion extends Statement {
    kind: "Deletion",
    target: string
}

export interface UseLibrary extends Statement {
    kind: "UseLibrary",
    target: string
}

export interface Expression extends Statement {}

export interface AssignmentExpression extends Expression {
    kind: "AssignmentExpression",
    target: Expression,
    value: Expression
}

export interface BinaryExpression extends Expression {
    kind: "BinaryExpression",
    left: Expression,
    right: Expression,
    operator: string
}

export interface CallExpression extends Expression {
    kind: "CallExpression",
    arguments: Expression[],
    caller: Expression
}

export interface MemberExpression extends Expression {
    kind: "MemberExpression",
    object: Expression,
    property: Expression,
    computed: boolean
}

export interface Identifier extends Expression {
    kind: "Identifier",
    symbol: string
}

export interface NumericLiteral extends Expression {
    kind: "NumericLiteral",
    value: number
}

export interface StringLiteral extends Expression {
    kind: "StringLiteral",
    value: string
}

export interface Property extends Expression {
    kind: "Property",
    key: string,
    value: Expression
}

export interface ObjectLiteral extends Expression {
    kind: "ObjectLiteral",
    properties: Property[]
}