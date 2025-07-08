DEV_PORT ?= 3000

dev:
	docker run --rm -it -p $(DEV_PORT):$(DEV_PORT) -v $(PWD):/usr/src/app \
		$$(docker build -q . --target build) \
		npm run -- dev --host "0.0.0.0" --port $(DEV_PORT)

dev/open:
	open -u http://localhost:$(DEV_PORT) 2>/dev/null

production/deploy:
	fly deploy
