
build:
	@docker build -t ghcr.io/redeye-framework/redeye:latest .

run:
	@docker-compose up -d

test:
	@python tests/test_redeye.py


