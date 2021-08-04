#!/bin/bash

git add docs
git commit -m "Chore:Update docs."
git checkout gh-pages
git merge main
git push origin gh-pages
git checkout main
