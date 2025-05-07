## 👥 **Integrantes do Grupo**

- 👨‍💻 **Rafael Andrade Prado** - [@rafael-iftm](https://github.com/rafael-iftm)  
- 👨‍💻 **Lucas José Arantes Silva** - [@LucasJoseArantes](https://github.com/LucasJoseArantes)
- 👨‍💻 **Ezequiel de Oliveira Santana** - [@gabrieelaoliv](https://github.com/gabrieelaoliv)
- 👩‍💻 **Gabriela de Oliveira Ferreira** - [@EzequielOS](https://github.com/EzequielOS)

## 📚 Documentações do Projeto

1. 📑 [**Documentação do App Diagnóstico de Introdução**](https://docs.google.com/document/d/1THPYEIUaSC15rjibWeJmcnnHxD8x3AJMOqJuseEhaTo/edit?usp=sharing)  
   Detalhes completos sobre o aplicativo de diagnóstico educacional, incluindo requisitos funcionais, interfaces, e o público-alvo de crianças entre 6 e 10 anos. Contém especificações de acessibilidade, gamificação e layout adaptado para um ambiente lúdico e interativo.  
   📂 Também disponível na pasta: `📦 doc/app-diagnostico-de-introducao`

2. 📦 [**Documentação da API e Payloads**](https://docs.google.com/document/d/13IP7fUWq2S4QqGz-Dw2eXgu5wZH0xhV3hncvay0K_Nw/edit?usp=sharing)  
   Estrutura detalhada dos endpoints RESTful, exemplos de payloads JSON e integrações com banco de dados (MongoDB), cobrindo autenticação, gestão de questões, respostas, diagnósticos, e logs de sistema.  
   📂 Também disponível na pasta: `📦 doc/documentacao-da-api`

3. 🎨 [**Protótipo do Figma**](https://www.figma.com/design/jQ54fsqZ8SFVmVj9nRLiAN/Projeto?node-id=0-1&p=f&t=hpiOFsjn0FL65iJv-0)  
   Visualização do protótipo das telas do aplicativo, incluindo a tela de avaliação, início e resultado.  
   📂 Também disponível na pasta: `📦 doc/prototipo/v1`

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

### 4. Configurando o arquivo .env
Para que o aplicativo mobile se conecte corretamente ao backend local, você deve informar o IP da sua máquina na rede.

1. Execute no terminal:

   ```bash
   ipconfig
   ```

2. Localize o Adaptador de Rede sem Fio Wi-Fi e copie o valor do Endereço IPv4.

   ```bash
   Endereço IPv4. . . . . . . . : 172.20.10.6
   ```

3. Altere a constante API_BASE_URL no arquivo .env na raiz do projeto com o endereço IPv4 na porta 8080:

   ```bash
   API_BASE_URL=http://172.20.10.6:8080
   ```

### 5. **Executando o Projeto**
Inicie o servidor do Expo:

```bash
npm run start
```
### 6. **Executando no Dispositivo**
1. No terminal, será exibido um QR Code.
2. Abra o aplicativo **Expo Go** no seu dispositivo.
3. Escaneie o QR Code para carregar o app no dispositivo.
