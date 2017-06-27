const express = require('express')
const app = express();
let setores = [""]
let setor
let perguntaId
let perguntaCompleta

var bodyParser = require('body-parser')

var mysql = require('mysql');

app.use(bodyParser.urlencoded({ extended: false }))
app.use("/CSS", express.static(__dirname + '/CSS'))

app.set('view engine', 'ejs')

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database : 'opina'
});

con.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
});

app.listen(8000, function() {
	console.log('listening on 8000')
})

//GETS

app.get('/',function(req, res){	
	res.sendFile(__dirname + '/index.html')
})

app.get('/cadastro.html', function(req, res){
	res.sendFile(__dirname + '/cadastro.html')
})

app.get('/Pages/selecao.html', function(req, res){
	res.sendFile(__dirname + '/Pages/selecao.html')
})

app.get('/index.html', function(req, res){
	res.sendFile(__dirname + '/index.html')
})

app.get('/Pages/cadastroSelect.html', function(req, res){
	res.sendFile(__dirname + '/Pages/cadastroSelect.html')
})


app.get('/Pages/respostaSelect.html', function(req, res){
	res.sendFile(__dirname + '/Pages/respostaSelect.html')
})

app.get('/Pages/cadastroPergunta.html', function(req, res){
	setor = req.query.setor
	res.render('cadastroPergunta',{
		setorT: setor
	})
})

app.get('/Pages/perguntasList.html', function(req, res){
	setor = req.query.setor
	var query
	if(setor == "Todos"){
		query = "SELECT * FROM perguntas"
	}
	else{
		query = "SELECT * FROM perguntas where setor = " + "'"+setor+"'"
	}

	con.query(query, function(err, rows, fields) {
		if (err){
			console.log("Conexão Falha!!!")
		}
		res.render('perguntasList',{
			setorT: setor,
			data: rows
		})
	});
})

app.get('/Pages/submitResposta.html', function(req, res){
		perguntaCompleta = req.query.setor
		console.log(perguntaCompleta + "BODY")

	res.render('submitResposta',{
		setorT: setor,
		question: perguntaCompleta
	})
})

//POST

app.post('/index.html', function(req, res){

	if(req.body.email != "" && req.body.user != "" && req.body.pass != "" && req.body.confPass != ""){
		console.log(req.body.pass)
		console.log(req.body.confPass)
		if(req.body.pass == req.body.confPass){

			var sql = "INSERT INTO users (id, pass, email) VALUES ('" +req.body.user +"', '" + req.body.pass +"', '" +  req.body.email + "')";

			con.query(sql, function (err, result) {
				if (err){
					console.log("Usuario Já Existe")
				};
			});

			res.sendFile(__dirname + '/index.html')	
		}else{
			console.log('Password Errado!!!')
		}

	}else{
		console.log("Faltam dados")
	}

})

app.post('/Pages/selecao.html', function(req, res){
	var query = "SELECT * FROM users where id = " + "'"+req.body.user+"'";
	
	con.query(query, function(err, rows, fields) {
		if (err){
			console.log("Senha incorreta!!!")
		}
		if(rows[0].pass == req.body.pass){
			res.sendFile(__dirname + '/Pages/selecao.html')	
		}else{
			console.log("Senha incorreta!!!")
		}
	});
})

app.post('/Pages/cadastroSelect.html', function(req, res){
	
	var query = "INSERT INTO perguntas (pergunta,setor) VALUES (" + "'"+req.body.pergunta+"'" + "," + "'"+setor+"'"+")";

	con.query(query, function (err, result) {
		if (err) throw err;
		console.log("Cadastro efetuado com sucesso!")
		res.sendFile(__dirname + '/Pages/cadastroSelect.html')
	});
})


function getSetores(){
	var query = "SELECT * FROM setores"

	con.query(query, function(err, rows, fields) {
		if (err){
			console.log("Errou")
		}
		console.log(rows);
		for (var i = 0; i < rows.length; i++){
			setores.push(rows[i].nome)
			console.log(setores)
		}
	});
}