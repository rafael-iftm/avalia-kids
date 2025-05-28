const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

// URLs de conexão para os bancos de cada microserviço
const databases = {
  users: "mongodb://localhost:27017/avaliakids-auth",
  students: "mongodb://localhost:27017/avaliakids-students",
  questions: "mongodb://localhost:27017/avaliakids-questions",
  quiz: "mongodb://localhost:27017/avaliakids-quizzes",
};

// Criar clientes para cada banco
const clients = {
  users: new MongoClient(databases.users),
  students: new MongoClient(databases.students),
  questions: new MongoClient(databases.questions),
  quiz: new MongoClient(databases.quiz),
};

async function populateDatabase() {
  try {
    // Conectar a todos os bancos
    await Promise.all(Object.values(clients).map(client => client.connect()));

    console.log("✅ Conectado aos bancos de dados!");

    // Obter as referências dos bancos
    const dbUsers = clients.users.db();
    const dbStudents = clients.students.db();
    const dbQuestions = clients.questions.db();
    const dbQuiz = clients.quiz.db();

    // Limpar coleções de cada banco
    await Promise.all([
      dbUsers.collection("users").deleteMany({}),
      dbStudents.collection("students").deleteMany({}),
      dbQuestions.collection("questions").deleteMany({}),
      dbQuiz.collection("quizzes").deleteMany({}),
    ]);

    console.log("✅ Bancos de dados limpos!");

    // Criar usuários (banco users)
    const hashedPassword = bcrypt.hashSync("123456", 10);
    const users = [
      { name: "Carlos Educador", email: "professor@avaliakids.com", password: hashedPassword, role: "TEACHER" },
      { name: "Mariana Responsável", email: "parent@avaliakids.com", password: hashedPassword, role: "PARENT" },
    ];

    const userInsertResult = await dbUsers.collection("users").insertMany(users);
    console.log("✅ Usuários criados!");

    const parentId = userInsertResult.insertedIds[1].toString();
    console.log(`✅ PARENT_ID recuperado: ${parentId}`);

    // Criar estudantes (banco students)
    const students = [
      { name: "Ana Oliveira", birthDate: "10/03/2018", className: "1º Ano", parentId },
      { name: "Lucas Mendes", birthDate: "15/07/2017", className: "2º Ano", parentId },
      { name: "Rafaela Costa", birthDate: "20/09/2016", className: "3º Ano", parentId },
      { name: "Gabriel Souza", birthDate: "02/05/2015", className: "4º Ano", parentId },
    ];

    await dbStudents.collection("students").insertMany(students);
    console.log("✅ Estudantes criados!");

    // Criar questões (banco questions)
    const questions = [];
    const materias = ["Matemática", "Português", "Ciências", "História"];

    const perguntasPorSerie = {
      "1º Ano": {
        "Matemática": [
          { text: "Quanto é 2 + 3?", options: ["3", "4", "5", "6"], correctOption: "5" },
          { text: "Qual número vem depois do 8?", options: ["6", "7", "9", "10"], correctOption: "9" },
        ],
        "Português": [
          { text: "Qual dessas palavras começa com a letra 'A'?", options: ["Bola", "Arroz", "Cadeira", "Dado"], correctOption: "Arroz" },
        ],
      },
      "2º Ano": {
        "Matemática": [
          { text: "Quanto é 7 - 2?", options: ["3", "4", "5", "6"], correctOption: "5" },
        ],
        "Ciências": [
          { text: "O que a planta precisa para crescer?", options: ["Água e Sol", "Somente água", "Somente sombra", "Somente vento"], correctOption: "Água e Sol" },
        ],
      },
    };

    function normalizeFileName(text) {
      return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/º/g, "")
        .replace(/\s/g, "")
        .replace(/[^a-zA-Z0-9_]/g, "");
    }

    for (const [classLevel, materias] of Object.entries(perguntasPorSerie)) {
      for (const [materia, perguntas] of Object.entries(materias)) {
        perguntas.forEach((pergunta, index) => {
          const normalizedClassLevel = normalizeFileName(classLevel);
          const normalizedMateria = normalizeFileName(materia);

          questions.push({
            text: pergunta.text,
            options: pergunta.options,
            correctOption: pergunta.correctOption,
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/avaliakids.firebasestorage.app/o/questions%2F${normalizedClassLevel}_${normalizedMateria}_${index}.jpeg?alt=media`,
            classLevel: classLevel,
          });
        });
      }
    }

    await dbQuestions.collection("questions").insertMany(questions);
    console.log("✅ Questões cadastradas!");

  } catch (error) {
    console.log("❌ Erro ao popular o banco:", error);
  } finally {
    // Fechar conexão com todos os bancos
    await Promise.all(Object.values(clients).map(client => client.close()));
    console.log("✅ Conexões com os bancos fechadas!\n");
  }
}

// Executar o script
populateDatabase();
