// Um desenvolvedor tentou criar um projeto que consome a base de dados de filme do TMDB para criar um organizador de filmes, mas desistiu 
// pois considerou o seu código inviável. Você consegue usar typescript para organizar esse código e a partir daí aprimorar o que foi feito?

// A ideia dessa atividade é criar um aplicativo que: 
//    - Busca filmes
//    - Apresenta uma lista com os resultados pesquisados
//    - Permite a criação de listas de filmes e a posterior adição de filmes nela

// Todas as requisições necessárias para as atividades acima já estão prontas, mas a implementação delas ficou pela metade (não vou dar tudo de graça).
// Atenção para o listener do botão login-button que devolve o sessionID do usuário
// É necessário fazer um cadastro no https://www.themoviedb.org/ e seguir a documentação do site para entender como gera uma API key https://developers.themoviedb.org/3/getting-started/introduction

const apiKey: string = '3f301be7381a03ad8d352314dcc3ec1d';
let requestToken: string;
let username: string;
let password: string;
let sessionId: string;
const listId: string = '7101979';

const loginButton: HTMLElement | null = document.getElementById('login-button');
const searchButton: HTMLElement | null = document.getElementById('search-button');
const searchContainer: HTMLElement | null = document.getElementById('search-container');

function preencherSenha(): void {
  password = (document.getElementById('senha') as HTMLInputElement).value;
  validateLoginButton();
}

function preencherLogin(): void {
  username = (document.getElementById('login') as HTMLInputElement).value;
  validateLoginButton();
}

function preencherApi(): void {
  apiKey = (document.getElementById('api-key') as HTMLInputElement).value;
  validateLoginButton();
}

function validateLoginButton(): void {
  if (password && username && apiKey && loginButton) {
    loginButton.disabled = false;
  } else if (loginButton) {
    loginButton.disabled = true;
  }
}

class HttpClient {
  public static async get({url, method, body = null}: {url: string, method: string, body?: object | null}): Promise<any> {
    return new Promise((resolve, reject) => {
      const request: XMLHttpRequest = new XMLHttpRequest();
      request.open(method, url, true);

      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          resolve(JSON.parse(request.responseText));
        } else {
          reject({
            status: request.status,
            statusText: request.statusText
          });
        }
      };
      request.onerror = () => {
        reject({
          status: request.status,
          statusText: request.statusText
        });
      };

      if (body) {
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        body = JSON.stringify(body);
      }
      request.send(body);
    });
  }
}

async function procurarFilme(query: string): Promise<any> {
  query = encodeURI(query);
  const result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
    method: 'GET'
  });
  return result;
}

async function adicionarFilme(filmeId: number): Promise<void> {
  const result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=en-US`,
    method: 'GET'
  });
  console.log(result);
}

async function criarRequestToken(): Promise<void> {
  const result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
    method: 'GET'
  });
  requestToken = result.request_token;
}

async function logar(): Promise<void> {
  await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
    method: 'POST',
    body: {
      username: `${username}`,
      password: `${password}`,
      request_token: `${requestToken}`
    }
  });
}

async function criarSessao(): Promise<void> {
  const result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
    method

{/* <div style="display: flex;">
  <div style="display: flex; width: 300px; height: 100px; justify-content: space-between; flex-direction: column;">
      <input id="login" placeholder="Login" onchange="preencherLogin(event)">
      <input id="senha" placeholder="Senha" type="password" onchange="preencherSenha(event)">
      <input id="api-key" placeholder="Api Key" onchange="preencherApi()">
      <button id="login-button" disabled>Login</button>
  </div>
  <div id="search-container" style="margin-left: 20px">
      <input id="search" placeholder="Escreva...">
      <button id="search-button">Pesquisar Filme</button>
  </div>
</div>*/}