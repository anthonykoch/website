import path from 'path';

import validate from '@webpack-contrib/schema-utils';
import loaderUtils from 'loader-utils';
import RawSource from 'webpack-sources/lib/RawSource';

const PLUGIN_NAME = 'TransformFilePlugin';

/*
  type Assets = {
    [string]: Buffer|string,
  };

  new TransformFilePlugin({
    // Allows matching which files are passed to transform
    include: RegExp,

    // Whether or not to delete the original files
    deleteOriginalAssets: boolean,

    // Should return an object that can be converted to json. The object will be
    // stringified and written to a file.
    transform({ [string]: { content: Buffer|string, path: string } }): Promise<Assets>|Assets

  }),
*/

const error = (message) => {
  throw new Error(`${PLUGIN_NAME}: ${message}`);
}

const schema = {
  type: 'object',
  required: ['transform', 'include'],
  // additionalProperties: true,
  properties: {
    include: {
      instanceOf: 'RegExp',
    },
    deleteOriginalAssets: {
      type: 'boolean',
    },
    transform: {
      instanceOf: 'Function',
    },
  },
};

const name = 'TransformFilePlugin';

export default class TransformFilePlugin {
  constructor(options) {
    this.options = options;

    if (typeof options == null || typeof options !== 'object') {
      error(`options should be an object, got ${options}`);
    }

    validate({ name, schema, target: options });
  }

  apply(compiler) {
    const emit = (compilation, callback) => {
      const matches = {};

      for (const filename in compilation.assets) {
        if (this.options.include.test(filename)) {
          matches[filename] = compilation.assets[filename].source();
        }
      }

      Promise.resolve(this.options.transform(Object.assign({}, matches)))
        .then((files) => {
          if (typeof files == null || typeof files !== 'object') {
            error(`files should be an object, got ${files}`);
          }

          for (const filename in files) {
            // console.log(files[filename])
            if (!Buffer.isBuffer(files[filename]) && typeof files[filename] !== 'string') {
              error(`file "${filename}" does not map to a Buffer or string, got ${files[filename]}`);
            }
          }

          if (this.options.deleteOriginalAssets) {
            for (const filename in matches) {
              // console.log('deleting', filename)
              delete compilation.assets[filename];
            }
          }

          const newFiles =
            Object.keys(files).reduce((entries, filename) => {
              entries[filename] = new RawSource(files[filename]);

              return entries;
            }, {});

          Object.assign(compilation.assets, newFiles);

          console.log('assets:', Object.keys(compilation.assets))

          callback();
        });
    };

    if (compiler.hooks) {
      // Webpack 4
      const plugin = { name: 'CompressionPlugin' };
      compiler.hooks.emit.tapAsync(plugin, emit);
    } else {
      compiler.plugin('emit', emit);
    }
  }
}
