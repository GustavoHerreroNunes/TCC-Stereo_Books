//Classe para as funcionalidades do player de áudio
var player = {

    //Elemento HTML de áudio
    audioElement: document.getElementById("playerSound"),

    //Elemento HTML que representa o player e que o usuário interage
    playerElement: new bootstrap.Modal(document.getElementById("modalContainer")),

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

    //Objeto 1 temporário com as urls dos áudios a serem tocados
    beforePlaylist: {
        id: 0,
        change_before_page: 1,
        change_after_page: 1,
        sounds: [
            ["Big Dreams", "https://firebasestorage.googleapis.com/v0/b/testestreaming-9a6ba.appspot.com/o/sounds%2FBig%20Dreams.mp3?alt=media&token=079cb52b-09cb-41be-b049-963dfec7f293"],
        ]
    },

    //Objeto 2 temporário com as urls dos áudios a serem tocados
    afterPlaylist: {
        id: 2,
        change_before_page: 6,
        change_after_page: 7,
        sounds: [
            ["Lights", "https://firebasestorage.googleapis.com/v0/b/testestreaming-9a6ba.appspot.com/o/sounds%2FLights.mp3?alt=media&token=9781d5e7-b1e5-4586-a551-0a2ce30ab9a9"]
            ["Adventure is Calling", "https://firebasestorage.googleapis.com/v0/b/testestreaming-9a6ba.appspot.com/o/sounds%2FAdventure_is_Calling.mp3?alt=media&token=b63de635-971f-4b36-9146-3ff8a6c33b32"],
        ]
    },

    //Objeto com as urls dos áudios a serem tocados (recebidas do banco) e o range de páginas em que a playlist deve ser tocada
    playlist: {
        id: 1,
        change_before_page: 3,
        change_after_page: 5,
        sounds: [
            ["Big Dreams", "https://firebasestorage.googleapis.com/v0/b/testestreaming-9a6ba.appspot.com/o/sounds%2FBig%20Dreams.mp3?alt=media&token=079cb52b-09cb-41be-b049-963dfec7f293"],
            ["Adventure is Calling", "https://firebasestorage.googleapis.com/v0/b/testestreaming-9a6ba.appspot.com/o/sounds%2FAdventure_is_Calling.mp3?alt=media&token=b63de635-971f-4b36-9146-3ff8a6c33b32"],
            ["Lights", "https://firebasestorage.googleapis.com/v0/b/testestreaming-9a6ba.appspot.com/o/sounds%2FLights.mp3?alt=media&token=9781d5e7-b1e5-4586-a551-0a2ce30ab9a9"]
        ] 
    },

    //Construtor do app
    initialize: function(){
        console.info("Iniciando...");
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    //Quando todas as estruturas cordova tiverem inicializado
    onDeviceReady: function(){
        console.info("Device Ready");
        document.getElementById("btnPlayAudio").addEventListener("click", () => {
            player.setPlayerState("played");
        });
        document.getElementById("btnPauseAudio").addEventListener("click", () => {
            player.setPlayerState("paused");
        });
        document.getElementById("btnResetAudio").addEventListener("click", () => {
            player.setPlayerState("stoped");
        });

        
        //Botão para iniciar a tocar o áudio pela primeira vez
        document.getElementById("btnStartReading").addEventListener("click", () => {
            player.setPlayerState("played");
            document.getElementById("startScreen").style.display = "none";
            document.getElementById("bookControls").classList += " fixed-top";
        });
        player.setSound();
        
        var soundOkIntervalId = null;
        soundOkIntervalId = setInterval( function() {
            if(player.sound.state == "paused"){
                player.setPlayerState("wait");
                
                //Mostrar ou esconder player
                document.getElementById("btnMediaControl").addEventListener("click", () => {
                    if(player.sound.state != "wait"){
                        player.playerElement.show();
                    }
                });

                clearInterval(soundOkIntervalId);
            }
        },
        10);
        
        /* 2ª opção: iniciar áudio automaticamente 
        player.setPlayerState();
        */
       player.isEnded();
    },

    //Método para definir os parâmetros para o áudio a ser tocado
    setSound: function(){
        player.sound.name = player.playlist.sounds[player.sound.nextId][0];
        player.sound.src = player.playlist.sounds[player.sound.nextId][1];
        player.sound.volume = 0.5;
        
        //Enviando a url do áudio para o player no HTML
        player.audioElement.children[0].src = player.sound.src;
        player.audioElement.load();
        
        //Esperando o áudio estar pronto para ser tocado
        var readyStageIntervalId = null;
        readyStageIntervalId = setInterval( function(){

            var bookState = document.frmCommunication.txbBookState.value;

            if(player.audioElement.readyState == 4 && bookState == "read"){
                //Definindo o volume do áudio no player
                player.audioElement.volume = player.sound.volume;
        
                //Definindo 'state' e 'duration' de 'sound'
                player.sound.state = "paused";
                player.sound.duration = player.audioElement.duration;
                console.log("[audioElement.duration]", player.audioElement.duration);
                console.log("[sound.duration]", player.sound.duration);

                //Definindo o id da próxima música a ser tocada
                player.sound.nextId = (player.sound.nextId + 1) % player.playlist.sounds.length;
        
                //Habilitando botão para iniciar leitura
                document.getElementById("btnStartReading").disabled = false;
                
                clearInterval(readyStageIntervalId);
            }
        },
        10);

    },

    //Método para alterar o estado do player (played, paused, stoped)
    setPlayerState: function(state){
        //Verificando estado atual informado
        switch(state){

            case "wait":
                player.audioElement.pause();
                player.sound.state = player.audioElement.paused ? "wait" : (console.log("Erro ao colocar áudio em espera"), "played");
                document.getElementById("btnPlayAudio").style.display = "initial";
                document.getElementById("btnPauseAudio").style.display = "none";
                document.getElementById("startScreen").style.display = "initial";
                player.playerElement.hide();
                break;

            case "paused"://Pausado
                player.audioElement.pause();
                player.sound.state = player.audioElement.paused ? "paused" : (console.log("Erro ao pausar áudio"), "played");
                document.getElementById("btnPlayAudio").style.display = "initial";
                document.getElementById("btnPauseAudio").style.display = "none";
                break;

            case "played"://Tocando
                player.audioElement.play();
                player.sound.state = !player.audioElement.paused ? "played" : (console.log("Erro ao iniciar áudio"), "paused");
                document.getElementById("btnPauseAudio").style.display = "initial";
                document.getElementById("btnPlayAudio").style.display = "none";
                break;

            case "stoped"://Parado
                player.audioElement.pause();
                player.sound.state = player.audioElement.paused ? "stoped" : (console.log("Erro ao parar áudio"), "played");
                document.getElementById("btnPlayAudio").style.display = "initial";
                document.getElementById("btnPauseAudio").style.display = "none";
                break;

            default://Estado não conhecido
                console.log("Estado não conhecido: " + state);
                break;
        }
    },

    //Método que verifica se o áudio terminou de tocar
    isEnded: function(){
        //Esperando o áudio terminar de tocar
        setInterval( function(){
            if(player.audioElement.ended){
                player.setSound();

                //Esperano o novo áudio ser definido
                var setPlayerStateIntervalId = null;

                setPlayerStateIntervalId = setInterval( function(){
                    if(player.sound.state == "paused"){
                        player.setPlayerState("played");
                        clearInterval(setPlayerStateIntervalId);
                    }
                },
                10);
                
            }else{
                player.setCurrentTime();
                var audioPlayed = parseFloat( ((player.sound.currentTime / player.sound.duration) * 100)).toFixed(2);

                if(audioPlayed > 90 && player.sound.state == "played"){
                    player.setVolume( (player.sound.volume > 0) ? player.sound.volume -= 0.0005 : 0 );
                }
            }
        },
        10);
    },

    //Método para trocar de playlist quando o usuário sair do range de páginas de um playlist
    isOutOfRange: function(){
        var page_current = document.frmCommunication.txbPageCurrent;
        var positionRelativeToRange = (page_current < player.playlist.change_before_page) ? "before" : ( (page_current > player.playlist.change_after_page) ? "after" : "within");

        setInterval( function(){
            switch(positionRelativeToRange){
                case "before":
                    player.playlist.id = player.playlist.id - 1
                    //Posteriormente buscar a playlist de acordo com o id (antes ou depois de atualizá-lo);
                    break;
                case "after":

                    break;
                case "within":

                    break;
                default:
                    console.log("Erro: Posição de página desconhecida");
                    break;
            }
        }
        ,10);
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

player.initialize();