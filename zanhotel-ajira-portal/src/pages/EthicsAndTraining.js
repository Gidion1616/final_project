import React, { useEffect, useState } from "react";

const EthicsAndTraining = () => {
  const [cards, setCards] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/training/list/");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setCards(data);
      } catch (err) {
        setError(err.message);
        setCards([]);
      }
    };
    fetchData();
  }, []);

  if (cards === null) {
    return (
      <div className="p-10 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Loading training programs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center bg-red-50 p-6 rounded-lg max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Data</h2>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">
        Ethics & Training Programs
      </h1>
      {cards.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No training programs available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-screen-lg mx-auto px-4 justify-items-center">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow max-w-sm w-full flex flex-col items-center"
            >
              {/* Image */}
              {card.image ? (
                <div className="w-full max-w-xs h-auto overflow-hidden rounded-lg mb-4">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-auto object-contain"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                </div>
              ) : (
                <div className="w-full max-w-xs h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              {/* Title */}
              <h2 className="text-xl font-semibold text-gray-800 mb-3 text-center">
                {card.title}
              </h2>
              {/* Description */}
              {card.description && (
                <p className="text-gray-600 mb-4 text-center">{card.description}</p>
              )}
              {/* Items */}
              {card.items && (
                <ul className="space-y-2 w-full">
                  {card.items.split(",").map((item, j) => (
                    <li key={j} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-gray-700">{item.trim()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EthicsAndTraining;
