PennController.ResetPrefix(null); // Shorten command names (keep this line here))

DebugOff()  

Header(
    // Declare global variables to store the participant's ID and demographic information
    newVar("ID").global(),
    newVar("GENERO").global(),
    newVar("NATIVO").global(),
    newVar("IDADE").global(),
    newVar("ESCOLARIDADE").global(),
    newVar("CIDADE NATAL").global(),
    newVar("RESIDENCIA").global(),
    newVar("CURSO").global(),
    newVar("CERTIFICADO").global(),
    // Experimental trial
    newVar("presentationOrderCounter").global(),
    newVar("itemOrderCounter").global()
)

// Add the participant info to all trials' results lines
.log( "ID"     , getVar("ID") )
.log( "GENERO" , getVar("GENERO") )
.log( "NATIVO" , getVar("NATIVO") )
.log( "IDADE"    , getVar("IDADE") )
.log( "ESCOLARIDADE" , getVar("ESCOLARIDADE") )
.log( "CIDADE NATAL"   , getVar("CIDADE NATAL") )
.log( "RESIDENCIA"   , getVar("RESIDENCIA") )
.log( "CURSO"   , getVar("CURSO") )
.log( "CERTIFICADO"   , getVar("CERTIFICADO") )

// Sequence of events: consent to ethics statement required to start the experiment, participant information, instructions, exercise, transition screen, main experiment, result logging, and end screen.
Sequence("consentimento", "setcounter", "participants", "initcounters", "instructions_1", "instructions_2", "instructions_3", "instructions_4", randomize("exercise"), "start_experiment", rshuffle("experiment-filler", "experiment-item"), SendResults(), "end")

// Ethics agreement: participants must agree before continuing
newTrial("consentimento",
    newHtml("ethics_explanation", "consentimento.html")
        .cssContainer({"margin":"1em", "font-size":"1.1em"})
        .print()
    ,
    newHtml("form", `<div class='fancy'><input name='consent' id='consent' type='checkbox'><label for='consent'>Li e concordo em participar da pesquisa.</label></div>`)
        .cssContainer({"margin":"1em"})
        .print()
    ,
    newFunction( () => $("#consent").change( e=>{
        if (e.target.checked) getButton("go_to_info").enable()._runPromises();
        else getButton("go_to_info").disable()._runPromises();
    }) ).call()
    ,
    newButton("go_to_info", "Continuar")
        .cssContainer({"margin":"1em"})
        .disable()
        .print()
        .wait()
)

// Start the next list as soon as the participant agrees to the ethics statement
// This is different from PCIbex's normal behavior, which is to move to the next list once 
// the experiment is completed. In my experiment, multiple participants are likely to start 
// the experiment at the same time, leading to a disproportionate assignment of participants
// to lists.
SetCounter("setcounter")

// Participant information: questions appear as soon as information is input
newTrial("participants",
    defaultText
        .cssContainer({"margin-top":"1em", "margin-bottom":"1em"})
        .print()
    ,
    newText("participant_info_header", "<div class='fancy'><h2>Questionário sociodemográfico</h2><p>Por favor, complete esse questionário com algumas informações sobre você.</p></div>")
    ,
    // ID
    newText("participantID", "<b>Informe seu nome ou, se preferir, suas iniciais.</b>")
    ,
    newTextInput("input_ID")
        .log()
        .print()
    ,
    // Idade
    newText("<b>Qual a sua idade?</b><br>(responda usando números)")
    ,
    newTextInput("input_idade")
        .length(2)
        .log()
        .print()
    ,
    // Genero
    newText("<b>Selecione o seu gênero</b>")
    ,
    newScale("input_genero",   "Feminino", "Masculino", "Outro", "Prefiro não responder")
        .radio()
        .log()
        .labelsPosition("right")
        .print()
    ,
    // Cidade natal
    newText("<b>Qual é a sua cidade natal?</b>")
    ,
    newTextInput("input_cidadenatal")
        .log()
        .print()
    ,
    // Cidade de residencia
    newText("<b>Qual é a sua cidade de residência?</b>")
    ,
    newTextInput("input_residencia")
        .log()
        .print()
    ,
    // Nativo
    newText("<b>O português brasileiro é sua língua materna (ou seja, a primeira língua que você aprendeu)?</b>")
    ,
    newScale("input_nativo",   "Sim", "Não")
        .radio()
        .log()
        .labelsPosition("right")
        .print()
    ,
    // Escolaridade
    newText("<b>Qual sua escolaridade?</b>")
    ,
    newScale("input_escolaridade",   "Primeiro Grau completo ou cursando", "Segundo grau completo ou cursando", "Curso universitário completo ou cursando")
        .radio()
        .log()
        .labelsPosition("right")
        .print()
    ,
    // Curso
    newText("<b>Se você marcou 'Curso universitário completo ou cursando', qual é ou foi o seu curso?</b><br>(Se você marcou outra opção, deixe em branco)")
    ,
    newTextInput("input_curso")
        .log()
        .print()
    ,
    // Certificado
    newText("<b>Se quiser receber certificado de participação, deixe seu e-mail aqui:</b>")
    ,
    newTextInput("input_certificado")
        .log()
        .print()
    ,
    newText("<b>Obs.: O certificado de participação apenas será enviado caso você tenha informado seu nome completo.</b>")
        .color("red")
    ,
    // Clear error messages if the participant changes the input
    newKey("just for callback", "") 
        .callback( getText("errorage").remove() , getText("errorID").remove() )
    ,
    // Formatting text for error messages
    defaultText.color("Crimson").print()
    ,
    // Continue. Only validate a click when ID and age information is input properly
    newButton("weiter", "Continuar para instruções")
        .cssContainer({"margin-top":"1em", "margin-bottom":"1em"})
        .print()
        // Check for participant ID and age input
        .wait(
            newFunction('dummy', ()=>true).test.is(true)
            // ID
            .and( getTextInput("input_ID").testNot.text("")
                .failure( newText('errorID', "Por gentileza, coloque seu nome ou iniciais.") )
            // Age
            ).and( getTextInput("input_idade").test.text(/^\d+$/)
                .failure( newText('errorage', "Por gentileza, coloque sua idade."), 
                          getTextInput("input_idade").text("")))  
        )
    ,
    // Store the texts from inputs into the Var elements
    getVar("ID")     .set( getTextInput("input_ID") ),
    getVar("GENERO") .set( getScale("input_genero") ),
    getVar("NATIVO")   .set( getScale("input_nativo") ),
    getVar("IDADE") .set( getTextInput("input_idade") ),
    getVar("ESCOLARIDADE")    .set( getScale("input_escolaridade") ),
    getVar("CURSO") .set( getTextInput("input_curso") ),
    getVar("CIDADE NATAL") .set( getTextInput("input_cidadenatal") ),
    getVar("RESIDENCIA") .set( getTextInput("input_residencia") ),
    getVar("CERTIFICADO") .set( getTextInput("input_certificado") )
)

// Inicialização dos contadores (sem UI)
newTrial("initcounters",
    getVar("presentationOrderCounter").set(0),
    getVar("itemOrderCounter").set(0)
).setOption("countsForProgressBar", false)

// Instructions
// INSTRUÇÃO 1: introdução e aviso
newTrial("instructions_1",
    newText("intro", "<h2>INSTRUÇÕES</h2><p>Olá! Obrigado por participar.</p><p>Antes de começar, certifique-se de que você terá aproximadamente <strong>X minutos</strong> para fazer esta tarefa, e que está em um ambiente <strong>silencioso</strong> e <strong>sem distrações</strong>.<p><strong>Para maior aproveitamento e conforto, recomendamos que você realize o experimento em um computador.</strong></p>")
        .cssContainer({"margin":"1em", "font-size":"1.3em"})
        .print()
    ,
    newButton("next", "Próximo")
        .cssContainer({"margin":"2em"})
        .center()
        .print()
        .wait()
)

// INSTRUÇÃO 2: descrição geral da tarefa
newTrial("instructions_2",
    newText("desc", "<p>Nesta tarefa, você verá algumas situações, todas envolvendo um objeto que passou por alguma mudança ou ação.</p><p>Logo após cada situação, aparecerá uma pergunta: <strong>“O que aconteceu com [o objeto]?”</strong></p>")
        .cssContainer({"margin":"1em", "font-size":"1.3em"})
        .print()
    ,
    newButton("next", "Próximo")
        .cssContainer({"margin":"2em"})
        .center()
        .print()
        .wait()
)

// INSTRUÇÃO 3: o que o participante deve fazer
newTrial("instructions_3",
    newText("escolha", "<p>Você deverá escolher entre duas frases a que melhor responde a essa pergunta, ou seja, a que mais faz sentido com o que aconteceu com o objeto na situação apresentada.</p><p><strong>Não existe resposta certa ou errada</strong> – o que importa é sua intuição com base no que leu.</p>")
        .cssContainer({"margin":"1em", "font-size":"1.3em"})
        .print()
    ,
    newButton("next", "Próximo")
        .cssContainer({"margin":"2em"})
        .center()
        .print()
        .wait()
)

// INSTRUÇÃO 4: sequência da tarefa
newTrial("instructions_4",
    newText("sequencia", "<p>Após ler a situação e selecionar a frase que considera mais adequada, você seguirá automaticamente para a próxima frase.</p><p>Ao entender essas instruções, clique no botão abaixo para iniciar a tarefa.</p>")
        .cssContainer({"margin":"1em", "font-size":"1.3em"})
        .print()
    ,
    newButton("go_to_exercise", "Iniciar tarefa")
        .cssContainer({"margin":"2em"})
        .center()
        .print()
        .wait()
        ,
        clear()
        ,
        // Wait briefly to display which option was selected
        newTimer("wait", 1000)
            .start()
            .wait()
)

// Exercise
Template("exercise.csv", row =>
    newTrial( "exercise" ,
        newText("context", row.CONTEXT)
            .cssContainer({"margin-top":"2em", "margin-bottom":"2em", "font-size":"1.4em"})
            .center()
            .print()
        ,
        newButton("go_to_exercise", "Continuar")
            .cssContainer({"margin":"1em"})
            .center()
            .print()
            .wait()
        ,
        // Timer para mostrar nova sentenca
        newTimer("wait", 300)
            .start()
            .wait()
        ,
        // Limpa a pagina
        clear()
        ,

        // Escala
        newText("pergunta", "Qual das opções explica melhor o que aconteceu com " + row.OBJETOAFETADO + "?")
            .cssContainer({"margin":"1em", "font-size":"1.4em"})
            .center()
            .print()
        ,
        newScale("exercise1", row.SENTENCE1)
            .button()
            .center()
            .cssContainer({"margin":"1em", "font-size":"1.2em"})
            .print()
        ,
        newScale("exercise2", row.SENTENCE2)
            .button()
            .center()
            .cssContainer({"margin":"1em", "font-size":"1.2em"})
            .print()
        ,

        // Selecionador que permite apenas uma escolha
        newSelector("answer")
            .add(getScale("exercise1"), getScale("exercise2"))
            .center()
            .shuffle()
            .log()
            .wait()
        ,
        clear()
        ,
        // Wait briefly to display which option was selected
        newTimer("wait", 1000)
            .start()
            .wait()
    )
)

// Start experiment
newTrial( "start_experiment" ,
)

// Experimental trial
Template("experiment.csv", row =>
    newTrial( "experiment-"+((""+row.TYPE).trim().toLowerCase()),
        newText("context", row.CONTEXT)
            .cssContainer({"margin-top":"2em", "margin-bottom":"2em", "font-size":"1.4em"})
            .center()
            .print()
        ,
    
        newButton("go_to_exercise", "Continuar")
            .cssContainer({"margin":"1em"})
            .center()
            .print()
            .wait()
        ,
        // Timer para mostrar nova sentenca
        newTimer("wait", 300)
            .start()
            .wait()
        ,
        // Limpa a pagina
        clear()
        ,

        // Escala
        newText("pergunta", "Qual das opções explica melhor o que aconteceu com " + row.OBJETOAFETADO + "?")
            .cssContainer({"margin":"1em", "font-size":"1.4em"})
            .center()
            .print()
        ,
        
        // Cria os dois botões sem ainda posicionar
        newScale("passiva", row.SENTENCE1).button().cssContainer({"margin":"1em", "font-size":"1.2em"}),
        newScale("ergativa", row.SENTENCE2).button().cssContainer({"margin":"1em", "font-size":"1.2em"}),

        // Define ordem fixa balanceada: (PE, EP, PE, EP)
        newVar("TYPE_LOWER").set( (""+row.TYPE).trim().toLowerCase() ),
        newVar("order").set(""),
        getVar("TYPE_LOWER").test.is("item")
            .success(
                getVar("order")
                    .set( getVar("itemOrderCounter") )
                    .set(v => (v % 2 === 0 ? "PE" : "EP")),
                getVar("itemOrderCounter").set(v => v + 1)
            )
            .failure(
                getVar("order").set( () => (Math.random() < 0.5 ? "PE" : "EP") )
            )
        ,

        // DEBUG: ---------------------------------------------------------------
        //Apagar antes de ir pra produção
        newVar("debugText")
            .global()
            .set( getVar("order") )
            .set(v => {
                const label = (v == "PE") ? "P = SENTENCE1 | E = SENTENCE2" : "P = SENTENCE2 | E = SENTENCE1";
                const typeStr = ((""+row.TYPE).trim().toLowerCase() == "item") ? "INTERCALADO (ITEM)" : "ALEATÓRIO (FILLER)";
                return `Item ${row.ITEM} | Lista ${row.LIST} | TYPE ${row.TYPE} | ${typeStr} | ${label} | ${v}`;
            })
        ,
         newText("debugOrder", "")
            .text(getVar("debugText"))
            .cssContainer({"margin-top": "1em", "margin-bottom": "1em", "color": "darkgreen", "font-size": "1em"})
           .center()
            .print()
        ,
        // DEBUG: ---------------------------------------------------------------

        // Cria o canvas dinamicamente com base na ordem sorteada
        newCanvas("canvas", 330, 100)
            .center()
            .cssContainer({
                "margin-top": "20px",
                "font-size": "1.1em",
                "display": "flex",
                "flex-direction": "column",
                "align-items": "center"
            })
            .print()
            .after(
                getVar("order").test.is("PE")
                    .success(
                        getCanvas("canvas").add(0, 0, getScale("passiva")),
                        getCanvas("canvas").add(0, 100, getScale("ergativa"))
                    )
                    .failure(
                        getCanvas("canvas").add(0, 0, getScale("ergativa")),
                        getCanvas("canvas").add(0, 100, getScale("passiva"))
                    )
            )
        ,

        // Adiciona os botões ao seletor na mesma ordem visual
        getVar("order").test.is("PE")
            .success(
                newSelector("answer")
                    .add(getScale("passiva"), getScale("ergativa"))
                    .log()
                    .wait()
            )
            .failure(
                newSelector("answer")
                    .add(getScale("ergativa"), getScale("passiva"))
                    .log()
                    .wait()
            )
        ,
        clear()
        ,
        // Wait briefly to display which option was selected
        newTimer("wait", 1000)
            .start()
            .wait()
    )
    
    // Record trial data
    .log("ITEM"     , row.ITEM)
    .log("VERB", row.VERB)
    .log("CONTEXT" , row.CONTEXT)
    .log("SENTENCE1" , row.SENTENCE1) 
    .log("SENTENCE2" , row.SENTENCE2) 
    .log("LIST"     , row.LIST)
    //.log("ORDER", getVar("order")) //yasmin: ativar aqui pra ver os logs da ordem no resultado (nao testei)
    //.log("TYPE"     , (""+row.TYPE).trim().toLowerCase())
    //.log("ORDER_ACTUAL", getVar("order"))
)

// Final screen: explanation of the goal
newTrial("end",
    newText("<div class='fancy'><h2>Obrigado pela participação!</h2></div><p>Você pode fechar esta janela agora.")
        .cssContainer({"margin-top":"1em", "margin-bottom":"1em"})
        .print()
    ,
    // Trick: stay on this trial forever (until tab is closed)
    newButton().wait()
)
.setOption("countsForProgressBar",false);
