data = JSON.stringify({ urls: ['https://www.youtube.com/watch?v=4ndKeTleeEk', 'https://www.youtube.com/watch?v=i0purbwzs4U', 'https://www.youtube.com/playlist?list=PLQMVnqe4XbictUtFZK1-gBYvyUzTWJnOk'] });
let result = JSON.parse(data);
let validationReg = /^(http|https)\:\/\/www\.youtube\.com/;
result.urls.forEach(url => {
  if (!validationReg.exec(url)) throw new Error('Invalid Youtube URL!');
  else console.log('valid!')
});
var fs = require('fs');

var output = fs.createWriteStream(__dirname + '/example-output.zip');
var archiver = require('archiver');
var zip = archiver('zip');
zip.append(data, { name: 'urls.json' }).directory('./server/downloader/', './downloader').finalize();


zip.pipe(output);

output.on('close', function () {
  console.log(zip.pointer() + ' total bytes');
  console.log('archiver has been finalized and the output file descriptor has closed.');
});
