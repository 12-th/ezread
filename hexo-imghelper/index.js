const path = require('path');
const fs = require('hexo-fs');

hexo.extend.processor.register('posts/*path', function(file) {
  if (file.type == 'delete') return file;
  if (file.type == 'skip') return file;
  if (path.extname(file.params.path) == '.md') return file;
  // console.log('***************');
  // console.log(file.params.path);
  // console.log(file.source);
  let from = path.normalize(file.source);
  let to = from;
  let img = path.resolve(
      to.replace(path.normalize(file.params.path), '') + '..' + path.sep +
      '..' + path.sep + 'public' + path.sep + 'img');
  to = img + path.sep + path.normalize(file.params.path);
  fs.copyFile(from, to);
  return file;
});

hexo.extend.filter.register('before_post_render', function(data) {
  let pathArr = path.normalize(data.source).split(path.sep);
  pathArr.shift();
  pathArr.pop();
  let dir = path.sep + pathArr.join(path.sep) + path.sep;
  let pattern = /!\[(.*?)\]\((.*?)\)/g;
  data.content = data.content.replace(pattern, function(match, alt, src) {
    // console.log('#####################');
    // console.log('alt: ' + alt + ' src: ' + src);
    let newSrc = path.sep + 'img' + dir + src;
    newSrc = newSrc.split(path.sep).join('\/');
    // console.log(newSrc);
    return `![${alt}](${newSrc})`;
  });
  return data;
}, 9);