# ResearchHub Coleta

App de celular para coletar dados de pesquisa à beira do leito, **sem internet**.
Companheiro do ResearchHub — não analisa nada, só coleta.

```
COMPUTADOR  ──  Exportar JSON (a ficha)  ──▶  CELULAR
                                                │
                                        coleta offline
                                                │
COMPUTADOR  ◀──  CSV dos casos  ───────────────┘
   ResearchHub → card do estudo → Importar CSV
```

O ResearchHub **não precisa de nenhuma alteração**. O CSV gerado aqui entra pelo
botão "Importar CSV" que já existe, e os casos somam aos que já estão no estudo.

## Publicar no GitHub Pages

Os 7 arquivos desta pasta, nada mais:

```
index.html   manifest.webmanifest   sw.js
icon-180.png   icon-192.png   icon-512.png   icon-maskable-512.png
```

1. **github.com** → `New repository` → nome `researchhub-coleta` → **Public** → `Create`
2. Na página do repositório vazio → `uploading an existing file` → arraste os 7 arquivos → `Commit changes`
3. `Settings` → `Pages` → em *Source* escolha **Deploy from a branch** → branch `main`, pasta `/ (root)` → `Save`
4. Espere ~1 minuto. O endereço fica:
   `https://tmtc1980.github.io/researchhub-coleta/`

> **O que fica público é só o formulário em branco** — nenhum dado de paciente, nenhuma
> senha, nenhuma chave. Os casos coletados ficam dentro do aparelho e não têm para onde ir:
> o app não tem servidor nem conta.

## Instalar no iPhone

**Instale ANTES de começar a coletar.** No iOS, o app instalado na tela de início tem
armazenamento separado do Safari — se você coletar no Safari e instalar depois, o app
instalado abre vazio.

1. Abra o endereço **no Safari** (precisa ser o Safari — Chrome no iPhone não instala)
2. Botão de compartilhar (quadrado com seta) → **Adicionar à Tela de Início**
3. Abra pelo ícone novo. A partir daí funciona sem internet.

## Usar

| Passo | Onde | O quê |
|---|---|---|
| 1 | Computador | ResearchHub → card do estudo → **Exportar JSON** |
| 2 | — | Mande o arquivo para si mesmo (WhatsApp, e-mail, iCloud Drive) |
| 3 | Celular | **Carregar ficha** → escolha o arquivo. Uma vez por estudo |
| 4 | Celular | **Novo caso** → preenche em 6 partes → **Revisar** → **Salvar** |
| 5 | Celular | **Enviar** → gera o CSV → folha de compartilhamento |
| 6 | Computador | ResearchHub → card do estudo → **Importar CSV** |

⚠️ No passo 6, **não** use "Importar estudo". Aquele botão lê `.json` e cria um estudo
duplicado, separado do seu. O caminho certo é **Importar CSV**, dentro do card do estudo.

## O que o app faz por você

- **Assistente por partes** — um grupo da ficha por tela, barra de progresso
- **Rascunho automático** — se o telefone desligar ou você sair no meio, o caso continua lá
- **Alvos de 52px** — acima do mínimo da Apple (44px), dá para usar com uma mão
- **Teclado numérico** nos campos numéricos, com aviso quando o valor sai da faixa da ficha
- **Alerta de prontuário repetido** dentro da própria coleta do celular
- **Campos obrigatórios em branco** são listados na revisão — dá para salvar assim mesmo,
  o caso fica marcado como incompleto
- **Fila de envio** — cada caso é marcado como enviado, então reimportar o mesmo caso
  por engano fica difícil. Editar um caso já enviado devolve ele para a fila

## Por que CSV e não .rhub.json

O `importStudy` do ResearchHub ([linha 1213](../ResearchHub/ResearchHub.html)) sempre cria
um estudo novo e regenera o id de todos os registros. O `doCSVImport`
([linha 1362](../ResearchHub/ResearchHub.html)) faz `DB.setRecords(sid, [...recs, ...newRecs])`
— acrescenta ao estudo que já existe. Por isso o caminho de volta é CSV.

O CSV é gerado para casar com o que o ResearchHub espera:

- **cabeçalhos** = rótulos exatos dos campos, para o `autoMapHeaders` parear sozinho
- **booleano** → `Sim` / `Não`
- **número** → ponto decimal
- **multiselect** → separado por vírgula, dentro de aspas
- **data** → `AAAA-MM-DD`
- **sem BOM** — o ResearchHub lê o texto direto; um BOM sujaria o primeiro cabeçalho e
  estragaria o pareamento automático

Verificado contra o parser real do ResearchHub: 62 de 62 colunas pareadas automaticamente,
15 de 15 conversões de tipo corretas, incluindo aspas dentro de texto livre.

## Riscos

1. **Exporte ao fim de cada turno.** O armazenamento do navegador do celular não é cofre:
   limpar dados do site apaga, e o iOS pode descartar armazenamento sob pressão de memória.
   Instalar na tela de início reduz muito o risco, mas a disciplina de exportar é o que
   de fato protege. O app avisa na tela inicial quando há casos pendentes.
2. **O celular não conhece o acervo do computador.** Ele alerta prontuário repetido
   *dentro da própria coleta do celular*; a conferência contra os casos que já estão no
   PC acontece na hora da importação.

## Testar no computador

```bash
python -m http.server 5181 --directory "C:\Users\tmesq\OneDrive\Área de Trabalho\ResearchHub-Coleta"
```

Depois abra `http://localhost:5181`. O service worker só registra em `localhost` ou `https` —
abrir o `index.html` por duplo clique funciona para ver as telas, mas não instala nem fica offline.
