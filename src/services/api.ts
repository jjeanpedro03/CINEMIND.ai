//import { GoogleGenerativeAI } from '@google/generative-ai';

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

// MODO DEMONSTRAÇÃO: A API não será chamada para não travar o vídeo
export const askAI = async (prompt: string): Promise<Movie[]> => {
  console.log("Modo demonstração ativado: IA simulada.");
  
  // Simula um delay de "processamento" da IA
  await new Promise(resolve => setTimeout(resolve, 600));

  const lowerPrompt = prompt.toLowerCase();
  
  // Lógica de filtragem rápida para o vídeo
  if (lowerPrompt.includes('ação') || lowerPrompt.includes('batman')) {
    return mockMovies.filter(m => m.id === 3);
  } 
  
  if (lowerPrompt.includes('ficção') || lowerPrompt.includes('interstellar') || lowerPrompt.includes('origem')) {
    return mockMovies.filter(m => m.id === 1 || m.id === 2);
  }
  
  if (lowerPrompt.includes('drama') || lowerPrompt.includes('bateria') || lowerPrompt.includes('whiplash')) {
    return mockMovies.filter(m => m.id === 4);
  }

  return mockMovies;
};