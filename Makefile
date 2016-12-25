DOCTEST = node_modules/.bin/doctest --module commonjs --prefix .
ESLINT = node_modules/.bin/eslint --config node_modules/sanctuary-style/eslint-es3.json --env es3
ISTANBUL = node_modules/.bin/istanbul
NPM = npm
PREDOCTEST = scripts/predoctest
REMEMBER_BOWER = node_modules/.bin/remember-bower
TRANSCRIBE = node_modules/.bin/transcribe
XYZ = node_modules/.bin/xyz --repo git@github.com:sanctuary-js/sanctuary-type-classes.git --script scripts/prepublish

TEST = $(shell find test -name '*.js' | sort)


.PHONY: all
all: LICENSE README.md

.PHONY: LICENSE
LICENSE:
	cp -- '$@' '$@.orig'
	sed 's/Copyright (c) .* Sanctuary/Copyright (c) $(shell git log --date=format:%Y --pretty=format:%ad | sort -r | head -n 1) Sanctuary/' '$@.orig' >'$@'
	rm -- '$@.orig'

README.md: index.js.tmp
	$(TRANSCRIBE) \
	  --heading-level 4 \
	  --url 'https://github.com/sanctuary-js/sanctuary-type-classes/blob/v$(VERSION)/index.js#L{line}' \
	  -- '$<' \
	| LC_ALL=C sed 's/<h4 name="\(.*\)#\(.*\)">\(.*\)\1#\2/<h4 name="\1.prototype.\2">\3\1#\2/' >'$@'

.INTERMEDIATE: index.js.tmp
index.js.tmp: index.js
	sed -e '/^[/][/]:/ s,\([[:<:]][[:alnum:]]*\),<a href="#\1">\1</a>,g' -e 's,^//:,//.,' '$<' >'$@'


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
	  --rule 'max-len: [error, {code: 79, ignoreUrls: true, ignorePattern: "^ *//(# |  .* :: |[.] > )"}]' \
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
	@echo 'Checking for missing link definitions...'
	grep -o '\[[^]]*\]\[[^]]*\]' index.js \
	| sort -u \
	| sed -e 's:\[\(.*\)\]\[\]:\1:' \
	      -e 's:\[.*\]\[\(.*\)\]:\1:' \
	      -e '/0-9/d' \
	| xargs -I '{}' sh -c "grep '^//[.] \[{}\]: ' index.js"


.PHONY: release-major release-minor release-patch
release-major release-minor release-patch:
	@$(XYZ) --increment $(@:release-%=%)


.PHONY: setup
setup:
	$(NPM) install


.PHONY: test
test:
	$(ISTANBUL) cover node_modules/.bin/_mocha -- --timeout 30000 --ui tdd -- test/index.js
	$(ISTANBUL) check-coverage --branches 100
	make doctest
