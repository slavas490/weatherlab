# weatherlab

Weatherlab it's frontend for weather forecast using [openweathermap.org](http://openweathermap.org) api.


# How to use

1) Clone the project:
```bash
$ git clone https://github.com/slavas490/weatherlab.git
```

2) [Install mongoDB](https://docs.mongodb.com/manual/installation/) (if not installed yet)

3) Create new db "weatherlab"

4) Run make:
```bash
$ make
```

Wait little bit for startup you default browser with the project page. If it not happen you can manually go to [http://localhost:8008/](http://localhost:8008/). For run you can use:
```bash
$ ./run
```

You can also install the project for using in the cli:
```bash
$ sudo make install
```

Then you can run it from you command line:
```bash
$ weatherlab
```

For remove run:
```bash
$ sudo make remove
