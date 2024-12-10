// Seleciona os elementos do DOM
const form = document.getElementById('form');
const produtoInput = document.getElementById('produto');
const imagemInput = document.getElementById('imagem');
const lista = document.getElementById('lista');
const alertDiv = document.getElementById('alert');
const btnLimpar = document.getElementById('btnLimpar');

// Produtos pré-cadastrados com imagens
const produtosIniciais = [
    { nome: 'Arroz', imagem: 'imagens/Arroz.png' },
    { nome: 'Feijão', imagem: 'imagens/Feijao.webp' },
    { nome: 'Leite', imagem: 'imagens/Leite.jpeg' },
    { nome: 'Ovo', imagem: 'imagens/Ovo.webp' },
    { nome: 'Pão', imagem: 'imagens/Pao.avif' }
];

// Carrega os produtos do localStorage ao inicializar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
    produtosIniciais.forEach(({ nome, imagem }) => {
        if (!produtoExistente(nome)) {
            adicionarProdutoNaLista(nome, imagem, false);
            salvarProduto(nome, imagem, false);
        }
    });
});

// Função para carregar produtos do localStorage
function carregarProdutos() {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    produtos.sort((a, b) => a.nome.localeCompare(b.nome));
    const produtosComprados = produtos.filter(p => p.comprado);
    const produtosNaoComprados = produtos.filter(p => !p.comprado);

    produtosNaoComprados.forEach(({ nome, imagem }) => {
        adicionarProdutoNaLista(nome, imagem, false);
    });

    produtosComprados.forEach(({ nome, imagem }) => {
        adicionarProdutoNaLista(nome, imagem, true);
    });
}

// Adiciona um evento de submit ao formulário
form.addEventListener('submit', function(event) {
    event.preventDefault();
    const produto = capitalize(produtoInput.value.trim());
    const imagem = imagemInput.value.trim();

    if (!produto || produtoExistente(produto)) {
        mostrarAlerta('Produto já cadastrado ou inválido!', 'danger');
        return;
    }

    adicionarProdutoNaLista(produto, imagem, false);
    salvarProduto(produto, imagem, false);
    produtoInput.value = '';
    imagemInput.value = '';
});

// Função para adicionar um produto na lista
function adicionarProdutoNaLista(produto, imagem, comprado) {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';

    const img = document.createElement('img');
    img.src = imagem;
    img.alt = produto;
    img.style.width = '50px';
    img.style.height = '50px';
    img.className = 'mr-2';

    const nomeProduto = document.createElement('span');
    nomeProduto.textContent = produto;

    li.appendChild(img);
    li.appendChild(nomeProduto);

    if (comprado) {
        li.classList.add('list-group-item-success');
        li.style.textDecoration = 'line-through';
    }

    const divBotoes = document.createElement('div');
    divBotoes.className = 'ml-auto';

    const btnComprar = document.createElement('button');
    btnComprar.className = 'btn btn-success btn-sm';
    btnComprar.innerHTML = '<i class="fas fa-shopping-cart"></i> Comprar'; // Texto inicial "Comprar"
    btnComprar.onclick = () => {
        // Muda o estado do produto para comprado
        li.classList.add('list-group-item-success');
        li.style.textDecoration = 'line-through';
        
        // Atualiza o texto e o ícone do botão
        btnComprar.innerHTML = '<i class="fas fa-check"></i> Comprado';
        
        // Desabilita o clique no botão
        btnComprar.onclick = () => {}; 
        
        // Atualiza o estado no localStorage
        atualizarProduto(produto, imagem, true);
        atualizarLista();
    };

    const btnRemover = document.createElement('button');
    btnRemover.innerHTML = '<i class="fas fa-trash"></i>'; // Ícone de lixeira
    btnRemover.className = 'btn btn-danger btn-sm ml-2';
    btnRemover.onclick = () => {
        lista.removeChild(li);
        removerProduto(produto);
    };

    divBotoes.appendChild(btnComprar);
    divBotoes.appendChild(btnRemover);
    li.appendChild(divBotoes);
    lista.appendChild(li);
}

// Função para salvar produto no localStorage
function salvarProduto(produto, imagem, comprado) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    produtos.push({ nome: produto, imagem, comprado });
    localStorage.setItem('produtos', JSON.stringify(produtos));
}

// Função para atualizar o estado do produto no localStorage
function atualizarProduto(produto, imagem, comprado) {
    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    produtos = produtos.map(p => 
        p.nome === produto ? { nome: p.nome, imagem: p.imagem, comprado } : p
    );
    localStorage.setItem('produtos', JSON.stringify(produtos));
}

// Função para remover produto do localStorage
function removerProduto(produto) {
    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    produtos = produtos.filter(p => p.nome !== produto);
    localStorage.setItem('produtos', JSON.stringify(produtos));
}

// Função para verificar se o produto já existe
function produtoExistente(produto) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    return produtos.some(p => p.nome === produto);
}

// Função para capitalizar a primeira letra do produto
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Função para mostrar alertas na tela
function mostrarAlerta(mensagem, tipo) {
    alertDiv.innerHTML = `<div class="alert alert-${tipo}" role="alert">${mensagem}</div>`;
    setTimeout(() => {
        alertDiv.innerHTML = '';
    }, 3000);
}

// Evento para limpar a lista
btnLimpar.addEventListener('click', () => {
    lista.innerHTML = '';
    localStorage.removeItem('produtos');
    mostrarAlerta('Lista limpa!', 'success');
});

// Função para atualizar a lista na tela
function atualizarLista() {
    lista.innerHTML = '';
    carregarProdutos();
}
