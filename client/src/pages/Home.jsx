import { useState, useEffect } from "react";
import { Grid } from "lucide-react";
import StudentForm from "@/components/StudentForm";
import IDCardPreview from "@/components/IDCardPreview";
import { useToast } from "@/hooks/use-toast";
import { useIdCards } from "@/hooks/use-id-cards";
import { Button } from "@/components/ui/button";
import SavedCardsModal from "@/components/SavedCardsModal";

const Home = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [studentData, setStudentData] = useState(null);
  const [showSavedCards, setShowSavedCards] = useState(false);
  
  const { toast } = useToast();
  const { saveIdCard } = useIdCards();

  const handleFormSubmit = (data) => {
    setStudentData(data);
    
    // Save to localStorage
    saveIdCard(data);
    
    toast({
      title: "ID Card Generated",
      description: "Your ID card has been generated and saved successfully.",
      variant: "default",
    });
  };

  const handleTemplateChange = (template) => {
    setSelectedTemplate(template);
    
    if (studentData) {
      setStudentData({
        ...studentData,
        template
      });
    }
  };

  const handleCardSelect = (card) => {
    setStudentData(card);
    setSelectedTemplate(card.template);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Smart Student ID Generator</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Generate customized student ID cards with different templates, QR codes, and more.
        </p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Student Details</h2>
            <Button 
              variant="outline" 
              onClick={() => setShowSavedCards(true)}
              className="flex items-center gap-1"
            >
              <Grid className="h-4 w-4" />
              View Saved Cards
            </Button>
          </div>
          <StudentForm 
            onSubmit={handleFormSubmit} 
            onTemplateChange={handleTemplateChange}
            initialData={studentData}
          />
        </div>
        
        <div>
          <IDCardPreview 
            studentData={studentData}
          />
        </div>
      </div>
      
      <SavedCardsModal 
        isOpen={showSavedCards}
        onClose={() => setShowSavedCards(false)}
        onSelectCard={handleCardSelect}
      />
    </div>
  );
};

export default Home;