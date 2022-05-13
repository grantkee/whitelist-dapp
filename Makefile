.PHONY: help ci ui_test dev ui_shell reset up destroy compose

# full path for this Makefile
ROOT_DIR:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
DOCKER_IMAGE="registry.gitlab.com/fractalnetworks/fractal-link-ui:git-main"
ENV=prod
.DEFAULT: help

help:
	@echo "\nmake up"
	@echo "\n:::Launch docker container with current directory as a mounted volume."
up:
	docker run -it --rm -v `pwd`:/code --workdir /code -p 3000:3000 node:16-alpine ash
