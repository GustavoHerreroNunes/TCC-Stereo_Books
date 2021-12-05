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

  // Set up our register function
  function register () {
      // Get all our input fields
      Nome = document.getElementById('txtNomeCompleto').value 
      Email = document.getElementById('txtEmail').value 
      Senha = document.getElementById('txtSenha').value 
      Cor_Favorita = document.getElementById('txtCorFav').value 
      Cpf = document.getElementById('txtCPF').value 

      // Validate input fields 
      if (validate_email(Email) == false || validate_password(Senha) == false) {
          alert('Email ou Senha estão vazios!!')
          return
          // Don't continue running the code
      }
      if (validate_field(Nome) == false || validate_field(Cor_Favorita) == false || validate_field(Cpf) == false) {
        alert('Um ou mais campos estão vazios!!')
        return 
        // Don't continue running the code
      }

      // Move on with Auth
      auth.createUserWithEmailAndPassword(Email, Senha)
      .then(function() {

        var user = auth.currentUser

        // Add this user to firebase 
        var database_ref = database.ref()

        // Create User data

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
          // firebase will use this to alert
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
        // Email is good
        return true
    } else {
        // Email is not good
        return false
    }
}

function validate_password(Senha) {
    // Firebase only accepts lengths greater than 6
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
  