const express = require('express');
const http = require('http');
const ssh2 = require('ssh2').Client;
const app = express();



app.get('/', async (req, res) => {
    const userId = req.query.user;
    const validade = await verificar_data(userId);
    res.json(validade);
});
  
app.listen(8000, () => {
    console.log('Servidor rodando na porta 8000');
});
  

  async function verificar_data(userId){
        const simultaneas = await conexoes_simultaneas(userId);
        const expira = await login_confirmado(userId);
        //transforma data em padrão 11/11/11
        let dataString = expira.toString();
        let date = new Date(dataString).toLocaleDateString();
        //calcula a diferença de dias entre o dia de hoje e a data do login
        const date1 = new Date(date);
        const date2 = new Date();
        const diffTime = Math.abs(date2 - date1);
        const diferencaEmDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const nova_validade = diferencaEmDias;
        //Pega a data sem as horas e coloca a ordem no padrão brasileiro
        const validade = new Date();
        validade.setDate(validade.getDate()+nova_validade);
        const formato = { day: 'numeric', month: 'numeric', year: 'numeric'};
        const formatado = validade.toLocaleDateString('en-GB', formato);
        
        const array = [{login:userId,dias_restantes:diferencaEmDias, validade:formatado, acesso:"5",online: simultaneas }];
        return array;

  }

  function conexoes_simultaneas(data) {
    return new Promise((resolve, reject) => {
      const conn = new ssh2();
      conn.on('ready', function () {
        conn.exec(`ps -u ${data} | grep -c sshd`, function (err, stream) {
          if (err) reject(err);
          stream.on('close', function (code, signal) {
            conn.end();
          }).on('data', function (data) {
            let result = data.toString();
            let split = result.replace("\n","");
            resolve(split);
          }).stderr.on('data', function (data) {
            reject(data);
          });
        });
      }).connect({
        host: 'localhost',
        port: 22,
        username: 'root',
        password: 'meupau'
      });
    });
  }


function login_confirmado(data) {
    return new Promise((resolve, reject) => {
  const conn = new ssh2();
  conn.on('ready', function() {
    conn.exec("chage -l "+data+" | grep -E 'Account expires' | cut -d ' ' -f3-", function(err, stream) {
      if (err) throw err;
      stream.on('close', function(code, signal) {
        conn.end();
      }).on('data', function(data) {
        let result = data.toString();
        resolve(result);
      }).stderr.on('data', function(data) {

      });
    });
  }).connect({
    host: 'localhost',
    port: 22,
    username: 'root',
    password: 'meupau'
  });
});
}

