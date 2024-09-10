// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const typescriptTransform = require('i18next-scanner-typescript')
// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const fs = require('fs')

const STRING_NOT_TRANSLATED = '__STRING_NOT_TRANSLATED__'
const DEFAULT_NS = 'common'

// eslint-disable-next-line no-undef
module.exports = {
  input: [
    'src/**/*.{js,jsx,ts,tsx}',
    // Use ! to filter out files or directories
    '!src/**/*.spec.{js,jsx}',
    '!src/utils/i18n/**',
    '!**/node_modules/**'
  ],
  output: './',
  options: {
    debug: true,
    func: {
      extensions: ['.js', '.jsx'],
      list: ['i18next.t', 'i18n.t', 't']
    },
    trans: {
      extensions: ['.js', '.jsx'],
      component: 'Trans'
    },
    lngs: ['en', 'vi'],
    ns: ['common', 'breadcrumbs', 'city', 'review', 'amenity'],
    defaultLng: 'en',
    defaultNs: DEFAULT_NS,
    defaultValue: STRING_NOT_TRANSLATED,
    resource: {
      loadPath: 'src/utils/i18n/locales/{{lng}}/{{ns}}.json',
      savePath: 'src/utils/i18n/locales/{{lng}}/{{ns}}.json',
      jsonIndent: 2,
      lineEnding: '\n'
    },
    nsSeparator: ':',
    keySeparator: '.',
    interpolation: {
      prefix: '{{',
      suffix: '}}'
    },
    metadata: {},
    allowDynamicKeys: false
  },
  transform: typescriptTransform(
    {
      extensions: ['.ts', '.tsx'],
      tsOptions: {
        target: 'ES2020'
      }
    },
    function customTransform(outputText, file, enc, done) {
      'use strict'
      const parser = this.parser
      const content = fs.readFileSync(file.path, enc)

      parser.parseFuncFromString(content, { list: ['t'] }, function (key, options) {
        let ns = DEFAULT_NS
        let newKey = key

        // Check if the key contains a namespace
        if (key.includes(':')) {
          ;[ns, newKey] = key.split(':')
        }

        // Check if there's a namespace option in the t function call
        const nsMatch = content.match(new RegExp(`t\\(['"]${key}['"]\\s*,\\s*\\{[^}]*ns:\\s*['"]([^'"]+)['"]`))
        if (nsMatch) {
          ns = nsMatch[1]
        }

        // If no explicit namespace is found, try to infer it from the useTranslation call
        if (ns === DEFAULT_NS) {
          const useTranslationMatch = content.match(/useTranslation\(['"](.+?)['"]\)/)
          if (useTranslationMatch) {
            ns = useTranslationMatch[1]
          }
        }

        parser.set(
          newKey,
          Object.assign({}, options, {
            ns: ns,
            nsSeparator: ':',
            keySeparator: '.'
          })
        )
      })

      done()
    }
  )
}
