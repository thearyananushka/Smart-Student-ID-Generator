import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, CreditCard } from "lucide-react";
import { useState, useRef } from "react";
import { toPng } from "html-to-image";
import { useToast } from "@/hooks/use-toast";
import ModernTemplate from "./ModernTemplate";
import ClassicTemplate from "./ClassicTemplate";
import { StudentData } from "@/lib/types";

interface IDCardPreviewProps {
  studentData: StudentData | null;
}

const IDCardPreview = ({ studentData }: IDCardPreviewProps) => {
  const toast = useToast();
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloadingCard, setDownloadingCard] = useState(false);

  const downloadCard = async () => {
    if (!cardRef.current) return;
    
    try {
      setDownloadingCard(true);
      
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        quality: 1.0,
        pixelRatio: 2,
      });
      
      const link = document.createElement("a");
      link.download = `student-id-${studentData?.studentName.replace(/\s+/g, "-").toLowerCase() || "card"}.png`;
      link.href = dataUrl;
      link.click();
      
      toast.toast({
        title: "Success!",
        description: "ID Card downloaded successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error downloading card:", error);
      toast.toast({
        title: "Error",
        description: "Failed to download ID card. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloadingCard(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h2 className="text-xl font-semibold text-gray-800">ID Card Preview</h2>
          <div className="flex space-x-2">
            <Button
              variant="default"
              onClick={downloadCard}
              disabled={!studentData || downloadingCard}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          {!studentData ? (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg w-full max-w-md mx-auto">
              <CreditCard className="text-gray-400 h-12 w-12 mb-4" />
              <p className="text-gray-500 text-center">Fill and submit the form to generate a student ID card preview here</p>
            </div>
          ) : (
            <div ref={cardRef} className="w-full max-w-md mx-auto">
              {studentData.template === "modern" ? (
                <ModernTemplate studentData={studentData} />
              ) : (
                <ClassicTemplate studentData={studentData} />
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IDCardPreview;
