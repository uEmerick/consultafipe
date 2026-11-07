# FipeVeloz

Aplicação React com Next.js para consultar o preço de referência de carros na Tabela FIPE. Selecione marca, modelo e ano para ver o valor, o código FIPE e o mês de referência.

## Executar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Dados

Os dados são fornecidos pela [API FIPE](https://deividfortuna.github.io/fipe/v2/). A interface carrega marcas, modelos e anos sob demanda e consulta o valor do veículo selecionado. As requisições passam pela rota local `/api/fipe` para evitar restrições de origem do serviço externo.
