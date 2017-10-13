# TODO:

* styling the file input control

# Mongo DB

## install mongo db

```bash
brew install mongodb
```

## start mongo db service

```bash
# start service
brew services start mongodb

# stop service
brew services stop mongodb
```

## interactive command

```bash
# help
help

# list all db
show dbs

# list all documents in current db
show collections

# remove document logs
db.logs.drop()

# show all records in document logs
db.logs.find()
```

