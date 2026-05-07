.PHONY: help install-hooks dev build test test-integration smoke lint fmt pages-preview release clean hooks-pre-commit hooks-commit-msg hooks-pre-push data

help:
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "%-20s %s\n", $$1, $$2}'

install-hooks: ## Wire local git hooks.
	git config core.hooksPath .githooks
	chmod +x .githooks/*

dev: ## Run the Vite development server.
	npm run dev

build: ## Build the GitHub Pages site into docs/.
	npm run build

data: ## Mode A has no data pipeline.
	@echo "No static data pipeline is needed for Mode A."

test: ## Run unit tests with coverage.
	npm run test

test-integration: ## Run browser e2e tests.
	npm run test:e2e

smoke: ## Build, serve docs/, and run Playwright smoke checks.
	npm run smoke

lint: ## Run all linters and type checks.
	npm run lint
	npm run typecheck
	npm run fmt:check

fmt: ## Autoformat source files.
	npm run fmt

pages-preview: ## Serve docs/ locally as GitHub Pages would.
	npm run pages-preview

hooks-pre-commit: ## Run the pre-commit hook manually.
	npm run hooks:pre-commit

hooks-commit-msg: ## Run the commit-msg hook manually.
	npm run hooks:commit-msg

hooks-pre-push: ## Run the pre-push hook manually.
	npm run hooks:pre-push

release: ## Tag a local semver release after checks pass.
	@if [ -z "$(VERSION)" ]; then echo "Usage: make release VERSION=v0.1.0"; exit 1; fi
	make lint
	make test
	make smoke
	git tag -a "$(VERSION)" -m "$(VERSION)"

clean: ## Remove generated local artifacts.
	rm -rf coverage dist node_modules/.vite
