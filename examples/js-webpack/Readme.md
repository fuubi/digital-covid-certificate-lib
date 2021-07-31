# Digital Covid Certificate Lib (DccLib) JavaScript sample project

This npm project is a straightforward JS starter project to help you set up and use the library.
It is important to add the node.js `util` and `node-polyfill-webpack-plugin` as dependencies to the package.json. These dependencies are required because the DccLib source code uses some libraries that require node.js specific classes, i.e., the Buffer class.

```bash
npm install
npm run-script build
npm start
```

Note for development:
We did not set up any hot-reload functionalities.
Just rerun the build command and reload the website.
