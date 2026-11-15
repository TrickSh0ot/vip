# Resolution VIP — Santx Sensi

Projeto completo do aplicativo web **Resolution VIP**, pronto para hospedagem no GitHub Pages. Inclui seu ícone de monitor vermelho e mouse dourado, interface responsiva, PWA e modo offline.

## Publicar no GitHub Pages (pelo celular ou computador)

1. Crie um repositório no GitHub, por exemplo `resolution-vip`.
2. Extraia o ZIP. **Envie o conteúdo da pasta `Resolution-VIP` para a raiz do repositório** — `index.html`, `manifest.webmanifest`, `sw.js`, `assets/`, `icons/`, `apple-touch-icon.png`, `favicon.ico` e este README. Não deixe `index.html` dentro de uma subpasta extra.
3. No repositório, vá até **Settings > Pages**. Em **Build and deployment**, selecione **Deploy from a branch**; em **Branch**, escolha `main` e `/ (root)`; salve.
4. Após a publicação, abra o endereço do site exibido pelo GitHub Pages, normalmente no formato `https://SEU-USUARIO.github.io/resolution-vip/`.

## Instalar no iPhone

1. Abra o link publicado **no Safari**.
2. Toque em **Compartilhar > Adicionar à Tela de Início**.
3. Mantenha o nome **Resolution VIP** e, se aparecer a opção, marque **Abrir como App**.
4. Confirme em **Adicionar**. O ícone enviado aparecerá na Tela de Início.

Se já havia um atalho antigo, remova-o e instale novamente para atualizar o nome ou ícone.

## Arquivos

- `index.html`: interface e metadados do app.
- `assets/app.css`: visual vinho/dourado, compatibilidade mobile e efeito preto de 900 ms.
- `assets/app.js`: dispositivos, presets, ajustes X/Y, cálculo de resolução, armazenamento local e botão de ativação.
- `manifest.webmanifest`: nome **Resolution VIP**, modo standalone e ícones.
- `apple-touch-icon.png`: ícone usado pelo Safari do iPhone (180x180).
- `icons/`: tamanhos de ícone para outros aparelhos e navegadores.
- `sw.js`: arquivos para abrir o app offline após a primeira visita/carregamento do cache.

## Funcionamento

Os seletores de modelos, resoluções e controles laterais/verticais permitem criar e salvar preferências de resolução no navegador. O botão **ATIVAR RESOLUÇÃO** registra o ajuste e apresenta um blackout visual de aproximadamente 900 ms.

**Limite técnico:** como aplicativo web/PWA, o projeto não modifica automaticamente as configurações internas de resolução do iOS ou do Free Fire. Os valores são calculados e salvos localmente. Para alterar configurações de jogo ou sistema seriam necessários mecanismos próprios, autorizados por essas plataformas.

## Personalização

Para trocar o convite do Discord, substitua `https://discord.gg/santxsensi` em `index.html`.

Para novas versões, atualize a string `CACHE` em `sw.js` (por exemplo, `resolution-vip-static-v2`) para evitar arquivos antigos no modo offline.

Não exige API, servidor, token, senha, dependência npm ou banco de dados.
