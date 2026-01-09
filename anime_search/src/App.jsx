import React, { useEffect, useState } from "react";
import SearchInput from "./SearchInput";
import "./styles.css";

const api = "https://kitsu.io/api/edge/";

export default function App() {
  const [text, setText] = useState("");
  const [info, setInfo] = useState({});
  // Estado para guardar o anime clicado, para saber quando mostrar os detalhes
  const [selectedAnime, setSelectedAnime] = useState(null);

  useEffect(() => {
    if (text) {
      setInfo({});
      fetch(`${api}anime?filter[text]=${text}&page[limit]=12`)
        .then((response) => response.json())
        .then((response) => {
          setInfo(response);
        });
    }
  }, [text]);

  return (
    <div className="App">
      <h1>Animes</h1>
      <SearchInput value={text} onChange={(search) => setText(search)} />

      {text && !info.data && <span>Carregando...</span>}

      {/* Lista de animes */}
      {info.data && (
        <ul className="animes-list">
          {info.data.map((anime) => (
            <li key={anime.id} onClick={() => setSelectedAnime(anime)} style={{ cursor: 'pointer' }}>
              <img
                src={anime.attributes.posterImage.small}
                alt={anime.attributes.canonicalTitle}
              />
              {anime.attributes.canonicalTitle}
            </li>
          ))}
        </ul>
      )}

      {/* DETALHES */}
      {selectedAnime && (
        <div className="modal-overlay" onClick={() => setSelectedAnime(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setSelectedAnime(null)}>X</button>
            
            <div className="modal-body">
              <img 
                src={selectedAnime.attributes.posterImage.medium} 
                alt={selectedAnime.attributes.canonicalTitle} 
              />
              <div className="info">
                <h2>{selectedAnime.attributes.canonicalTitle}</h2>
                <p><strong>Sinopse:</strong> {selectedAnime.attributes.synopsis}</p>
                <p><strong>Nota:</strong> {selectedAnime.attributes.averageRating}%</p>
                <p><strong>Status:</strong> {selectedAnime.attributes.status}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}