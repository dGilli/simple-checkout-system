DEV_PORT    ?= 3000
DEV_URL     ?= http://localhost:$(DEV_PORT)
DEV_BROWSER ?= cr

## help: print this help message
.PHONY: help
help:
	@echo 'Usage:'
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' |  sed -e 's/^/ /'

## dev: run the application
.PHONY: dev
dev:
	docker run --rm -it -p $(DEV_PORT):$(DEV_PORT) -v $(PWD):/usr/src/app \
		$$(docker build -q . --target build) \
		npm run -- dev --host "0.0.0.0" --port $(DEV_PORT)

## dev/open: open the application
.PHONY: dev/open
dev/open:
	npx playwright open -b $(DEV_BROWSER) $(DEV_URL) --viewport-size "768, 1024"

## production/deploy: deploy the application to production
.PHONY: production/deploy
production/deploy:
	fly deploy

