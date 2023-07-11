import Parser from "./Frontend/Parser"
import { Environment } from "./Runtime/Environment"
import { Evaluate } from "./Runtime/Interpreter"
import * as FileSystem from "fs"
import * as Path from "path"

const prompt = require("prompt-sync")()

Run(process.argv[2])

export async function Run(path?: string): Promise<void> {
    const https = require("https")
    const fs = require("fs")

    await https.get("https://cdn.hyperknf.com/hydro/latest", async response => {
        response.on("data", data => {
            if (data.toString().split("\n")[0] != fs.readFileSync(`${__dirname}\\Version`, "utf-8")) console.log("\nNEW VERSION FOR HYDRO IS AVAILABLE")
        })
    })

    const parser = new Parser()
    const environment = new Environment()

    const run_path = (path: string) => {
        const input = FileSystem.readFileSync(path, "utf-8")
        const program = parser.ProduceAST(input)
        const result = Evaluate(program, environment)
        return result
    }

    if (path) {
        const absolute_path = Path.resolve(process.argv[2])
        console.log(`\nRunning ${absolute_path}\n`)

        if (!FileSystem.existsSync(absolute_path)) throw new Error(`Cannot find module or file in path ${absolute_path}`)

        const data = FileSystem.statSync(absolute_path)
        if (data.isFile()) {
            run_path(absolute_path)
        } else if (data.isDirectory()) {
            let main: string
            if (FileSystem.existsSync(absolute_path + "\\hydro_config.json")) {
                const config = require(absolute_path + "\\hydro_config.json")
                if (config.main) main = absolute_path + "\\" + config.main
            } else if (FileSystem.existsSync(absolute_path + "\\main.hyd")) {
                main = absolute_path + "\\main.hyd"
            } else throw new Error(`Cannot find main.hyd in module ${absolute_path}`)
            if (!FileSystem.existsSync(main)) throw new Error(`Cannot find file ${main}`)
            run_path(main)
        } else throw new Error(`Path ${absolute_path} is neither module nor file`)
    } else {
        console.log("\nHydro Repl v1.0\nMade by HyperKNF, all rights reserved\nCopyrighted under HyperKNF.com\nTo exit, type \"exit\"")
        while (true) {
            const input = prompt("> ")
            
            if (!input || input == "exit") break

            try {
                const program = parser.ProduceAST(input)
                const result = Evaluate(program, environment)
            } catch (exception) {
                console.log(exception)
            }
        }
    }

    return
}