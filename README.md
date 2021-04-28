# `boostnote-api`

## Installation

```bash
npm install boostnote-api
```

## Usage

> ES5

```js
const Boostnote = require('boostnote-api')

const token = 'abc....lzx'
const boostnote = new Boostnote(token)
```

> ES6

```js
import Boostnote from 'boostnote-api'

const token = 'abc....lzx'
const boostnote = new Boostnote(token)
```

### Retrieving documents

#### `getDocument(id: string)`

```js
const documentId = 'efcfe0be-061a-4c7a-10wm-efddc4607vma'
boostnote
  .getDocument(documentId)
  .then((doc) => console.log(doc))
  .catch((err) => console.error(err))
```

#### `getDocuments()`

```js
boostnote
  .getDocuments()
  .then((docs) => console.log(docs))
  .catch((err) => console.error(err))
```

> Documentation WIP
