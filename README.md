## 📚 Documentações do Projeto

1. 📑[**Documentação do App Diagnóstico de Introdução**](https://docs.google.com/document/d/1THPYEIUaSC15rjibWeJmcnnHxD8x3AJMOqJuseEhaTo/edit?usp=sharing)  
   Detalhes completos sobre o aplicativo de diagnóstico educacional, incluindo requisitos funcionais, interfaces, e o público-alvo de crianças entre 6 e 10 anos. Contém especificações de acessibilidade, gamificação e layout adaptado para um ambiente lúdico e interativo.

2. 📦[**Documentação da API e Payloads**](https://docs.google.com/document/d/13IP7fUWq2S4QqGz-Dw2eXgu5wZH0xhV3hncvay0K_Nw/edit?usp=sharing)  
   Estrutura detalhada dos endpoints RESTful, exemplos de payloads JSON e integrações com banco de dados (MongoDB), cobrindo autenticação, gestão de questões, respostas, diagnósticos, e logs de sistema.

## 🛠️ **Como Executar**

### 1. **Pré-requisitos**
- Node.js instalado na máquina.
- Expo CLI globalmente instalado:

```bash
npm install -g expo-cli
```

- Aplicativo **Expo Go** instalado no dispositivo móvel (disponível para [Android](https://play.google.com/store/apps/details?id=host.exp.exponent) e [iOS](https://apps.apple.com/app/expo-go/id982107779)).

### 2. **Clonando o Repositório**
Clone este repositório em sua máquina:

```bash
git clone https://github.com/rafael-iftm/avalia-kids
```

### 3. **Instalando Dependências**
Execute o seguinte comando no diretório do projeto:

```bash
npm install
```

### 4. **Executando o Projeto**
Inicie o servidor do Expo:

```bash
npx expo start --tunnel
```
### 5. **Executando no Dispositivo**
1. No terminal, será exibido um QR Code.
2. Abra o aplicativo **Expo Go** no seu dispositivo.
3. Escaneie o QR Code para carregar o app no dispositivo.
