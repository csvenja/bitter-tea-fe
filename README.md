```sh
npm install -g browserify watchify
npm install
watchify -t reactify -g uglifyify src/main.js -o build/main.js -v
```

Then run a simple web server to test:
```sh
python -m SimpleHTTPServer 9000
```
