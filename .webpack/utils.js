import path from 'path';

import loaderUtils from 'loader-utils';
import _ from 'lodash';

export const when = (bool, a, b) => bool ? a : b;

/**
 * Strip the date that jekyll makes you add in
 */
export const stripFileDate = (pathname) => pathname.replace(/\d{4}-\d{2}-\d{2}-/, '');

/**
 * Gets a slug from a file path, which is basically the basename
 * without the extension.
 */
export const getPathSlug =
  (filename) =>
    stripFileDate(path.basename(filename, path.extname(filename)))
      .replace(/\..+$/, '')

/**
 * Interpolates the exact same way extract-text-plugin does.
 */
export const interpolatePath = ({ resourcePath, output, contents, context }) => {
  const loaderContext = {
    resourcePath,
  };

  const options = {
    content: contents.toString('utf8'),
    context,
  };

  const filename = loaderUtils.interpolateName(loaderContext, output, options);

  return filename;
};


/**
 * Converts an array of mapping of interpolation filenames (e.g. '[name]-[hash:8].png')
 * to file contents.
 *
 * @return {Object<string>}
 */
export const convertToAssets =
  (assets, options) =>
    Object.entries(assets)
      .reduce((newFiles, [originalFilename, contents]) => {
      const filename = interpolatePath({
        resourcePath: originalFilename,
        contents: contents,
        output: options.output,
        context: options.context,
      });

      newFiles[filename] = contents;

      return newFiles;
    }, {});

export const validateBaseFile = (value) => {
  let message = null;

  if (!_.isObject(value)) {
    message = `transform did not return an object, got ${inspect(value)}`;
  } else if (!_.isString(value.contents) && !Buffer.isBuffer(value.contents)) {
    message = `transform returned object without contents as string or buffer, got ${inspect(value.contents)}`;
  } else if (!_.isObject(value.meta)) {
    message = `transform did not return an object with meta , got ${inspect(value.meta)}`;
  } else if (!_.isString(value.path)) {
    message = `transform did not return an object with a path, got ${inspect(value.path)}`;
  }

  return { message };
};

/**
 * Runs transforms (really just a series of functions) on an initial value.
 *
 * @throws {Error} If the transform function doesn't return an object
 *
 * @return Promise<Object>
 */
export const runTransforms =
  async (initial, transforms, options={ name: 'TransformRunner' }) => {
    let data = await initial;

    for (const transform of transforms) {
      const arg = await data;
      const value = await transform(arg);
      const { message } = validateBaseFile(value);

      if (message != null) {
        throw new Error(`${options.name}: ${message}`);
      }

      data = value;
    }

    return data;
  };

/**
 * Calls a series of functions
 *
 * @throws {Error} If the yaml frontmatter does not exist
 *
 * type files = { [string]: Buffer };
 * type transforms = function[];
 *
 * type return = {
 *   path: string,
 *   contents: string,
 *   meta: {},
 *   attributes: {},
 * };
 */
export const transformer = async (files, { transforms=[] }={}) => {
  const newFiles = Object.entries(files)
    .map(async ([filename, buffer]) => {
      const contents = buffer.toString('utf8');

      let file = {
        // originalPath and source should not be modified
        originalPath: filename,
        source: contents,

        // Any one of these properties below may be modified by a transformer
        path: filename,
        meta: {},
        contents,
      };

      const defaultOpts = {
        name: 'Transformer',
      };

      file = await runTransforms(file, transforms, defaultOpts);

      return file;
    });

  return Promise.all(newFiles);
};
