import * as http from 'http';

export function getWords(minLength: number,
  maxLength?: number, isCommon?: boolean,
  charConstraints?: {char: string, position: number}[]): Promise<string[]> {
    return new Promise((resolve, reject) => {
        let url = 'http://localhost:3000/crossword/lexic/words?minLength=' + minLength;
        if (Number.isInteger(maxLength)) {
            url += '&maxLength' + maxLength;
        }
        if (isCommon !== undefined) {
            url += '&isCommon=' + Boolean(isCommon);
        }
        if (Array.isArray(charConstraints)) {
            url += '&charConstraints=' + JSON.stringify(charConstraints);
        }
        http.request(url, (response) => {
            let data = '';
            response.on('data', (chunck) => data += chunck);
            response.on('end', () => {
                resolve(JSON.parse(data));
            });
            response.on('error', reject);
        });
    });
}

var http = require('http');
var serveur =
http.createServer(function(req,res){
res.writeHead(200, { 'Content-Type': 'text/plain' });
res.end();

})
serveur.listen(3000);

console.log('Serveur démarré sur localhost:3000');

getWords(3, 5, false).then((words: string[]) => {
  const randomWord = words[Math.round(Math.random() * words.length)];
  console.log(randomWord);
});
