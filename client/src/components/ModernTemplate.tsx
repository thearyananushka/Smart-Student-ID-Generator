import { QRCodeSVG } from "qrcode.react";
import { StudentData } from "@/lib/types";

interface ModernTemplateProps {
  studentData: StudentData;
}

const ModernTemplate = ({ studentData }: ModernTemplateProps) => {
  const { 
    studentName, 
    rollNumber, 
    class: studentClass, 
    division, 
    photo, 
    rackNumber, 
    busRoute, 
    allergies = [] 
  } = studentData;

  // Create a clean JSON string for QR code
  const qrCodeData = JSON.stringify({
    name: studentName,
    rollNumber,
    class: studentClass,
    division,
    rackNumber,
    busRoute,
    allergies
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-xl">UNITY SCHOOL</h3>
            <p className="text-sm font-light">Student Identification Card</p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-75">Academic Year</p>
            <p className="font-semibold">2023-2024</p>
          </div>
        </div>
      </div>
      
      {/* Card Body */}
      <div className="p-4">
        <div className="flex">
          <div className="w-28 h-32 bg-gray-100 rounded overflow-hidden mr-4 border border-gray-200">
            {photo ? (
              <img 
                src={photo} 
                alt={studentName} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-800">{studentName}</h3>
            <div className="space-y-2 mt-2">
              <div className="grid grid-cols-2 text-sm">
                <p className="text-gray-500">Roll No:</p>
                <p className="font-medium text-gray-700">{rollNumber}</p>
              </div>
              <div className="grid grid-cols-2 text-sm">
                <p className="text-gray-500">Class:</p>
                <p className="font-medium text-gray-700">{`${studentClass}-${division}`}</p>
              </div>
              <div className="grid grid-cols-2 text-sm">
                <p className="text-gray-500">Rack Number:</p>
                <p className="font-medium text-gray-700">{rackNumber}</p>
              </div>
              <div className="grid grid-cols-2 text-sm">
                <p className="text-gray-500">Bus Route:</p>
                <p className="font-medium text-gray-700">{busRoute}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Allergies */}
        {allergies.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-semibold text-gray-500 uppercase">Allergies:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {allergies.map((allergy) => (
                <span 
                  key={allergy} 
                  className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded"
                >
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Footer with QR */}
        <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            <p>If found, please return to:</p>
            <p className="font-medium text-gray-700">Unity School, 123 Education St.</p>
            <p>Phone: (555) 123-4567</p>
          </div>
          <div className="w-20 h-20 border border-gray-200 flex items-center justify-center bg-white p-1">
            <QRCodeSVG 
              value={qrCodeData}
              size={72}
              level="M"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
