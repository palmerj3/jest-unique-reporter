# jest-unique-reporter
A jest reporter that enforces unique test names.
If duplicate test names are found then the test run will fail and tell you where the duplicates are.

## Installation

#### yarn
```shell
yarn add --dev jest-unique-reporter
```

#### npm
```shell
npm install --dev jest-unique-reporter
```

## Usage

#### Add to your jest configuration
```javascript
{
  "reporters": [
    "<rootDir>/node_modules/jest-unique-reporter"
  ]
}
```

## Configuration
jest-unique-reporter offers two configuration options.

|field|default|description|
|---|---|---|
|global|default=false|if true then test names must be unique across all tests in the project. If false then test names must be unique per file.|
|useFullName|default=false|if true then describe blocks are included in the test names for comparison. If false then just "it" blocks are used for test names.|

#### Example usage of configuration options
```javascript
{
  "reporters": [
    ["<rootDir>/node_modules/jest-unique-reporter", {"global": false, "useFullName": false}]
  ]
}
```
