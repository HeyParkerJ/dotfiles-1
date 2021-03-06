// This takes the custom injections (css and js) I have and writes them to
// bootstrap.js inside of the Injector.safariextension repository. The contents
// of the file implicitly is written to the localstorage at startup time. I've
// added a script tag that imports the file before storage.js runs.

// This script is mostly complete. Last time I used it, I needed to save an
// injection to get injections actually working, even though there were no
// changes. bootstrap.js might need to get imported last and then run some
// function that applies the injections.
const fs = require('fs')
const path = require('path')
const loader = require('./load-injector-data.js')
const preCssIncludes = require('./apply-global-pre-css.js')

/**
 * The old injector style uses wildcards (*), whereas the new code-injector uses
 * regex. We need to convert uses of . and * to an escaped . and * needs to
 * become ".*". There may be other regex-isms to address. Forward slash (/)
 * should be okay, since these are fed in via new Regex, and the / is for
 * literals.
 */
const wildcardToRegex = (s) => {
  return s.replace(/\./g, '\\.').replace(/\*/g, '.*').replace(/\?/g, '.?')
}

const rules = loader().map(m => {
  return [
    {
      _version: '2',
      // The code is read as a string and presumably processed or simply used
      // later.
      code: {
        css: m.styles,
        js: m.script,
      },
      // type: 'css',
      enabled: true,
      options: {
        enabled: true,
        onLoad: m.name == 'preload',
        topFrameOnly: false,
      },
      selector: wildcardToRegex(
        (m.name == 'preload' ? preCssIncludes() : m.includes).join('|'),
      ),
      // path: null,
      // Local files are read from disk, but we want to be able to process them
      // first. So set this to false and the system will accept the rule's
      // script or css as-is.
      local: false,
      // path: path.resolve(`./custom-css/${m.name}.css`),
      // local: true,
      // local: true,
      /**
       * We want CSS to be loaded afterwards, otherwise the event doesn't fire
       * for simple navigation actions and then requires a page refresh. Waiting
       * for the assets to load leaves an annoying white flash though. To remedy
       * this we have a preload CSS file that sets the background to something
       * tolerable right from the start.
       */
      onLoad: m.name == 'preload',
      /**
       * Make this rule apply to any frame matching the URL, or just that a rule
       * also is injected into the frame regardless of the frame's URL?
       */
      topFrameOnly: false,
    },
    // {
    //   // The code is read as a string and presumably processed or simply used
    //   // later.
    //   code: m.script,
    //   type: 'js',
    //   enabled: true,
    //   options: {
    //     enabled: true,
    //     onLoad: m.name == 'preload',
    //     topFrameOnly: false,
    //   },
    //   selector: wildcardToRegex(m.includes.join('|')),
    //   // path: null,
    //   // Local files are read from disk, but we want to be able to process them
    //   // first. So set this to false and the system will accept the rule's
    //   // script or css as-is.
    //   local: false,
    //   // path: path.resolve(`./custom-css/${m.name}.js`),
    //   // local: true,
    //   onLoad: true,
    //   /**
    //    * Make this rule apply to any frame matching the URL, or just that a rule
    //    * also is injected into the frame regardless of the frame's URL?
    //    */
    //   topFrameOnly: false,
    // },
  ]
})
  // Flattens the list.
  .reduce((xs, ys) => xs.concat(ys), [])

// This is a failed approach at writing to one of the files directly. However
// the system loads from the local store anyways.
//
// fs.readFile(
//   path.resolve('../code-injector/dist/script/background.js'),
//   'utf8',
//   (error, data) => {
//     if(error) {
//       console.error('Error reading file', error)
//       process.exit(1)
//     } else {
//       const modified = data.replace(
//         'var rules = [];',
//         `var rules = ${JSON.stringify(rules)};`,
//       )
//       fs.writeFileSync(
//         path.resolve('../code-injector/dist/script/background.js'),
//         modified,
//       )
//       console.log('Rewrote background.js')
//     }
//   })

const code = `\
browser.storage.local.set({rules: ${JSON.stringify(rules)}})
console.log('Loaded rules! v2')
`

fs.writeFileSync(
  path.resolve('../code-injector/script/bootstrap.js'),
  code,
)

// As part of this, write out a file we can import in case we need to bootstrap
// the system.

// Is this even used? NOPE!

const exportableRules = loader().map(m => {
  return [
    {
      _version: '2',
      description: 'Generated by bootstrap-code-injector.js',
      enabled: true,
      onLoad: false,
      topFrameOnly: false,
      // Duplicated because v2 says so, but I don't think it's implemented yet.
      options: {
        enabled: true,
        onLoad: false,
        topFrameOnly: false,
      },
      selector: wildcardToRegex(m.includes.join('|')),
      code: {
        js: '',
        css: '',
        html: '',
        files: [
          {
            type: 'local',
            ext: 'css',
            path: path.resolve(`./custom-css/${m.name}.css`),
          },
          {
            type: 'local',
            ext: 'js',
            path: path.resolve(`./custom-css/${m.name}.js`),
          },

        ],
      },
    },
  ]
})
fs.writeFileSync(
  path.resolve('./code-injector-rules.json'),
  JSON.stringify(exportableRules),
)
