APP_NAME = simple-checkout-system
DEV_PORT = 3000
DEV_URL = http://localhost:$(DEV_PORT)
DEV_BROWSER = cr

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
	docker exec -it $(APP_NAME) npx playwright test

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
	if [ ! "$$(docker ps -qf name=${APP_NAME})" ]; then \
		test $$(docker image list -aqf reference=$(APP_NAME)) || docker build -t $(APP_NAME) . --target dev; \
		test $$(docker container ls -aqf name=$(APP_NAME)) && docker container rm -f $(APP_NAME); \
		docker run --rm -itp $(DEV_PORT):$(DEV_PORT) -v $(PWD):/usr/src/app --name $(APP_NAME) $(APP_NAME) dev $(DEV_PORT); \
	fi

## dev/logs: connect to running application logs
.PHONY: dev/logs
dev/logs: dev
	docker logs -ft $(APP_NAME)

## dev/open: open the application
.PHONY: dev/open
dev/open: dev
	npx playwright open -b $(DEV_BROWSER) $(DEV_URL) --viewport-size "768, 1024"


# ==================================================================================== #
# OPERATIONS
# ==================================================================================== #

## clean: clean the local environment
.PHONY: clean
clean: confirm
	docker rm -fv $(APP_NAME)
	docker rmi -f $(APP_NAME)
	rm -rf ./node_modules ./dist

## push: push changes to the remote Git repository
.PHONY: push
push: confirm audit no-dirty
	git push

## production/deploy: deploy the application to production
.PHONY: production/deploy
production/deploy: confirm audit no-dirty
	fly deploy

