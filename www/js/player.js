//Classe para as funcionalidades do player de áudio
var player = {

    //Elemento HTML de áudio
    audioElement: document.getElementById("playerSound"),

    //Elemento HTML que representa o player e que o usuário interage
    playerElement: new bootstrap.Modal(document.getElementById("modalContainer")),

    //Elementos HTML que apresentam informações para análise
    analiseElements: [
        document.getElementById("audioPlayed"),
        document.getElementById("volume"),
        document.getElementById("isReady")
    ],

    //Áudio selecionado
    sound: {
        name: "",
        src: "",
        volume: 0.0,
        ready: false,
        state: "",
        duration: 0.0,
        currentTime: 0.0,
        nextId: 0
    },

    //Objeto temporário com as urls dos áudios a serem tocados
    playlist: [
        ["Big Dreams", "https://firebasestorage.googleapis.com/v0/b/testestreaming-9a6ba.appspot.com/o/sounds%2FBig%20Dreams.mp3?alt=media&token=079cb52b-09cb-41be-b049-963dfec7f293"],
        ["Adventure is Calling", "https://firebasestorage.googleapis.com/v0/b/testestreaming-9a6ba.appspot.com/o/sounds%2FAdventure_is_Calling.mp3?alt=media&token=b63de635-971f-4b36-9146-3ff8a6c33b32"],
        ["Lights", "https://firebasestorage.googleapis.com/v0/b/testestreaming-9a6ba.appspot.com/o/sounds%2FLights.mp3?alt=media&token=9781d5e7-b1e5-4586-a551-0a2ce30ab9a9"]
    ],

    //Construtor do app
    initialize: function(){
        console.info("Iniciando...");
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    //Quando todas as estruturas cordova tiverem inicializado
    onDeviceReady: function(){
        console.info("Device Ready");
        document.getElementById("btnPlayAudio").addEventListener("click", player.setPlayerState);

        //Mostrar ou esconder player
        window.addEventListener("click", () => {
            player.playerElement.show();
        })
        
        //Botão para iniciar a tocar o áudio pela primeira vez
        document.getElementById("btnStartReading").addEventListener("click", () => {
            player.setPlayerState();
            document.getElementById("startScreen").style.display = "none";
        });
        player.setSound();
        /* 2ª opção: iniciar áudio automaticamente 
        player.setPlayerState();
        */
       player.isEnded();
    },

    //Método para definir os parâmetros para o áudio a ser tocado
    setSound: function(){
        player.sound.name = player.playlist[player.sound.nextId][0];
        player.sound.src = player.playlist[player.sound.nextId][1];
        player.sound.volume = 0.5;
        
        //Enviando a url do áudio para o player no HTML
        player.audioElement.children[0].src = player.sound.src;
        player.audioElement.load();
        
        //Esperando o áudio estar pronto para ser tocado
        var readyStageIntervalId = null;
        readyStageIntervalId = setInterval( function(){

            player.analiseElements[2].innerHTML = player.audioElement.readyState == 4;

            if(player.audioElement.readyState == 4){                
                //Definindo o volume do áudio no player
                player.audioElement.volume = player.sound.volume;

                player.analiseElements[1].innerHTML = player.sound.volume;
        
                //Definindo 'state' e 'duration' de 'sound'
                player.sound.state = "paused";
                player.sound.duration = player.audioElement.duration;
                console.log("[audioElement.duration]", player.audioElement.duration);
                console.log("[sound.duration]", player.sound.duration);

                //Definindo o id da próxima música a ser tocada
                player.sound.nextId = (player.sound.nextId + 1) % player.playlist.length;
        
                //Habilitando botão para iniciar leitura
                document.getElementById("btnStartReading").disabled = false;
                
                clearInterval(readyStageIntervalId);
            }
        },
        10);

    },

    //Método para alterar o estado do player (iniciado ou pausado | played or paused)
    setPlayerState: function(){
        //Verificando estado atual do player
        switch(player.sound.state){

            case "played"://Iniciado
                player.audioElement.pause();
                player.sound.state = player.audioElement.paused ? "paused" : (console.log("Erro ao pausar áudio"), "played");
                break;

            case "paused"://Pausado
                player.audioElement.play();
                player.sound.state = !player.audioElement.paused ? "played" : (console.log("Erro ao iniciar áudio"), "paused");
                break;

            default://Estado não conhecido
                console.log("Estado não conhecido: " + player.sound.state);
                break;
        }
    },

    //Método que verifica se o áudio terminou de tocar
    isEnded: function(){
        //Esperando o áudio terminar de tocar
        setInterval( function(){
            if(player.audioElement.ended){
                player.setSound("https://firebasestorage.googleapis.com/v0/b/testestreaming-9a6ba.appspot.com/o/sounds%2FAdventure_is_Calling.mp3?alt=media&token=b63de635-971f-4b36-9146-3ff8a6c33b32");

                //Esperano o novo áudio ser definido
                var setPlayerStateIntervalId = null;

                setPlayerStateIntervalId = setInterval( function(){
                    if(player.sound.state == "paused"){
                        player.setPlayerState();
                        clearInterval(setPlayerStateIntervalId);
                    }
                },
                10);
                
            }else{
                player.setCurrentTime();
                var audioPlayed = parseFloat( ((player.sound.currentTime / player.sound.duration) * 100)).toFixed(2);

                player.analiseElements[0].innerHTML = audioPlayed;

                if(audioPlayed > 90 && player.sound.state == "played"){
                    player.analiseElements[1].innerHTML = player.sound.volume;

                    player.setVolume( (player.sound.volume > 0) ? player.sound.volume -= 0.0005 : 0 );
                }
            }
        },
        10);
    },

    //Método para definir o 'player.sound.currentTime' de acordo com o minuto atual do áudio
    setCurrentTime: function(){
        player.sound.currentTime = player.audioElement.currentTime;
    },

    //Método para definir o 'player.sound.volume'
    setVolume: function(volume){
        if(volume >= 0){
            player.sound.volume = volume;
            player.audioElement.volume = player.sound.volume;
        }
    },

}

player.onDeviceReady();