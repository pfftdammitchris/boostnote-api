# `boostnote`

> Documentation WIP

## Installation

```bash
npm install boostnote
```

## Usage

> ES5

```js
const Boostnote = require('boostnote')

const token = 'abc....lzx'
const boostnote = new Boostnote(token)
```

> ES6

```js
import Boostnote from 'boostnote'

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

#### `createDocument(opts)`

```js
boostnote
  .createDocument({
    title: 'My title',
    content: '# Heading',
    tags: ['react', 'javascript'],
  })
  .then((doc) => console.log(doc))
  .catch((err) => console.error(err))
```

#### `updateDocument(opts)`

```js
boostnote
  .updateDocument({
    id: '02ba-faoks-01b8....28ext',
    title: 'My new title',
    content: '# Heading',
    tags: ['react', 'javascript'],
  })
  .then((doc) => console.log(doc))
  .catch((err) => console.error(err))
```

#### `removeDocument(id)`

```js
boostnote
  .removeDocument('02ba-faoks-01b8....28ext')
  .catch((err) => console.error(err))
```

#### `getFolder(id)`

```js
boostnote
  .getFolder('02ba-faoks-01b8....28ext')
  .then((folder) => console.log(folder))
  .catch((err) => console.error(err))
```

#### `getFolders(opts)`

```js
boostnote
  .getFolders({
    name: 'mainFolder',
    workspaceId: '01d9-021e3...',
    orderBy: 'createdAt',
  })
  .then((folders) => console.log(folders))
  .catch((err) => console.error(err))
```

#### `createFolder(opts)`

```js
boostnote
  .createFolder({
    name: 'My new folder',
    emoji?: '',
    workspaceId: '01d9-021e3...',
    parentFolderId: 'avkoo-021e3...',
    orderBy: 'createdAt',
  })
  .then((folder) => console.log(folder))
  .catch((err) => console.error(err))
```

#### `removeFolder(id, opts)`

```js
boostnote
  .removeFolder('01d9-021e3...', { force: false })
  .catch((err) => console.error(err))
```
