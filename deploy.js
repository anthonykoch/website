const ghpages = require('gh-pages');

ghpages.publish('dist', {
  dotfiles: true,
  branch: 'master',
}, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Deployed site to master!')
  }
});

