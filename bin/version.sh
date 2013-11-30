#!/bin/bash

VERSION=$1


npm version $VERSION


if [ $? -eq 0 ]
then
	# Update the build number inline
	grunt build
	git commit -am "Updating dist for $VERSION"
	git push

	# Update the gh-pages branch
	git checkout gh-pages
	git checkout master -- dist
	git commit -am "Updating dist for $VERSION"
	git push

	# Push the latest tag to Github and npm
	npm publish
	git push --tags

	git checkout master
else
	exit 1
fi
