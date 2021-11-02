const mergeStyles = require('../05-merge-styles/mergeStyles')
const copyDirectory = require('../04-copy-directory/copyDirectory')
const tagMergeHtml = require('../06-build-page/tagMergeHtml')

tagMergeHtml(__dirname, 'template.html', 'components', 'project-dist')
mergeStyles(__dirname, 'styles', 'project-dist', 'style.css')
copyDirectory(__dirname, 'assets', 'project-dist/assets')
