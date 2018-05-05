const mkdirSync = require("fs").mkdirSync;
const writeFileSync = require("fs").writeFileSync;

const files = ["users", "messages"];

module.exports.initDatabase = function() {
  try {
    console.log("\nCreating database folder");
    mkdirSync("./db/");
  } catch (e) {
    console.log("Database folder already exists\n");
  }

  files.forEach(function(file) {
    try {
      console.log('Creating file "' + file + '.json"');
      writeFileSync("./db/" + file + ".json", JSON.stringify({ data: [] }), {
        flag: "wx"
      });
    } catch (e) {
      console.log("File already exists\n");
    }
  });

  console.log("\nDatabase initialized!\n");

  return true;
};
