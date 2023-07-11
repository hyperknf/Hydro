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
        if (path == ".init") {
            console.log("\nInitializing Hydro module")
    
            const name = process.argv[3] || prompt("Enter module name: ")
    
            const entry = process.argv[4] || prompt("Enter entry file: ")
            if (entry.includes("\\") || entry.includes("/")) throw new Error("The entry name you've entered is a directory")
            const entry_absolute = Path.resolve(`./${entry}`)
            if (FileSystem.existsSync(entry_absolute)) throw new Error(`File ${entry_absolute} already exists`)
    
            const description = process.argv[5] || prompt("Enter description: ")
    
            const author = process.argv[6] || prompt("Enter author: ")
            const version = process.argv[7] || prompt("Enter module version: ")
    
            if (FileSystem.existsSync(Path.resolve("./hydro_config.json"))) throw new Error("hydro_config.json already exists in the current directory")
            
            FileSystem.writeFileSync(Path.resolve("./hydro_config.json"), JSON.stringify({
                main: entry,
                name,
                description,
                author,
                version
            }, null, 2))
            FileSystem.writeFileSync(Path.resolve(`./${entry}`), "")
    
            console.log("\nInitialization successful")

            return
        }

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