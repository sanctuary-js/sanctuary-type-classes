DOCTEST = node_modules/.bin/doctest --module commonjs --prefix .
ESLINT = node_modules/.bin/eslint --config node_modules/sanctuary-style/eslint-es3.json --env es3
ISTANBUL = node_modules/.bin/istanbul
PREDOCTEST = scripts/predoctest
REMARK = node_modules/.bin/remark --frail --no-stdout
REMEMBER_BOWER = node_modules/.bin/remember-bower
TRANSCRIBE = node_modules/.bin/transcribe
XYZ = node_modules/.bin/xyz --repo git@github.com:sanctuary-js/sanctuary-type-classes.git --script scripts/prepublish
YARN = yarn

TEST = $(shell find test -name '*.js' | sort)


.PHONY: all
all: LICENSE README.md

.PHONY: LICENSE
LICENSE:
	cp -- '$@' '$@.orig'
	sed 's/Copyright (c) .* Sanctuary/Copyright (c) $(shell git log --date=short --pretty=format:%ad | sort -r | head -n 1 | cut -d - -f 1) Sanctuary/' '$@.orig' >'$@'
	rm -- '$@.orig'

README.md: index.js.tmp
	$(TRANSCRIBE) \
	  --heading-level 4 \
	  --url 'https://github.com/sanctuary-js/sanctuary-type-classes/blob/v$(VERSION)/index.js#L{line}' \
	  -- '$<' \
	| LC_ALL=C sed 's/<h4 name="\(.*\)#\(.*\)">\(.*\)\1#\2/<h4 name="\1.prototype.\2">\3\1#\2/' >'$@'

# BSD uses [[:<:]] whereas GNU uses \<. The former produces an "Invalid
# character class name" error on GNU; \< should be used if this occurs.
SED_WORD_START = $(shell printf '' | sed 's,[[:<:]],,' && printf '[[:<:]]' || printf '\<')

.INTERMEDIATE: index.js.tmp
index.js.tmp: index.js
	sed -e '/^[/][/]:/ s,\($(SED_WORD_START)[[:alnum:]]*\),<a href="#\1">\1</a>,g' -e 's,^//:,//.,' '$<' >'$@'


.PHONY: doctest
doctest: index-no-blockquotes.js
ifeq ($(shell node --version | cut -d . -f 1),v6)
	$(DOCTEST) -- $^
else
	@echo '[WARN] Doctests are only run in Node v6.x.x (current version is $(shell node --version))' >&2
endif

.INTERMEDIATE: index-no-blockquotes.js
index-no-blockquotes.js: index.js $(PREDOCTEST)
	$(PREDOCTEST) '$<' >'$@'


.PHONY: lint
lint:
	$(ESLINT) \
	  --global define \
	  --global module \
	  --global require \
	  --global self \
	  --rule 'max-len: [error, {code: 79, ignoreUrls: true, ignorePattern: "^ *//([#:] |  .* :: |[.] > )"}]' \
	  --rule 'spaced-comment: [error, always, {line: {exceptions: ["."], markers: ["#", ".", ":"]}}]' \
	  -- index.js
	$(ESLINT) \
	  --env node \
	  -- $(PREDOCTEST)
	$(ESLINT) \
	  --env node \
	  --global test \
	  --rule 'max-len: [off]' \
	  -- $(TEST)
	$(REMEMBER_BOWER) $(shell pwd)
	rm -f README.md
	VERSION=0.0.0 make README.md
	$(REMARK) \
	  --use remark-lint-no-undefined-references \
	  --use remark-lint-no-unused-definitions \
	  -- README.md
	git checkout README.md


.PHONY: release-major release-minor release-patch
release-major release-minor release-patch:
	@$(XYZ) --increment $(@:release-%=%)


.PHONY: setup
setup:
	$(YARN)

yarn.lock: package.json
	$(YARN)


.PHONY: test
test:
	$(ISTANBUL) cover node_modules/.bin/_mocha -- --timeout 30000 --ui tdd -- test/index.js
	$(ISTANBUL) check-coverage --branches 100
	make doctest
