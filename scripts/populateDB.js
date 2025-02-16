const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function populateDatabase() {
  try {
    await client.connect();
    const db = client.db("avaliakids");

    await db.collection("users").deleteMany({});
    await db.collection("students").deleteMany({});
    await db.collection("questions").deleteMany({});
    await db.collection("quiz_answers").deleteMany({});

    console.log("✅ Banco de dados limpo!");

    const hashedPassword = bcrypt.hashSync("123456", 10);
    const users = [
      { name: "Carlos Educador", email: "professor@avaliakids.com", password: hashedPassword, role: "TEACHER" },
      { name: "Mariana Responsável", email: "parent@avaliakids.com", password: hashedPassword, role: "PARENT" },
    ];
    
    const userInsertResult = await db.collection("users").insertMany(users);
    console.log("✅ Usuários criados!");

    const parentId = userInsertResult.insertedIds[1].toString();

    console.log(`✅ PARENT_ID recuperado: ${parentId}`);
    
    const students = [
      { name: "Ana Oliveira", birthDate: "10/03/2018", className: "1º Ano", parentId },
      { name: "Lucas Mendes", birthDate: "15/07/2017", className: "2º Ano", parentId },
      { name: "Rafaela Costa", birthDate: "20/09/2016", className: "3º Ano", parentId },
      { name: "Gabriel Souza", birthDate: "02/05/2015", className: "4º Ano", parentId },
    ];
    
    await db.collection("students").insertMany(students);
    console.log("✅ Estudantes criados!");    

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
        "Ciências": [
          { text: "Qual animal mia?", options: ["Cachorro", "Gato", "Pato", "Leão"], correctOption: "Gato" },
        ],
        "História": [
          { text: "Quem foi o primeiro presidente do Brasil?", options: ["Getúlio Vargas", "Marechal Deodoro", "Juscelino Kubitschek", "Lula"], correctOption: "Marechal Deodoro" },
        ],
      },
      "2º Ano": {
        "Matemática": [
          { text: "Quanto é 7 - 2?", options: ["3", "4", "5", "6"], correctOption: "5" },
        ],
        "Português": [
          { text: "Qual a palavra correta?", options: ["Caza", "Casa", "Cassa", "Cassa"], correctOption: "Casa" },
        ],
        "Ciências": [
          { text: "O que a planta precisa para crescer?", options: ["Água e Sol", "Somente água", "Somente sombra", "Somente vento"], correctOption: "Água e Sol" },
        ],
        "História": [
          { text: "Qual é a capital do Brasil?", options: ["Rio de Janeiro", "Brasília", "São Paulo", "Salvador"], correctOption: "Brasília" },
        ],
      },
      "3º Ano": {
        "Matemática": [
          { text: "Quanto é 6 × 3?", options: ["12", "15", "18", "20"], correctOption: "18" },
        ],
        "Português": [
          { text: "Qual dessas palavras tem acento?", options: ["Café", "Chapeu", "Tatu", "Gato"], correctOption: "Café" },
        ],
        "Ciências": [
          { text: "Qual o maior planeta do sistema solar?", options: ["Marte", "Terra", "Júpiter", "Vênus"], correctOption: "Júpiter" },
        ],
        "História": [
          { text: "Quem descobriu o Brasil?", options: ["Pedro Álvares Cabral", "Cristóvão Colombo", "Dom Pedro I", "Tiradentes"], correctOption: "Pedro Álvares Cabral" },
        ],
      },
      "4º Ano": {
        "Matemática": [
          { text: "Qual o resultado de 15 ÷ 3?", options: ["2", "3", "5", "6"], correctOption: "5" },
        ],
        "Português": [
          { text: "Qual dessas palavras está escrita corretamente?", options: ["Xicará", "Chicara", "Xícara", "Xicá"], correctOption: "Xícara" },
        ],
        "Ciências": [
          { text: "O que os pulmões fazem?", options: ["Bombeiam sangue", "Filtram impurezas", "Fazem a digestão", "Ajudam na respiração"], correctOption: "Ajudam na respiração" },
        ],
        "História": [
          { text: "Qual foi o ano da Independência do Brasil?", options: ["1500", "1822", "1889", "1945"], correctOption: "1822" },
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
              imageUrl: `https://firebasestorage.googleapis.com/v0/b/avaliakids.firebasestorage.app/o/questions%2F${normalizedClassLevel}_${normalizedMateria}_${index}.png?alt=media`,
              classLevel: classLevel,
            });
          });
        }
      }      

    await db.collection("questions").insertMany(questions);
    console.log("✅ Questões cadastradas!");

  } catch (error) {
    console.error("❌ Erro ao popular o banco:", error);
  } finally {
    await client.close();
  }
}

populateDatabase();
