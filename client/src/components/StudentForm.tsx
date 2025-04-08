import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, Camera } from "lucide-react";
import { useState, useEffect } from "react";
import { StudentData, TemplateType } from "@/lib/types";

const formSchema = z.object({
  studentName: z.string().min(1, "Name is required"),
  rollNumber: z.string().min(1, "Roll number is required"),
  class: z.string().min(1, "Class is required"),
  division: z.string().min(1, "Division is required"),
  allergies: z.array(z.string()).optional(),
  rackNumber: z.string().min(1, "Rack number is required"),
  busRoute: z.string().min(1, "Bus route is required"),
  template: z.enum(["modern", "classic"] as const).default("modern"),
});

type FormSchema = z.infer<typeof formSchema>;

interface StudentFormProps {
  onSubmit: (data: StudentData) => void;
  onTemplateChange: (template: TemplateType) => void;
  initialData: StudentData | null;
}

const StudentForm = ({ onSubmit, onTemplateChange, initialData }: StudentFormProps) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const { register, handleSubmit, watch, control, setValue, formState: { errors } } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: "",
      rollNumber: "",
      class: "",
      division: "",
      allergies: [],
      rackNumber: "",
      busRoute: "",
      template: "modern",
    }
  });

  // Watch template to trigger onTemplateChange callback
  const template = watch("template") as TemplateType;

  useEffect(() => {
    onTemplateChange(template);
  }, [template, onTemplateChange]);

  // Update form with initialData when available
  useEffect(() => {
    if (initialData) {
      setValue("studentName", initialData.studentName);
      setValue("rollNumber", initialData.rollNumber);
      setValue("class", initialData.class);
      setValue("division", initialData.division);
      setValue("allergies", initialData.allergies || []);
      setValue("rackNumber", initialData.rackNumber);
      setValue("busRoute", initialData.busRoute);
      setValue("template", initialData.template);
      setPhotoPreview(initialData.photo || null);
    }
  }, [initialData, setValue]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const processFormSubmit = (data: FormSchema) => {
    const studentData: StudentData = {
      ...data,
      photo: photoPreview || undefined,
      timestamp: new Date().toISOString(),
    };
    onSubmit(studentData);
  };

  const allergyOptions = [
    { id: "nuts", label: "Nuts" },
    { id: "dairy", label: "Dairy" },
    { id: "gluten", label: "Gluten" },
    { id: "seafood", label: "Seafood" },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Student Information</h2>
        
        <form onSubmit={handleSubmit(processFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="studentName">Full Name <span className="text-destructive">*</span></Label>
            <Input 
              id="studentName" 
              {...register("studentName")} 
              className={errors.studentName ? "border-destructive" : ""}
            />
            {errors.studentName && (
              <p className="text-sm text-destructive mt-1">{errors.studentName.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="rollNumber">Roll Number <span className="text-destructive">*</span></Label>
            <Input 
              id="rollNumber" 
              {...register("rollNumber")} 
              className={errors.rollNumber ? "border-destructive" : ""}
            />
            {errors.rollNumber && (
              <p className="text-sm text-destructive mt-1">{errors.rollNumber.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="class">Class <span className="text-destructive">*</span></Label>
              <Controller
                control={control}
                name="class"
                render={({ field }) => (
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger className={errors.class ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          Class {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.class && (
                <p className="text-sm text-destructive mt-1">{errors.class.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="division">Division <span className="text-destructive">*</span></Label>
              <Controller
                control={control}
                name="division"
                render={({ field }) => (
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger className={errors.division ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select Division" />
                    </SelectTrigger>
                    <SelectContent>
                      {["A", "B", "C", "D"].map((division) => (
                        <SelectItem key={division} value={division}>
                          {division}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.division && (
                <p className="text-sm text-destructive mt-1">{errors.division.message}</p>
              )}
            </div>
          </div>
          
          <div>
            <Label>Student Photo <span className="text-destructive">*</span></Label>
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <Label 
                  htmlFor="photo-upload" 
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Camera className="mb-1 h-6 w-6 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                  </div>
                  <Input 
                    id="photo-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handlePhotoChange}
                  />
                </Label>
              </div>
              <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                {photoPreview ? (
                  <img src={photoPreview} alt="Student" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-400 flex items-center justify-center h-full w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <Label>Allergies (if any)</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Controller
                control={control}
                name="allergies"
                render={({ field }) => (
                  <>
                    {allergyOptions.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`allergy-${option.id}`}
                          checked={field.value?.includes(option.label)}
                          onCheckedChange={(checked) => {
                            const currentValue = field.value || [];
                            const newValue = checked
                              ? [...currentValue, option.label]
                              : currentValue.filter((value) => value !== option.label);
                            field.onChange(newValue);
                          }}
                        />
                        <Label htmlFor={`allergy-${option.id}`} className="text-sm text-gray-700">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </>
                )}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rackNumber">Rack Number <span className="text-destructive">*</span></Label>
              <Input 
                id="rackNumber" 
                {...register("rackNumber")} 
                className={errors.rackNumber ? "border-destructive" : ""}
              />
              {errors.rackNumber && (
                <p className="text-sm text-destructive mt-1">{errors.rackNumber.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="busRoute">Bus Route Number <span className="text-destructive">*</span></Label>
              <Controller
                control={control}
                name="busRoute"
                render={({ field }) => (
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger className={errors.busRoute ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select Route" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="R1">Route 1</SelectItem>
                      <SelectItem value="R2">Route 2</SelectItem>
                      <SelectItem value="R3">Route 3</SelectItem>
                      <SelectItem value="R4">Route 4</SelectItem>
                      <SelectItem value="R5">Route 5</SelectItem>
                      <SelectItem value="NA">Not Applicable</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.busRoute && (
                <p className="text-sm text-destructive mt-1">{errors.busRoute.message}</p>
              )}
            </div>
          </div>
          
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">ID Card Template</Label>
            <Controller
              control={control}
              name="template"
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="relative">
                    <RadioGroupItem
                      value="modern"
                      id="modern"
                      className="sr-only peer"
                    />
                    <Label
                      htmlFor="modern"
                      className="flex flex-col border-2 rounded-lg p-2 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-blue-50 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="h-20 bg-gradient-to-r from-primary to-secondary rounded-md mb-1"></div>
                      <p className="text-xs text-center font-medium">Modern</p>
                    </Label>
                  </div>
                  
                  <div className="relative">
                    <RadioGroupItem
                      value="classic"
                      id="classic"
                      className="sr-only peer"
                    />
                    <Label
                      htmlFor="classic"
                      className="flex flex-col border-2 rounded-lg p-2 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-blue-50 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="h-20 bg-white border border-gray-200 rounded-md flex flex-col justify-center items-center">
                        <div className="w-full h-6 bg-secondary mb-2"></div>
                        <div className="w-2/3 h-4 bg-gray-200"></div>
                      </div>
                      <p className="text-xs text-center font-medium">Classic</p>
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>
          
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-blue-600 text-white"
            >
              <CheckCircle className="mr-1 h-4 w-4" />
              Generate ID Card
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentForm;
