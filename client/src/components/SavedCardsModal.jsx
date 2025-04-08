import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useIdCards } from "@/hooks/use-id-cards";
import { Trash2, Eye, FolderOpen } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const SavedCardsModal = ({ isOpen, onClose, onSelectCard }) => {
  const { savedCards, removeIdCard } = useIdCards();
  const { toast } = useToast();
  const [isDeletingCard, setIsDeletingCard] = useState(null);

  const handleDeleteCard = (index, timestamp) => {
    setIsDeletingCard(timestamp);
    setTimeout(() => {
      removeIdCard(index);
      toast({
        title: "Card Deleted",
        description: "The ID card has been deleted successfully.",
        variant: "default",
      });
      setIsDeletingCard(null);
    }, 300);
  };

  const handleViewCard = (card) => {
    onSelectCard(card);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Saved ID Cards</DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto">
          {savedCards.length === 0 ? (
            <div className="py-8 text-center">
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No saved ID cards found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedCards.map((card, index) => (
                <div 
                  key={card.timestamp} 
                  className={`border rounded-lg p-3 flex items-center justify-between transition-opacity duration-300 ${
                    isDeletingCard === card.timestamp ? 'opacity-50' : 'opacity-100'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden mr-3 flex items-center justify-center">
                      {card.photo ? (
                        <img src={card.photo} alt={card.studentName} className="w-full h-full object-cover" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{card.studentName}</p>
                      <p className="text-sm text-gray-500">
                        Class {card.class}-{card.division} • Roll №{card.rollNumber}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewCard(card)}
                      className="text-primary hover:text-blue-700"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteCard(index, card.timestamp)}
                      disabled={isDeletingCard === card.timestamp}
                      className="text-destructive hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SavedCardsModal;