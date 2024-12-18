const {  server } = require("./app");
const Databaseconnec = require("./Db/Dbconnection");
const dotenv = require("dotenv");

dotenv.config();

const port = process.env.PORT || 3001;



Databaseconnec()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is running on port  http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
    process.exit(1);
  });
