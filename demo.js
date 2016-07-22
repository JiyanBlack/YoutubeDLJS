data = JSON.stringify({ urls: ['https://www.youtube.com/watch?v=4ndKeTleeEk', 'https://www.youtube.com/watch?v=i0purbwzs4U', 'https://www.youtube.com/playlist?list=PLQMVnqe4XbictUtFZK1-gBYvyUzTWJnOk'] });
let result = JSON.parse(data).urls;
let validationReg = /^(http|https)\:\/\/www\.youtube\.com/;
result.forEach(url => {
  if (!validationReg.exec(url)) throw new Error('Invalid Youtube URL!');
});
