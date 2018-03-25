We create a file next to projects package.json called proxy.conf.json 
with the content

{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false
  }
}

"start": "ng serve --proxy-config proxy.conf.json",