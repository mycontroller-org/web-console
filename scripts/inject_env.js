// reference https://stackoverflow.com/a/62879437
const childProcess = require("child_process")
const fs = require("fs")
const moment = require("moment")

const predefined = {
  CHOKIDAR_USEPOLLING: "true",
}

// reset .env file
writeToEnv()

// add predefined values
const keys = Object.keys(predefined)
keys.forEach((key) => {
  writeToEnv(key, predefined[key])
})

// add branch name or tag name
childProcess.exec("git rev-parse --abbrev-ref HEAD", (_err, stdout) => {
  if (stdout === "HEAD") {
    childProcess.exec(" git describe --abbrev=0 --tags", (_err, stdout) => {
      writeToEnv("REACT_APP_GIT_BRANCH", stdout)
    })
  } else {
    writeToEnv("REACT_APP_GIT_BRANCH", stdout)
  }
})

// add sha in short
childProcess.exec("git rev-parse --short HEAD", (_err, stdout) => {
  writeToEnv("REACT_APP_GIT_SHA_SHORT", stdout)
})

// add sha in long
childProcess.exec("git rev-parse HEAD", (_err, stdout) => {
  writeToEnv("REACT_APP_GIT_SHA", stdout)
})

// add build date
writeToEnv("REACT_APP_BUILD_DATE", moment().format())

function writeToEnv(key = "", value = "") {
  const empty = key === "" && value === ""

  if (empty) {
    fs.writeFile(".env", "", () => {})
  } else {
    fs.appendFile(".env", `${key}='${value.trim()}'\n`, (err) => {
      if (err) console.log(err)
    })
  }
}

// trick typescript to think it's a module
// https://stackoverflow.com/a/56577324/9449426
// export {}
