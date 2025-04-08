import { useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "studentIDCards";

export function useIdCards() {
  const [savedCards, setSavedCards] = useState([]);

  // Load cards from localStorage on first render
  useEffect(() => {
    try {
      const storedCards = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedCards) {
        setSavedCards(JSON.parse(storedCards));
      }
    } catch (error) {
      console.error("Error loading cards from localStorage:", error);
    }
  }, []);

  // Save a new ID card
  const saveIdCard = (data) => {
    const updatedCards = [data, ...savedCards.filter(card => card.timestamp !== data.timestamp)];
    
    // Limit to 10 saved cards
    const limitedCards = updatedCards.slice(0, 10);
    
    setSavedCards(limitedCards);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(limitedCards));
  };

  // Remove an ID card
  const removeIdCard = (index) => {
    const updatedCards = [...savedCards];
    updatedCards.splice(index, 1);
    setSavedCards(updatedCards);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCards));
  };

  return {
    savedCards,
    saveIdCard,
    removeIdCard,
  };
}