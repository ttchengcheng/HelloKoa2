# the file input problem

* the default looking of file input is ugly

  use a file input css (e.g. the one in bulma)

* the `files` property of file input can't be edited(readonly)

  use XMLHTTPRequest + FormData to replace the commit button

  ```js
  var formData = new FormData();

  formData.append("username", "Groucho");
  formData.append("accountnum", 123456); // 数字 123456 会被立即转换成字符串 "123456"

  // HTML 文件类型input，由用户选择
  formData.append("userfile", fileInputElement.files[0]);

  // JavaScript file-like 对象
  var content = '<a id="a"><b id="b">hey!</b></a>'; // 新文件的正文...
  var blob = new Blob([content], { type: "text/xml"});

  formData.append("webmasterfile", blob);

  var request = new XMLHttpRequest();
  request.open("POST", "http://foo.com/submitform.php");
  request.send(formData);
  ```

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

