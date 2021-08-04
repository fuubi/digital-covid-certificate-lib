#!/bin/bash

git checkout gh-pages
git merge main
git push origin gh-pages
git checkout main
