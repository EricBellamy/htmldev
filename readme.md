A global npm package that builds, hosts & deploys static HTML.

# Commands

```htmldev {PORT}```

Hosts an HTTP server and a build process that watches for changes in the current folder.

&nbsp;

```htmldev init```

Initializes this folder as an HTML repo for automatic deployments on helper code changes.

&nbsp;

```htmldev list```

Lists the active HTML repos.

&nbsp;

```htmldev rm {PATH}```

Removes the specified folder path from the list of active HTML repos.

&nbsp;

```htmldev update```

Downloads my HTML, CSS & JS helper code and deploys all initialized folders.

&nbsp;

```htmldev deploy```

Deploys the current folder

&nbsp;

# Private Libraries
Loaded from the "private/" folder. Structure is "private/{ORGANIZATION}/{PROJECT}/{LIBRARY_FILE}.js".
```javascript
module.exports.htmldev = function(){ console.log("HELLO FROM A PRIVATE LIBRARY") };
```
Will execute any library file in a project folder with an htmldev function.

```javascript
module.exports.scripts = ['private/tired/lib/frontend/xhr.js', ['private/tired/lib/frontend/load.js', 50]];
```
Defines an array of scripts that need to be loaded, minified and prepended to the \<head\> if any of the hooks in the private library are executed meaningfully.

&nbsp;

## Private Library Hooks
```javascript
global.HTMLDEV_PRIVATE.registerHook("css", "start", async function (template, node, contents, FILE_PATH, PARENT_PATH) {});
global.HTMLDEV_PRIVATE.registerHook("css", "finish", async function (template, node, contents, FILE_PATH, PARENT_PATH) {});

global.HTMLDEV_PRIVATE.registerHook("includeAfterValidation", "start", async function (parsed, RELATIVE_FILE_PATH) {});
global.HTMLDEV_PRIVATE.registerHook("includeAfterValidation", "finish", async function (parsed, RELATIVE_FILE_PATH) {});

global.HTMLDEV_PRIVATE.registerHook("process", "start", async function (parsed, RELATIVE_FILE_PATH) {});
global.HTMLDEV_PRIVATE.registerHook("process", "finish", async function (parsed, RELATIVE_FILE_PATH) {});
```
Private libraries have access to these hooks throughout the build process.

&nbsp;

## Private Library Returns
``` javascript
return [true];
```
Count this hook execution

``` javascript
return [true, false];
```
Count this hook execution & skip the current build step.

``` javascript
return [false];
```
Don't count this hook execution