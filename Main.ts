import Parser from "./Frontend/Parser"
import { Environment } from "./Runtime/Environment"
import { Evaluate } from "./Runtime/Interpreter"
import * as ReadLine from "readline/promises"
import * as FileSystem from "fs"
import * as Path from "path"

Run(process.argv[2])

export async function Run(path?: string): Promise<void> {
    const RL = ReadLine.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    const parser = new Parser()
    const environment = new Environment()

    if (path) {
        console.log(`Running file ${Path.resolve(process.argv[2])}`)
        const input = FileSystem.readFileSync(path, "utf-8")
        const program = parser.ProduceAST(input)
        const result = Evaluate(program, environment)
    } else {
        console.log("\nHydro Repl v1.0\nMade by HyperKNF, all rights reserved\nCopyrighted under HyperKNF.com\nTo exit, press CTRL+D")
        while (true) {
            const input = await RL.question("> ", {
                signal: AbortSignal.timeout(2 ** 30)
            })
            
            if (!input || input.includes("exit")) break

            const program = parser.ProduceAST(input)
            const result = Evaluate(program, environment)
        }
    }

    return
}