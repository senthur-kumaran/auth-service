## How to run the project in the local machine

* Clone the project.
* `cd` into the project folder.
* Run `npm ci`.
* Create a file `secrets.json` in the root directory with below json params and values.
  
  ```json
  {
    "DB": "",
    "JWT_SECRET": ""
  }
  ```

* Run `serverless offline`.

## Summary

* Built a simple authentication using Serverless Framework (Node.js, API Gateway, Lambda, JWT) and MongoDB with ESlint standard.
