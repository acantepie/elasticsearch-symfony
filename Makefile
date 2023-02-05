.PHONY: help

SHELL := '/bin/bash'
SYMFONY_IMAGE="symfony"

help: ## Outputs this help screen
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

dc-up:
	docker-compose up -d --remove-orphans

dc-down:
	docker-compose down

dc-sh:
	docker-compose exec $(SYMFONY_IMAGE) zsh

