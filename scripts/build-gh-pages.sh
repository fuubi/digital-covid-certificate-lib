#!/bin/bash

ERR_1="Run this script in the main project folder."

cd examples/js-webpack || { echo "$ERR_1"; exit ; }
npm i
npm run-script build

cd ../.. # Back in the main project dir
rm -r docs
npm run-script docs

mkdir docs/demo
cp  examples/js-webpack/index.html docs/demo
cp -r examples/js-webpack/dist docs/demo
cp -r examples/js-webpack/assets docs/demo
