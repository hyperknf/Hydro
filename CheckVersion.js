const https = require("https")
const fs = require("fs")

https.get("https://cdn.hyperknf.com/hydro/latest", async response => {
    response.on("data", data => {
        if (data.toString().split("\n")[0] != fs.readFileSync(`${__dirname}\\Version`, "utf-8")) console.log("\nNEW VERSION FOR HYDRO IS AVAILABLE")
    })
})