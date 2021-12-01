var firebaseConfig = {
    apiKey: "AIzaSyAT5atiMaBqI80HBJx6JG1rqrYlEZj2cyQ",
    authDomain: "loginfirebase-d9671.firebaseapp.com",
    projectId: "loginfirebase-d9671",
    storageBucket: "loginfirebase-d9671.appspot.com",
    messagingSenderId: "377629158532",
    appId: "1:377629158532:web:41b5a6c0dcb316d9d0a6d1"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // Initialize variables
  const auth = firebase.auth()
  const database = firebase.database()

  // Função de registro (cadastro)
  function register () {
      // Pegar todos os campos de input
      Nome = document.getElementById('txtNomeCompleto').value 
      Email = document.getElementById('txtEmail').value 
      Senha = document.getElementById('txtSenha').value 
      Cor_Favorita = document.getElementById('txtCorFav').value 
      Cpf = document.getElementById('txtCPF').value 

      // Validar os campos de input
      if (validate_email(Email) == false || validate_password(Senha) == false) {
          alert('Email ou Senha estão vazios!!')
          return
          // Para de rodar o código
      }
      if (validate_field(Nome) == false || validate_field(Cor_Favorita) == false || validate_field(Cpf) == false) {
        alert('Um ou mais campos estão vazios!!')
        return 
        // Para de rodar o código
      }

      // Continuação da autenticação
      auth.createUserWithEmailAndPassword(Email, Senha)
      .then(function() {

        var user = auth.currentUser

        // Adicionar o usuário ao firebase
        var database_ref = database.ref()

        // Criar os dados do usuário (registro/cadastro)

        var user_data = {
            Nome : Nome,
            Email : Email,
            Senha : Senha,
            Cor_Favorita : Cor_Favorita,
            CPF : Cpf,
            last_login : Date.now()
        }

        database_ref.child('users/' + user.uid).set(user_data)
        alert('Usuário Criado!!')

      })
      .catch(function(error){
          // Alerta de erro 
          var error_code = error.error_code
          var error_message = error.message

          alert(error_message)
      })
  
    }

     function login() {
         Email = document.getElementById('txtEmail').value
         Senha = document.getElementById('txtSenha').value

         if (validate_email(Email) == false || validate_password(Senha) == false) {
             alert('Email ou Senha is outta line!!')
             return
         }

         auth.signInWithEmailAndPassword(Email, Senha)
         .then(function(){

            var user = auth.currentUser

            var database_ref = database.ref()

            var user_data = {
                last_login : Date.now()
            }

            database_ref.child('users/' + user.uid).update(user_data)

            alert('Usuário Logado')


         })
         .catch(function(error){
             var error_code = error.code
             var error_message = error.message

             alert(error_message)
         })
     } 


  

function validate_email(Email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/
    if(expression.test(Email) == true) {
        // Email é válido
        return true
    } else {
        // Email não é válido
        return false
    }
}

function validate_password(Senha) {
    // O firebase só aceita senhas com 6 caracteres ou mais
    if (Senha < 6) {
        return false
    } else {
        return true
    }
}

function validate_field(field) {
    if (field == null) {
        return false
    }

    if (field.length <= 0) {
        return false
    } else {
        return true
    }
}
  