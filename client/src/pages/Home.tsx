import { useState } from "react";
import StudentForm from "@/components/StudentForm";
import IDCardPreview from "@/components/IDCardPreview";
import SavedCardsModal from "@/components/SavedCardsModal";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { HistoryIcon } from "lucide-react";
import { StudentData, TemplateType } from "@/lib/types";
import { useIdCards } from "@/hooks/use-id-cards";

const Home = () => {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const { saveIdCard } = useIdCards();

  const handleFormSubmit = (data: StudentData) => {
    setStudentData(data);
    saveIdCard(data);
    toast({
      title: "Success!",
      description: "ID Card generated successfully!",
      variant: "default",
    });
  };

  const handleTemplateChange = (template: TemplateType) => {
    if (studentData) {
      setStudentData({ ...studentData, template });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-semibold">Smart Student ID Generator</h1>
          <div className="flex items-center space-x-2">
            <Button 
              variant="secondary" 
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-primary hover:bg-gray-100 transition"
            >
              <HistoryIcon className="h-4 w-4 mr-1" />
              Saved Cards
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <StudentForm 
            onSubmit={handleFormSubmit} 
            onTemplateChange={handleTemplateChange}
            initialData={studentData} 
          />
          <IDCardPreview studentData={studentData} />
        </div>
      </main>

      <SavedCardsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelectCard={setStudentData}
      />
    </div>
  );
};

export default Home;
