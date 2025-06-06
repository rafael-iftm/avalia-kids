# 📚 Avalia Kids

Plataforma de diagnóstico educacional gamificado, voltada para crianças entre 6 e 10 anos. O sistema é composto por um **aplicativo mobile** (frontend) desenvolvido com **Expo/React Native** e um **backend** baseado em microsserviços Java Spring Boot com banco **MongoDB**.

## 🧠 Objetivo

Oferecer uma ferramenta interativa que permite professores, gestores e pedagogos avaliarem o nível de aprendizagem dos alunos por meio de quizzes e diagnósticos lúdicos.

## 🗂 Estrutura do Projeto

```bash
avalia-kids/
├── frontend/           # Aplicativo mobile com React Native + Expo
└── backend/            # Microsserviços Java com Spring Boot + MongoDB (Docker)
```

## 🛠️ Requisitos

### Para o Frontend
- [Node.js v18+](https://nodejs.org/pt/download)
- Dispositivo com o aplicativo **Expo Go** (Android/iOS)

### Para o Backend
- [Java v17+](https://adoptium.net/temurin/releases/)
- [Docker e Docker Compose](https://docs.docker.com/compose/install/)

## 🚀 Como executar o projeto

### 🔹 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/avalia-kids
cd avalia-kids
```

### 🔹 2. Subir o Backend

```bash
cd backend
```

```bash
docker-compose up --build
```

- Aguarde os containers serem inicializados.
- O Eureka Server estará acessível em [http://localhost:8761](http://localhost:8761)

### 🔹 3. Subir o Frontend

1. **Instalando Dependências**

    ```bash
    cd frontend
    ```

    ```bash
    npm install --legacy-peer-deps
    ```

    Obs: se o seu ambiente está configurado para usar algum registro privado do CodeArtifact (AWS), rode o comando abaixo para que o `npm` use o repositório público padrão:

    ```bash
    npm config set registry https://registry.npmjs.org/
    ```

2. **Configurando o arquivo .env**

   ```bash
   ipconfig
   ```

    Localize o Adaptador de Rede sem Fio Wi-Fi e copie o valor do Endereço IPv4.

   ```bash
   Endereço IPv4. . . . . . . . : 172.20.10.6
   ```

    Altere a constante API_BASE_URL no arquivo .env na raiz do projeto com o endereço IPv4 na porta 8080:

   ```bash
   API_BASE_URL=http://172.20.10.6:8080
   ```

3. **Executando o Projeto**

    Inicie o servidor do Expo:

    ```bash
    npm run start
    ```

- Um QR Code será exibido no terminal.
- Escaneie com o aplicativo **Expo Go** no seu celular.

## 📎 Documentação Complementar

- [Documentação do App Diagnóstico de Introdução](https://docs.google.com/document/d/1THPYEIUaSC15rjibWeJmcnnHxD8x3AJMOqJuseEhaTo)
- [Documentação da API e Payloads](https://docs.google.com/document/d/13IP7fUWq2S4QqGz-Dw2eXgu5wZH0xhV3hncvay0K_Nw)
- [Protótipo no Figma](https://www.figma.com/design/jQ54fsqZ8SFVmVj9nRLiAN/Projeto?node-id=0-1&p=f&t=hpiOFsjn0FL65iJv-0)

---

## 👥 Integrantes do Grupo

- 👨‍💻 Rafael Andrade Prado - [@rafael-iftm](https://github.com/rafael-iftm)
- 👨‍💻 Lucas José Arantes Silva - [@LucasJoseArantes](https://github.com/LucasJoseArantes)

## 📝 Licença

Este projeto é apenas para fins acadêmicos.
