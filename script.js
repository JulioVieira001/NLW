

const apiKeyInput = document.getElementById('apiKey')
const gameSelect = document.getElementById('gameSelect')
const questionId = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const aiResponse = document.getElementById('aiResponse')
const form = document.getElementById('Form')

const markdownToHTML = (text) => {
    const converter = new showdown.Converter()
    return converter.makeHtml(text)
}

//AIzaSyAZfi78xAstwDjOLuUXmEvkYyg4fdZ12-0//
const perguntarAI = async (apiKey, game, question) => {

    const model = 'gemini-2.5-flash';
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const perguntaLoL = `
    
    ## Especialidade
    -você é um assistente especializado de meta para o jogo ${game}.

    ## Tarefa

    -Você deve responder as perguntras do usuário com base no seu conhecimento sobre o jogo, estratégias, builds, dicas e outros aspectos relacionados ao jogo.

    ## Regras
    -Se você não souber a resposta, responda que não sabe, não tente inventar uma resposta.
    -se a pergunta não for relacionada ao jogo, responda que não está relacionada ao jogo, não tente inventar uma resposta.
    -considere a data atual ${new Date()}
    -Faça pesquisas atualizadas sobre o patch atual, baseado na data atual.
    -nunca responda itens que você não tenha certeza, sempre faça pesquisas atualizadas.
    ## Resposta
    - economize a resposta, seja direto e responda no máximo 500 catacteres.
    - responda em markdown, para que o texto seja formatado corretamente.
    -não realize saudações ou despedidas, apenas responda a pergunta.
    -Finalize com a frase: "Boa sorte na sua jornada no ${game}!"


    ## exemplo de resposta
    pergunta do usuario: Melhor build para o campeão X no patch atual?
    resposta: A melhor build para o campeão X no patch atual é:

    ---

    Aqui está a Pergunta do usuário: ${question}
    `


    const contents = [{
        role:"user",

        parts: [{
            text: perguntaLoL
        }]
    }]

    const tools = [{
        google_search: {} 

        }]

    //chamada API para a IA
    const response = await fetch(geminiURL, {
        method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },

    body: JSON.stringify({
        contents,
        tools
    }) 
    
    })

    const data = await response.json()
    console.log(data.candidates[0].content.parts[0].text)
    return data.candidates[0].content.parts[0].text
    

    }

const enviarFormulario = async (event) => {
    event.preventDefault()
    const apiKey = apiKeyInput.value
    const game = gameSelect.value
    const question = questionId.value


    if(apiKey == '' || game == '' || question == '')
        {
        alert('Preencha todos os campos!')
        return
    }

    askButton.disabled = true
    askButton.textContent = 'Perguntando...'
    askButton.classList.add('loading')


    try{
        //perguntar para a IA//

        const text = await perguntarAI(apiKey, game, question)
        console.log(aiResponse)
        aiResponse.querySelector('.response-text').innerHTML = markdownToHTML(text)
        aiResponse.classList.remove('hidden')



    
    } catch (error) {

        console.error('Erro ao enviar o formulário:', error)


} finally {
    askButton.disabled = false
    askButton.textContent = "Perguntar"
    askButton.classList.remove('loading')

}

}
form.addEventListener('submit', enviarFormulario)