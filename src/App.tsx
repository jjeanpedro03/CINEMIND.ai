import React, { useState } from 'react';
import { mockMovies, askAI } from './services/api';
import { Sparkles, Search, Film, Star } from 'lucide-react';

export default function App() {
  const [movies, setMovies] = useState(mockMovies);
  const [search, setSearch] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiHeadline, setAiHeadline] = useState('Filmes em Destaque');

  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleAISearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    
    setIsAiLoading(true);
    const result = await askAI(aiPrompt);
    setMovies(result);
    setAiHeadline(`Recomendações da IA para: "${aiPrompt}"`);
    setIsAiLoading(false);
    setAiPrompt('');
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-50 font-sans flex flex-col antialiased">
      {/* Navbar ocupando toda a largura */}
      <header className="w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-8 py-4 flex justify-between items-center gap-4">
        <div className="flex items-center gap-1 font-bold text-2xl tracking-tight select-none">
          <Film className="text-indigo-500 w-7 h-7 mr-1" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">CINE</span>
          <span className="text-white">MIND.ai</span>
        </div>
        
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Buscar no catálogo..." 
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-full pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </header>

      {/* Container Principal */}
      <main className="flex-grow w-full max-w-[100vw] px-8 py-10 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 max-w-3xl mx-auto py-8 flex flex-col items-center">
          {/* Ajuste definitivo aplicado aqui para corrigir o ponto de interrogação cortado pelo gradiente */}
          <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent leading-relaxed py-4 px-2">
            Não sabe o que assistir? <br />Deixe a IA decidir.
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xl">
            Digite seu humor ou gênero e nossa inteligência artificial encontra o filme perfeito.
          </p>

          <form onSubmit={handleAISearch} className="w-full flex gap-2 p-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl focus-within:border-indigo-500 transition">
            <input 
              type="text"
              placeholder="Ex: Um filme no espaço com muita tensão e reviravoltas..."
              value={aiPrompt}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAiPrompt(e.target.value)}
              className="flex-1 bg-transparent px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            <button 
              type="submit"
              disabled={isAiLoading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 text-sm transition shrink-0 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
              {isAiLoading ? 'Pensando...' : 'Perguntar à IA'}
            </button>
          </form>
        </section>

        {/* Listagem de Filmes */}
        <section className="space-y-6 w-full">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-bold tracking-wide text-slate-100">{aiHeadline}</h2>
            {movies.length !== mockMovies.length && (
              <button 
                onClick={() => { setMovies(mockMovies); setAiHeadline('Filmes em Destaque'); }}
                className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition"
              >
                Resetar Filtros
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
            {filteredMovies.map(movie => (
              <div key={movie.id} className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition duration-300 hover:-translate-y-2 flex flex-col shadow-xl">
                <div className="relative aspect-[2/3] bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-800">
                  {movie.image && (
                    <img 
                      src={movie.image} 
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  )}
                  <span className="absolute top-4 right-4 bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-amber-400 flex items-center gap-1 border border-slate-800 shadow-md z-10">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {movie.rating}
                  </span>
                </div>
                
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400">{movie.genre}</span>
                    <h3 className="font-bold text-xl text-slate-100 leading-tight mt-1 group-hover:text-indigo-400 transition">{movie.title}</h3>
                  </div>
                  <p className="text-sm text-slate-400 line-clamp-3 pt-3 border-t border-slate-800/60 leading-relaxed">{movie.overview}</p>
                </div>
              </div>
            ))}
          </div>
          
          {filteredMovies.length === 0 && (
            <div className="text-center py-24 text-slate-500 text-lg font-medium">
              Nenhum filme encontrado para a sua busca.
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800 bg-slate-900 px-8 py-5 text-center text-sm text-slate-500 font-medium">
        &copy; 2026 CINEMIND.ai. Todos os direitos reservados.
      </footer>
    </div>
  );
}