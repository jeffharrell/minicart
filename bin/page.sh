#!/bin/bash


git checkout gh-pages

git checkout master -- README.md

echo -e "---\nlayout: index\n---\n\n"|cat - README.md > index.md

git add index.md
git rm README.md

git commit -am "Doc updates from master"
git push origin gh-pages
