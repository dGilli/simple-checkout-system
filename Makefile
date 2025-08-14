DEV_PORT ?= 3000

# ==================================================================================== #
# HELPERS
# ==================================================================================== #

## help: print this help message
.PHONY: help
help:
	@echo 'Usage:'
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' |  sed -e 's/^/ /'

.PHONY: confirm
confirm:
	@echo -n 'Are you sure? [y/N] ' && read ans && [ $${ans:-N} = y ]

.PHONY: no-dirty
no-dirty:
	@test -z "$(shell git status --porcelain)"


# ==================================================================================== #
# QUALITY CONTROL
# ==================================================================================== #

## audit: run quality control checks
.PHONY: audit
audit: test
	docker exec -it $(APP_NAME) npm run lint
	docker exec -it $(APP_NAME) npm audit

## test: run all tests
.PHONY: test
test: dev
	docker exec -it $(APP_NAME) npx playwright test --pass-with-no-tests

## upgradeable: list direct dependencies that have upgrades available
.PHONY: upgradeable
upgradeable: dev
	docker exec -it $(APP_NAME) npm outdated


# ==================================================================================== #
# DEVELOPMENT
# ==================================================================================== #

## tidy: tidy src and configuration files
.PHONY: tidy
tidy: dev
	docker exec -it $(APP_NAME) npm -- run lint --fix

## dev: run the application
.PHONY: dev
dev:
	docker run --rm -it -p $(DEV_PORT):$(DEV_PORT) -v $(PWD):/usr/src/app \
		$$(docker build -q . --target build) \
		npm run -- dev --host "0.0.0.0" --port $(DEV_PORT)

dev/open:
	open -u http://localhost:$(DEV_PORT) 2>/dev/null

production/deploy:
	fly deploy
