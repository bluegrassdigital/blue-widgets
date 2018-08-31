const BABEL_ENV = process.env.BABEL_ENV
const building = BABEL_ENV != undefined && BABEL_ENV !== 'cjs'

const plugins = [
  "@babel/plugin-proposal-export-default-from",
  "@babel/plugin-proposal-logical-assignment-operators",
  ["@babel/plugin-proposal-optional-chaining", { "loose": false }],
  ["@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal" }],
  ["@babel/plugin-proposal-nullish-coalescing-operator", { "loose": false }],
  "@babel/plugin-proposal-do-expressions",
]

if (BABEL_ENV === 'umd') {
  plugins.push('@babel/plugin-external-helpers')
}

module.exports = () => ({
  presets: [
    [ '@babel/preset-env', {
      loose: true,
      modules: building ? false : 'commonjs'
    } ],
  ],
  plugins: plugins
});
