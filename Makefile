cerr="\033[0;31m"
cdone="\033[0;32m"
ccmd="\033[0;34m"
cnc="\033[0m"


make:
	@echo $(ccmd)Installing server node_modules$(cnc)
	@npm install
	@echo '\t'$(cdone)Done$(cnc)

	@echo $(ccmd)Installing client node_modules$(cnc)
	@(cd view && npm install)
	@echo '\t'$(cdone)Done$(cnc)

	@echo $(ccmd)Importing db to weatherlab table$(cnc)
	@mongorestore -d weatherlab db_dump/weatherlab/ --quiet
	@echo '\t'$(cdone)Done$(cnc)

	@chmod +x run

	@./run

	@printf '\n\nThanks for using!\n'

install:
	mkdir /usr/local/weatherlab
	cp -r . /usr/local/weatherlab/
	cd /usr/local/weatherlab/
	# npm install
	# (cd view && npm install)
	# mongorestore -d weatherlab db_dump/weatherlab/ --quiet
	chmod +x .cli
	ln .cli /bin/weatherlab
	# chown -R $(USER) /usr/local/weatherlab
	@echo $(cdone)Done$(cnc)

remove:
	unlink /bin/weatherlab
	rm -fr /usr/local/weatherlab
	@echo $(cdone)Done$(cnc)