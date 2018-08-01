
import fs from 'fs';
import path from 'path';

import _ from 'lodash';
import datefns from 'date-fns';
import hljs from 'highlight.js';
import frontmatter from 'front-matter';
import MarkdownIt from 'markdown-it';

import {
  stripFileDate,
  getPathSlug,
  convertToAssets,
  interpolatePath,
  transformer,
} from './utils';

const ROUTE_BLOG = '/blog';

const md = new MarkdownIt({
  html: true,
  linkify: false,
  highlight(content, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${
          hljs.highlight(lang, content, true).value
        }</code></pre>`;
      } catch (err) {
        throw err;
      }
    }

    return md.utils.escapeHtml(content);
  },
});

export const getRenderedMarkdown = () => {
  return (file) => {
    return _.merge({}, file, {
      contents: md.render(file.contents),
    });
  };
};

/**
 * Adds the parsed front matter to the file object
 */
export const getFrontMatter =
  () =>
    (file) => {
      const data = frontmatter(file.contents);

      if (!frontmatter.test(file.contents)) {
        throw new Error(`Could not find frontmatter in "${file.originalPath}"`);
      }

      return _.merge({}, file, {
        frontmatter: data.attributes,
        contents: data.body,
      });
    };

/**
 * Adds the excerpt of a post to the file meta
 *
 * Is a "plugin" to be utilized by the parseMarkdown function.
 */
export const getPostExcerpt =
  ({ renderExcerpt=true, defaultSeparator='<!-- endexcerpt -->' }={}) =>
    (file) => {
    let excerpt = null;
    let excerptIndex = null;
    let excerptLoc = null;

    if (!_.isObject(file.frontmatter)) {
      throw new Error(`frontmatter does not exist on file ${file.path}`);
    }

    if (file.frontmatter.excerpt) {
      // Use a custom defined excerpt from the frontmatter
      excerpt = String(file.frontmatter.excerpt);
    } else {
      const separator =
        [frontmatter.excerpt_separator, frontmatter.excerptSeparator, defaultSeparator]
          .find(item => item != null);

      if (separator != null) {
        excerptIndex = file.contents.indexOf(separator);

        if (excerptIndex > -1) {
          excerpt = file.contents.substring(0, excerptIndex);
          excerptLoc = {
            start: 0,
            end: excerptIndex,
          };
        }
      }
    }

    return _.merge({}, file, {
      contents: file.contents,
      meta: {
        excerpt: {
          content: renderExcerpt && excerpt != null ? md.render(excerpt) : excerpt,
          loc: excerptLoc,
        },
      },
    });
  };

/**
 * Convers a list of files to JSON and returns an asset mapping.
 *
 * @param  {Array<File>} files
 * @param  {Number} options.indent - The indent for the json
 * @param  {Number} options.output - Interpolation name e.g. '[name]-[hash:8].json'
 * @return {Object.<string>}
 */
export const createPostsJsonAssets = (files, options={}) => {
  const { blogRoute=ROUTE_BLOG } = options;

  const posts =
    files
      .sort((a, b) =>
        datefns.compareAsc(a.frontmatter.created_at, b.frontmatter.created_at)
      )
      .reduce((assets, file, index, files) => {
        const slug = getPathSlug(file.path);

        const nextFile =
          (index <= files.length - 1)
            ? files[index + 1]
            : null;

        const previousFile = index === 0 ? null : files[index - 1];

        const next =
          nextFile == null
            ? null
            : {
              url: path.posix.normalize(`${blogRoute}/${getPathSlug(nextFile.path)}`),
              ...nextFile.frontmatter,
            };

        const previous =
          previousFile == null
            ? null
            : {
              url: path.posix.normalize(`${blogRoute}/${getPathSlug(previousFile.path)}`),
              ...previousFile.frontmatter,
            };

        assets[file.path] =
          JSON.stringify({
              excerpt: file.meta.excerpt,
              ...file.frontmatter,
              humanized: file.humanized,
              url: path.posix.normalize(`${blogRoute}/${slug}`),
              slug,
              next,
              previous,
              contents: file.contents,
            },
            null,
            options.indent || 0
          );

          return assets;
        }, {});

  return convertToAssets(posts, {
    output: options.output,
  });
};

/**
 * Converts a list of files to a list of meta of each file and returns
 * an asset mapping containg the meta file.
 *
 * @type {Object.<Array<Object>>}
 */
export const createPostsMetaAssets =
  (files, { output='postmeta.json', indent=0, blogRoute=ROUTE_BLOG }={}) => {
    if (typeof blogRoute !== 'string' || blogRoute[0] !== '/') {
      console.log(`param blogRoute should be a string prefixed with /, got ${blogRoute}`);
    }

    const meta = files.map(file => {
      return {
        excerpt: file.meta.excerpt,
        ...file.frontmatter,
        humanized: file.humanized,
        url: path.posix.normalize(`${blogRoute}/${getPathSlug(file.path)}`),
        slug: getPathSlug(file.path),
      };
    }).sort((a, b) => datefns.compareDesc(a.created_at, b.created_at));

    return convertToAssets({
      'postsmeta.json': JSON.stringify(meta, null, indent),
    }, {
      output: output,
    });
  };

export const getPostsJson = async (files, { indent=2 }={}) => {
  const postsFiles = await transformer(files, {
    transforms: [
      getFrontMatter(),
      getRenderedMarkdown(),
      getPostExcerpt(),
      (file) => _.merge({}, file, {
        path: stripFileDate(file.path),
      }),
      (file) => _.merge({}, file, {
        humanized: {
          created_at: datefns.format(file.frontmatter.created_at, 'MMMM, d y'),
        },
      }),
    ],
  });

  const posts = createPostsJsonAssets(postsFiles, {
    output: 'api/posts/[name].json',
    indent,
  });

  // This is so that we can have a preview listing of posts on the /blog page
  const postsMeta = createPostsMetaAssets(postsFiles, {
    output: 'api/postmeta.json',
    indent,
  });

  return { postsMeta, posts };
};
