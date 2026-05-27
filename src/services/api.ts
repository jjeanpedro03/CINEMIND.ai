import { GoogleGenerativeAI } from '@google/generative-ai';

// Importando os arquivos locais da sua pasta assets
import interstellarImg from '../assets/Interstellar.png';
import origemImg from '../assets/A Origem.webp';
import batmanImg from '../assets/Batman O Cavaleiro das Trevas.webp';
import whiplashImg from '../assets/Whiplash.jpg';

export interface Movie {
  id: number;
  title: string;
  genre: string;
  rating: number;
  image: string;
  overview: string;
}

export const mockMovies: Movie[] = [
  { 
    id: 1, 
    title: "Interstellar", 
    genre: "Ficção Científica", 
    rating: 8.7, 
    image: interstellarImg, 
    overview: "As aventuras de um grupo de exploradores que utilizam um buraco de minhoca recém-descoberto para superar os limites do viagem espacial humana." 
  },
  { 
    id: 2, 
    title: "A Origem", 
    genre: "Ficção Científica", 
    rating: 8.8, 
    image: origemImg, 
    overview: "Um ladrão que rouba segredos corporativos por meio do uso de tecnologia de compartilhamento de sonhos recebe a tarefa inversa de plantar uma ideia na mente de um CEO." 
  },
  { 
    id: 3, 
    title: "Batman: O Cavaleiro das Trevas", 
    genre: "Ação", 
    rating: 9.0, 
    image: batmanImg, 
    overview: "Quando a ameaça conhecida como O Coringa surge de seu passado, ela causa estragos e caos no povo de Gotham, testando a justiça do herói." 
  },
  { 
    id: 4, 
    title: "Whiplash", 
    genre: "Drama", 
    rating: 8.5, 
    image: whiplashImg, 
    overview: "Um jovem baterista promissor se matricula em um conservatório de música de elite onde seus sonhos de grandeza são orientados por um instrutor implacável." 
  }
];

// Inicialização para o ambiente do Vite
const aiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(aiKey || '');

export const askAI = async (prompt: string): Promise<Movie[]> => {
  if (!aiKey) {
    console.warn("Chave API do Gemini não encontrada no arquivo .env.local. Usando comportamento padrão.");
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockMovies;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const moviesContext = mockMovies.map(m => `ID: ${m.id} | Título: ${m.title} | Gênero: ${m.genre} | Sinopse: ${m.overview}`).join('\n');

    const systemInstruction = `
      Você é o motor de busca inteligente do app CINEMIND.ai.
      Sua tarefa é analisar o desejo, humor ou gênero digitado pelo usuário e recomendar quais filmes da nossa lista abaixo combinam com o pedido.
      
      Lista de filmes disponíveis:
      ${moviesContext}

      Regras estritas:
      1. Analise o contexto e retorne uma lista contendo APENAS os IDs dos filmes recomendados (Exemplo de formato de saída esperado: [1, 3]).
      2. Se o usuário pedir algo sobre música, bateria, obsessão, treino ou drama intenso, você deve associar estritamente ao filme Whiplash e retornar APENAS o ID [4].
      3. Se nenhum filme combinar perfeitamente, retorne todos os IDs [1, 2, 3, 4] como sugestão geral.
      4. Sua resposta deve ser EXCLUSIVAMENTE um array de números no formato JSON válido. Não inclua nenhuma palavra explicativa, introdução ou blocos de código markdown. Apenas os colchetes e os números internos.
    `;

    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      systemInstruction: systemInstruction,
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json"
      }
    });

    const cleanText = response.response.text().trim();
    console.log("Resposta estruturada da IA:", cleanText);

    const recommendedIds: number[] = JSON.parse(cleanText);
    const matchedMovies = mockMovies.filter(movie => recommendedIds.includes(movie.id));
    
    return matchedMovies.length > 0 ? matchedMovies : mockMovies;

  } catch (error) {
    console.error("Erro na comunicação com o Gemini API:", error);
    return mockMovies;
  }
};