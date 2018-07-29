const ghpages = require('gh-pages');

ghpages.publish('dist', {
  dotfiles: true,
  branch: 'master',
  repo: 'git@github.com:anthonykoch/anthonykoch.github.io.git',
}, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Deployed site to master!')
  }
});

