# CODERIA.DEV — Multi-Agent Swarm Construction Experience

> **"Digital experiences engineered with intelligence."**

Website institucional da **Coderia.dev** apresentando uma experiência visual interativa inovadora: uma equipe autônoma de agentes cursores animados que constroem visualmente a interface em tempo real conforme a navegação (inspirado no conceito *SWARM Rebuild* de Dhvanil Patel / Joel Califa, reimaginado em arquitetura nativa Vanilla ES Modules).

Projeto estruturado e especificado com o padrão **GitHub Spec Kit** (`specs/001-featurename-header-hero-agents`).

---

## 🚀 Principais Funcionalidades

1. **Multi-Agent Swarm Engine (7 Agentes Especialistas Construtores)**:
   - Cursores personalizados em SVG, tags com badges dinâmicos de status, física de aceleração/desaceleração e órbitas:
     - 📐 **GRID** (`#3b82f6`): Criação de caixas de seleção, demarcação de wireframes e bounding boxes estruturais.
     - 🔲 **LAYOUT** (`#10b981`): Alinhamento, grid de seções e clonagem geométrica de componentes [Alt+Drag].
     - ✍️ **TEXTO** (`#ec4899`): Digitação em tempo real (efeito máquina de escrever letra por letra e palavra por palavra).
     - 🎨 **COR** (`#a855f7`): Aplicação de paletas de cor, gradientes ciano-violeta e efeitos de iluminação glow.
     - 🖼️ **FOTO** (`#f59e0b`): Posicionamento, enquadramento e revelação de imagens e mídias de projetos.
     - ⚡ **UI** (`#06b6d4`): Inserção de componentes interativos, botões de ação e ícones de serviços.
     - ✨ **MOTION** (`#f97316`): Calibração de microinterações, transições suaves e finalizações visuais.

2. **Órbita Magnética Inward em Repouso (Mouse Follow)**:
   - Quando em estado ocioso (`idle`), as etiquetas com nomes somem e os cursores se organizam em um anel orbital circular com pontas voltadas para dentro, seguindo o cursor do mouse suavemente pela página sem travamentos no scroll.

3. **Construção Seção a Seção Orientada por Scroll (In-View Trigger)**:
   - Cada seção do site só é construída quando entra de fato no campo de visão do usuário (`IntersectionObserver` estrito):
     - **Hero Section**: Símbolo central, caixa de seleção, digitação letra por letra de *"Construindo Aplicações"*, passagem de caixa prévia em *"Web Inteligentes"*, digitação letra por letra, e aplicação final do efeito de glow gradiente e sublinhado.
     - **Workflow (Por que IA?)**: Montagem do Card 1 $\rightarrow$ digitação do texto $\rightarrow$ clonagem horizontal interativa [Alt+Drag] para o Card 2 $\rightarrow$ digitação do texto $\rightarrow$ clonagem simultânea [Alt+Drag] para os Cards 3 e 4 $\rightarrow$ edição dos textos.
     - **Serviços**: Construção sequencial card por card, com inserção de ícones vetoriais, digitação de copy e clonagem arrastada [Alt+Drag].
     - **CTA de Contato**: Demarcação do container, digitação do título e ativação do botão interativo com tooltip para cópia rápida de e-mail.
     - **Footer**: Alinhamento de marca, símbolo e links sociais.

4. **Transição de Conclusão e Replay**:
   - Ao atingir 100% de montagem, a barra de progresso (HUD) é recolhida suavemente.
   - A página realiza um scroll suave de retorno para o topo (`#hero`) e espalha os 7 cursores em posições estéticas de repouso ao redor da headline principal, sem poluir a leitura ou seguir o mouse.
   - Um botão circular de **Reiniciar Experiência** (`#restart-experience-btn`) surge no canto inferior direito. Ao clicar, o site rola suavemente ao topo, reagrupa os cursores no centro do Hero e reinicia toda a coreografia do zero (0%).

---

## 🛠️ Stack Tecnológica

- **HTML5 & CSS3 Modular**: Estrutura semântica e variáveis CSS nativas (sem Tailwind, Bootstrap ou frameworks CSS).
- **JavaScript ES6+**: 100% Vanilla com ES Modules nativos (sem React, Next.js, Vue, TypeScript ou bundlers como Vite/Webpack).
- **GSAP 3.12+**: Interpolação de trajetórias, easing de física e coreografia de animação.
- **Motion (One)**: Microinterações de hover nos botões e links.

---

## 📂 Arquitetura do Projeto

```text
coderia/
│
├── index.html                   # Estrutura HTML5 semântica e containers
├── README.md                    # Documentação do projeto
│
├── specs/                       # Especificações pelo GitHub Spec Kit
│   └── 001-featurename-header-hero-agents/
│       ├── spec.md              # Requisitos funcionais e de experiência
│       ├── plan.md              # Planejamento arquitetural
│       └── tasks.md             # Checklist ordenado de tarefas
│
├── assets/
│   ├── fonts/                   # Fontes tipográficas (Poppins, Space Grotesk, JetBrains Mono)
│   ├── images/                  # Mockups, screenshots e logotipos vetoriais
│   └── icons/                   # Ícones da interface
│
├── css/
│   ├── reset.css                # Normalização de estilos
│   ├── variables.css            # Design tokens, cores dos agentes e temas escuros
│   ├── global.css               # Grid de fundo, tipografia e botões
│   ├── header.css               # Header fixo, logo tipográfica e drawer mobile
│   ├── hero.css                 # Hero section, typewriter chars e glow gradiente
│   ├── sections.css             # Seções Workflow, Serviços, CTA e Footer
│   └── agents.css               # Cursores SVG, wireframes fantasmas [Alt+Drag] e HUD
│
└── js/
    ├── main.js                  # Ponto de entrada e bootstrap
    │
    ├── config/
    │   └── agents.config.js     # Perfis dos 7 agentes construtores e paletas
    │
    ├── components/
    │   ├── navigation.js        # Menu mobile, drawer e cópia de e-mail no CTA
    │   └── hero.js              # Resolução dinâmica de coordenadas e bounding boxes
    │
    ├── agents/
    │   ├── agent-engine.js      # Gerenciador de ciclo de vida e redimensionamento
    │   ├── agent-cursor.js      # Renderizador do cursor SVG e etiquetas de estado
    │   ├── agent-movement.js    # Física de órbita do mouse e interpolação de scroll
    │   ├── agent-tasks.js       # Controle autêntico de tarefas e HUD dev-tools
    │   ├── agent-box-drawer.js  # Desenho de caixas wireframe e clonagem [Alt+Drag]
    │   └── agent-coordinator.js # Coordenação de seções via scroll, digitação e replay
    │
    └── animations/
        ├── intro.js             # Revelação inicial de grid e ambient glow
        ├── hero-animation.js    # Máquina de escrever (letras/palavras) e efeitos de glow
        └── transitions.js       # Microinterações Motion One
```

---

## 💻 Como Rodar Localmente

Por utilizar ES Modules nativos (`import`/`export`), os arquivos precisam ser servidos sob protocolo HTTP/HTTPS (para respeitar a política de CORS local dos navegadores):

```bash
# Opção 1: Usando Python (qualquer versão 3.x)
python -m http.server 3000

# Opção 2: Usando Node / npx
npx serve .

# Opção 3: Extensão VS Code
Botão direito em index.html -> "Open with Live Server"
```

Acesse no navegador: `http://localhost:3000`

---

## 📜 Licença

Propriedade de **Coderia.dev** — Todos os direitos reservados.
Implementação original com base em conceitos abertos de motion design e interfaces colaborativas.
