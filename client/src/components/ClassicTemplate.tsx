import { QRCodeSVG } from "qrcode.react";
import { StudentData } from "@/lib/types";

interface ClassicTemplateProps {
  studentData: StudentData;
}

const ClassicTemplate = ({ studentData }: ClassicTemplateProps) => {
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
    <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
      {/* Card Header */}
      <div className="bg-secondary p-3 text-white text-center">
        <h3 className="font-bold text-lg uppercase">Unity School</h3>
      </div>
      
      {/* Card Body */}
      <div className="p-4">
        <div className="flex flex-col items-center mb-3">
          <div className="w-28 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-300 mb-2">
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
          <h3 className="font-bold text-lg text-center text-gray-800 mt-1">{studentName}</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="border-b border-gray-200 pb-1">
            <p className="text-gray-500">Roll Number</p>
            <p className="font-semibold text-gray-800">{rollNumber}</p>
          </div>
          <div className="border-b border-gray-200 pb-1">
            <p className="text-gray-500">Class</p>
            <p className="font-semibold text-gray-800">{`${studentClass}-${division}`}</p>
          </div>
          <div className="border-b border-gray-200 pb-1">
            <p className="text-gray-500">Rack Number</p>
            <p className="font-semibold text-gray-800">{rackNumber}</p>
          </div>
          <div className="border-b border-gray-200 pb-1">
            <p className="text-gray-500">Bus Route</p>
            <p className="font-semibold text-gray-800">{busRoute}</p>
          </div>
        </div>
        
        {/* Allergies */}
        {allergies.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-medium text-gray-500 uppercase">Allergies:</p>
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
        <div className="mt-4 pt-2 border-t border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">Scan for student details:</p>
            <div className="w-20 h-20 bg-white border border-gray-200 p-1 flex items-center justify-center">
              <QRCodeSVG 
                value={qrCodeData}
                size={72}
                level="M"
              />
            </div>
          </div>
          <div className="text-right">
            <div className="h-10 mb-2 flex items-center justify-center">
              <svg className="h-10 w-auto" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="80" height="40" rx="4" fill="#f3f4f6" />
                <path d="M20 20h40M40 10v20" stroke="#9ca3af" strokeWidth="2" />
                <text x="40" y="25" textAnchor="middle" fill="#6b7280" style={{ font: 'bold 10px sans-serif' }}>UNITY</text>
              </svg>
            </div>
            <p className="text-xs text-gray-500">Valid for 2025-2026</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassicTemplate;
