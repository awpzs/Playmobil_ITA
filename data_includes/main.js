PennController.ResetPrefix(null); //Initiates PennController
var showProgressBar = false;
//PennController.DebugOff()
PennController.AddHost("https://raw.githubusercontent.com/awpzs/Playmobil_CHN/master/images/")

Sequence( "information", "identification", "recording_information", "initRecorder", "instruction", "prac", "exp_start", "block_1", "rest", "block_2", "send", "final" )

//PennController.SetCounter( "setcounter" );

newTrial( "information" ,
    newHtml("information", "data_treatment_italian.html")
        .print()

    ,
    newButton("Accetto")
        .settings.center()
        .print()
        .wait(getHtml("information").test.complete()
            .failure(getHtml("information").warn()))

)

newTrial("identification" ,
    newText("<p>Se sei uno studente di Milano-Bicocca e vuoi ricevere CFU per la tua partecipazione, inserisci qui il tuo numero di MATRICOLA</p>")
        .settings.center()
        .print()
    ,
    newTextInput("inputID", GetURLParameter('id'))
        .settings.center()
        .log()
        .print()
    ,
    newButton("Continua")
        .settings.center()
        .print()
        .wait()    
    ,
    newVar("ID")
        .global()
        .set( getTextInput("inputID") )
)
.log( "ID" , getVar("ID") )

newTrial("recording_information" ,
    newText("<p><strong>Attenzione!</strong> Le tue risposte saranno audio registrate per una successiva analisi. Per questo è necessario attivare il microfono del tuo PC o laptop.</p><p>Ti chiediamo inoltre di svolgere l&#39;esperimento in un posto tranquillo e di parlare ad alta voce e in modo chiaro.</p><p>Ti chiediamo di mantenere la concentrazione per tutta la durata dell&#39;esperimento e, una volta iniziato, di portarlo a termine. E&#39; prevista una breve pausa di 1-2 minuti durante la sessione (il momento per la pausa ti verrà indicato).</p><p>Non chiudere la pagina e non usare il tasto refresh, altrimenti non potrai più accedere all&#39;esperimento e perderai quello che hai già fatto.</p>")
        .print()
    ,
    newButton("Continua")
        .settings.center()
        .print()
        .wait()    
)

InitiateRecorder("http://myserver/saveVoiceRecordings.php", "Per cortesia consenti all&#39;applicazione expt.pcibex.net di accedere al tuo microfono. Cliccando sul link in blu qui sotto, dai il tuo assenso affinchè le risposte vengano registrate e inviate al server designato per la raccolta dati.").label("initRecorder")

UploadRecordings("sendAsync", "noblock")

newTrial("instruction",
        newText("<p>Benvenuti a questo esperimento! Grazie per aver accettato di partecipare. In questo esperimento, vedrai scene di personaggi-giocattolo che svolgono un&#39;azione.</p><p>Ci interessa come li descrivi. Immagina di descrivere la scena ad un ascoltatore immaginario in modo che il tuo ascoltatore possa capire cosa sta succedendo nella scena.</p>")  
            .print()
        ,
        newText("<p>Vedrai prima un&#39;immagine e una frase che descrive la scena. Per favore leggi la frase ad alta voce per il tuo ascoltatore immaginario, il quale puo&#39; vedere questa immagine, e poi clicca sulla frase. La frase scomparira&#39;.</p><p>Successivamente vedrai un&#39;altra immagine, in cui c’e’ stato un cambiamento rispetto alla prima immagine. Devi produrre ad alta voce una nuova frase che descrive l&#39;azione del personaggio.</p><p>Il tuo ascoltatore non puo&#39; vedere questa seconda immagine; l&#39;idea è che, ascoltando le tue istruzioni, lui o lei possa rappresentare l&#39;azione muovendo i giocattoli sulla scena, se potesse toccarli fisicamente.</p>")
            .print()
        ,
        newText("<p>Dopo aver descritto l&#39;azione, fa&#39; clic sul pulsante <strong>Continua</strong>. Vediamo alcuni esempi.</p>")
            .print()
        ,
        newButton("Continua")
            .settings.center()
            .print()
            .wait()
)

Template(
    GetTable("prac.csv")
        .setGroupColumn("List"), variable =>
        newTrial( "prac" ,
            newMediaRecorder("recorder", "audio")
                .record()
            ,
            newText("inst_read1", "Leggi questa frase ad alta voce e poi fa’ clic sulla frase. Quindi apparirà una seconda immagine.")
            ,
            newText("inst_read2", "Leggi questa frase ad alta voce e poi fa’ clic sulla frase.")
            ,
            newText("itemP", variable.Item)
                .test.text("p1")
                .success(getText("inst_read1").settings.center().print())
                .failure(getText("inst_read2").settings.center().print())
            ,
            newImage("one", variable.FirstDisplay)
                .size(342,256)
                .settings.center()
                .print()
            ,
            newText("sentence", variable.Italian)
                .settings.center()
                .bold()
                .print()
            ,
            newSelector()
                .add( getText("sentence") )
                .wait()
            ,
            getText("inst_read1")
                .remove()
            ,
            getText("inst_read2")
                .remove()
            ,
            getText("sentence")
                .remove()
            ,
            newText("itemP", variable.Item)
                .test.text("p1")
                .success(newText('inst2', '<p>Descrivi il cambiamento, iniziando con "Adesso". Puoi fare riferimento ai personaggi nel modo che preferisci. </p><p>Ad esempio, potresti dire qualcosa come:</p>').settings.center().print())
                .failure(newText('inst2', '<p>Descrivi il cambiamento, iniziando con "Adesso". Ad esempio, potresti dire qualcosa come</p>').settings.center().print())
            ,
            newText("ex_target", variable.target1)
                .settings.after(newText("&nbsp;o&nbsp;"))
                .settings.after(newText(variable.target2).settings.bold())
                .settings.bold()
                .settings.center()
                .print()
            ,
            newText("itemP", variable.Item)
                .test.text("p5")
                .success(newText('inst3', '<p>Durante tutto l’esperimento, puoi riferirti ai personaggi nel modo che vuoi, come ti viene piu’ naturale, </p><p>per esempio, potresti anche dire <strong>Adesso lei lascia cadere l&#39;innaffiatoio</strong>, oppure <strong>Adesso la donna lascia cadere l&#39;innaffiatoio</strong>, ecc.</p>').settings.center().print())
            ,
            newImage("two", variable.SecondDisplay)
                .size(342,256)
                .settings.center()
                .print()
            ,
            newText(variable.cont)
                .settings.center()
                .print()
            ,
            newButton("Continua")
                .settings.center()
                .print()
                .wait()
            ,
            getMediaRecorder("recorder")
                .stop()
            ,
            getMediaRecorder("recorder").test.recorded()
                .failure(newText("Sorry, there seems to be something wrong with your microphone. Please stop the experiment, and contact the researcher.").settings.center().print())
  )
  .log( "ID"     , getVar("ID")    )
  .log( "List"  , variable.List)
  .log( "Item"   , variable.Item   )
  .log( "Amb"   , variable.Amb   )
  .log( "Vis"   , variable.Vis   )
  .log( "Condition"   , variable.Condition   )
  .log( "Sentence" , variable.Italian)
  )

newTrial("exp_start",
        newText("<p>L&#39;esperimento inizierà ora.</p>")
            .settings.center()
            .print()
        ,
        newButton("Continua")
            .settings.center()
            .print()
            .wait()
)
  
Template(
    GetTable("block_1.csv")
        .setGroupColumn("List"), variable =>
        newTrial( "block_1" ,
            newMediaRecorder("recorder", "audio")
                .record()
            ,
            newImage("one", variable.FirstDisplay)
                .size(342,256)
                .settings.center()
                .print()
            ,
            newText("sentence", variable.Italian)
                .settings.center()
                .bold()
                .print()
            ,
            newSelector()
                .add( getText("sentence") )
                .wait()
            ,
            getText("sentence")
                .remove()
            ,
            newImage("two", variable.SecondDisplay)
                .size(342,256)
                .settings.center()
                .print()
            ,
            newButton("Continua")
                .settings.center()
                .print()
                .wait()
            ,
            getMediaRecorder("recorder")
                .stop()
            ,
            getMediaRecorder("recorder").test.recorded()
                .failure(newText("Sorry, there seems to be something wrong with your microphone. Please stop the experiment, and contact the researcher.").settings.center().print())
  )
  .log( "ID"     , getVar("ID")    )
  .log( "List"  , variable.List)
  .log( "Item"   , variable.Item   )
  .log( "Amb"   , variable.Amb   )
  .log( "Vis"   , variable.Vis   )
  .log( "Condition"   , variable.Condition   )
  .log( "Sentence" , variable.Italian)
  )  

newTrial("rest",
        newText("<p>ADESSO FA&#39; UNA PAUSA</p>")
            .settings.center()
            .print()
        ,
        newButton("Continua")
            .settings.center()
            .print()
            .wait()
)

Template(
    GetTable("block_2.csv")
        .setGroupColumn("List"), variable =>
        newTrial( "block_2" ,
            newMediaRecorder("recorder", "audio")
                .record()
            ,
            newImage("one", variable.FirstDisplay)
                .size(342,256)
                .settings.center()
                .print()
            ,
            newText("sentence", variable.Italian)
                .settings.center()
                .bold()
                .print()
            ,
            newSelector()
                .add( getText("sentence") )
                .wait()
            ,
            getText("sentence")
                .remove()
            ,
            newImage("two", variable.SecondDisplay)
                .size(342,256)
                .settings.center()
                .print()
            ,
            newButton("Continua")
                .settings.center()
                .print()
                .wait()
            ,
            getMediaRecorder("recorder")
                .stop()
            ,
            getMediaRecorder("recorder").test.recorded()
                .failure(newText("Sorry, there seems to be something wrong with your microphone. Please stop the experiment, and contact the researcher.").settings.center().print())
  )
  .log( "ID"     , getVar("ID")    )
  .log( "List"  , variable.List)
  .log( "Item"   , variable.Item   )
  .log( "Amb"   , variable.Amb   )
  .log( "Vis"   , variable.Vis   )
  .log( "Condition"   , variable.Condition   )
  .log( "Sentence" , variable.Italian)
  )  
SendResults( "send" )

newTrial( "final" ,
    newFunction("redirect", function(){ window.location = "https://www.stir.ac.uk"; })
    ,
    newText("<p>FINE DELL&#39;ESPERIMENTO. Grazie per la tua partecipazione!</p><p>Redirecting to Prolific in 5 seconds...</p>")
        .settings.center()
        .print()
    ,
    newTimer("wait", 5000)
        .start()
        .wait()
    ,
    getFunction("redirect")
        .call()
)
