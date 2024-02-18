# cru.js

### Rápido, fácil de usar e performática!
Uma biblioteca em Javascript onde o objetivo é facilitar as requisições usando apenas o HTML.

#### Configurando
```js
$C({
  'prefix_url': '', // '/api/v1'
  'headers': {'Content-Type': 'application/json'},
  'callbacks': {},
})
```
## Instalação
Faça [download do cru.js](https://raw.githubusercontent.com/Iazzetta/cru.js/main/dist/cru-min.js) e inclua em seu projeto.
```html
<script src="cru-min.js"></script>
```
## Documentação

Veja alguns exemplos: [https://iazzetta.github.io/crujs](https://iazzetta.github.io/cru.js/)

### Container
No cru.js, chamamos de `container` um elemento que contém o atributo `c-container="/seu-endpoint"`.

Os containers são usados fazer uma requisição assim que a página ser carregada.
Por padrão o HTML ou JSON da requisição é inserido dentro do elemento do container.

```html
<div c-container="/users/form"></div>
```

Uma requisição será feita para o endpoint `/users/form` e o HTML retornado será inserido dentro do elemento do Container.

Você também pode carregar containers dentro de containers 😁

#### c-target 
Determine onde o conteúdo será renderizado usando o atributo `c-target=".uma-classe #um-id"`.

```html
<div c-container="/users/form" c-target="#exemplo"></div>

<div id="exemplo">
  <!-- conteúdo do container será renderizado aqui -->
</div>
```

#### c-swap
Ou então substituir todo o elemento usando o atributo `c-swap=".uma-classe #um-id"`.

```html
<div c-container="/users/form" c-swap="#exemplo"></div>

<!-- o elemento abaixo será substituido pelo conteúdo do container -->
<div id="exemplo"></div>
```

#### c-reload

É possível recarregar o container no evento `click` com o atributo `c-reload=true`.
Quando esse elemento for clicado, será enviado uma nova requisição no endpoint do container e o conteúdo será renderizado novamente.

```html
<div c-container="/noticias" c-target="#lista-noticias">
    <button c-reload=true>Atualizar</button>
</div>

<section id="lista-noticias"></div>
```

#### c-type
Define qual é o tipo de retorno. Por padrão o tipo é `html`, mas pode ser alterado para `json`.
```html
<div c-container="/retorno-html"></div>
<div c-container="/retorno-json" type="json"></div>
```

#### c-callback

Você pode também criar callbacks para decidir o que fazer com retorno em JSON.
O valor do atributo precisa ser o nome da função que você possui no código.
Essa função recebe o resultado da consulta e o elemento que consultou (ou o `c-target` definido).

##### $cruCallback
Para criar um callback você precisa usar a função `$cruCallback`.
O primeiro parametro é o nome do seu callback e os parametros.

```html
<script>
window.onload = function() {

  $cruCallback('meuCallback', (result, element) => {
    console.log('status', result.status)
    console.log('conteudo', result.content)
    console.log('elemento', element)
  })

}
</script>
```

##### Lista de usuários de uma API JSON

```html
<div c-container="/lista-clientes-json" c-callback="listaUsuarios"></div>

<script>
window.onload = function() {
  
  $cruCallback('listaUsuarios', (result, element) => {
    console.log('status', result.status)
    console.log('conteudo', result.content)
    console.log('elemento', element)

    for(const user of result.content.users) {
      console.log(user.name, user.email)
    }
  })

}
</script>
```

### Requisições

Através do evento `click`, é possível fazer uma requisição com todos os métodos de requisição: `GET`, `POST`, `PUT` e `DELETE`.

##### c-get
Nesse exemplo, ao clicar nos botões do menu, o conteúdo HTML é renderizado no elemento `.conteudo`.
```html
<div class="menu">
  <button c-get="/" c-target=".conteudo-dinamico">Inicial</button>
  <button c-get="/produtos" c-target=".conteudo-dinamico">Produtos</button>
  <button c-get="/sobre" c-target=".conteudo-dinamico">Sobre</button>
</div>

<section class="conteudo-dinamico"></section>
```

##### c-post
Também é possível enviar uma requisição `POST` através de um `click`
```html
<button c-post="/bot/1/new">Criar um novo robo</button>
```

##### c-put
Qualquer tipo de método é possível
```html
<button c-put="/bot/1/start">Iniciar robo</button>
<button c-put="/bot/1/stop">Parar robo</button>
```

##### c-delete
Inclusive deletar em 1 click 🥲
```html
<button c-delete="/bot/1/delete">Excluir robo</button>
```
##### c-remove-closest

Remova o elemento mais proximo (`closest`) após uma requisição.
```html
<!-- O elemento <tr> é removida após a requisição -->
<tr>
  <th>{{cliente.nome}}<th>
  <th>
    <button c-delete="/bot/{{usuario.id}}/delete" c-remove-closest="tr">deletar</button>
  </th>
</tr>
```

### Formulários

Não podemos esquecer dos formulários. Agora você pode fazer requisições `GET`, `POST`, `PUT` e `DELETE`!
Basta usar a class `c-form` e os atributos adicionais para fazer o que desejar.

**Enviando dados sem sair da página**
Por padrão o método de requisição é `POST`.

```html
<form class="c-form" action="/criar-conta">
  <input type="email" name="email" placeholder="E-mail" required>
  <input type="email" name="email" placeholder="E-mail" required>

  <button>Criar conta</button>
</form>
```

**Todos métodos de requisição**

```html
<form class="c-form" action="/atualizar-conta" method="put">
  <!-- ... -->
</form>
```

```html
<form class="c-form" action="/deletar-conta" method="delete">
  <!-- ... -->
</form>
```

**Adicionar elementos**

Você também pode usar o `c-append` para inserir o retorno no fim do elemento e `c-prepend` inserir o retorno no inicio do elemento:

```html
<!-- c-prepend -->
<form class="c-form" action="/add-item" c-prepend="#lista-prepend">
  <input type="text" name="nome_item">
  <button>Adicionar</button>
</form>

<div id="lista-prepend">
  <!-- Adiciona no inicio -->
  
</div>

<!-- c-append -->
<form class="c-form" action="/add-item" c-append="#lista-append">
  <input type="text" name="nome_item">
  <button>Adicionar</button>
</form>

<div id="lista-append">
  
  <!-- Adiciona no fim -->
</div>
```

**Redirecionar automaticamente**

Adicionando uma URL ao atributo `c-redirect`, após a requisição o usuário é redirecionado.

```html
<!-- Após adicionar um item, redirecionar par pagina inicial -->
<form class="c-form" action="/add-item" c-redirect="/">
  <input type="text" name="nome_item">
  <button>Adicionar</button>
</form>

<!-- Nas requisicões via click também -->
<button c-delete="/posts/1/deletar-item" c-redirect="/posts">
  Deletar e voltar
</button>
```


**Resetar formulário após requisição**

Uma forma facil de resetar todo formulário é usando o `c-reset`.

```html
<form class="c-form" action="/add-item" c-reset="true">
  <input type="text" name="nome_item">
  <button>Adicionar</button>
</form>
```

**Recarregar um formulário depois de fazer o submit**

```html
<form class="c-form" action="/add-item" c-append="#lista-items" c-reload=true>
  <input type="text" name="nome_item">
  <button>Adicionar</button>
</form>

<div id="lista-items"></div>
```

## Contribuindo

Fique a vontade para contribuir com o projeto! Crie uma issue para dar sugestões ou reportar bugs e envie seu Pull Request com features, melhorias e correções.
