# Tipos primitivos no TypeScript

## Tipos básicos
- `string`: texto
- `number`: números inteiros e decimais
- `boolean`: verdadeiro ou falso

## Tipos especiais
- `null`: valor vazio intencional
- `undefined`: valor ainda não atribuído

## Inferência de tipo
- TypeScript deduz o tipo automaticamente com base no valor atribuído.
  Ex: `let nome = "Iuri";` → inferido como `string`

## Dicas
- Use tipagem explícita quando o valor for atribuído depois
- Use inferência quando o valor já é óbvio

## Diferença entre null e undefined
- `null`: você **define** que algo está vazio
- `undefined`: o JS/TS entende que **ainda não foi definido**
