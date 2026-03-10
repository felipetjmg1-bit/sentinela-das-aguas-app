import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Upload, Camera, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const inspectionSchema = z.object({
  monitoringPointId: z.number().min(1, "Selecione um ponto de monitoramento"),
  inspectionDate: z.string().min(1, "Data da inspeção é obrigatória"),
  status: z.enum(["operational", "maintenance", "blocked", "flooded"]),
  findings: z.string().min(10, "Descreva os achados com pelo menos 10 caracteres"),
  maintenanceRequired: z.boolean().optional(),
});

type InspectionFormData = z.infer<typeof inspectionSchema>;

export default function InspectionForm() {
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InspectionFormData>({
    resolver: zodResolver(inspectionSchema),
    defaultValues: {
      inspectionDate: new Date().toISOString().split("T")[0],
      status: "operational",
      maintenanceRequired: false,
    },
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} não é uma imagem válida`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} excede o tamanho máximo de 10MB`);
        return false;
      }
      return true;
    });

    setUploadedPhotos((prev) => [...prev, ...validFiles]);
    toast.success(`${validFiles.length} foto(s) adicionada(s)`);
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: InspectionFormData) => {
    if (uploadedPhotos.length === 0) {
      toast.error("Adicione pelo menos uma foto da inspeção");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Upload photos to S3 and create inspection record
      // const uploadedUrls = await Promise.all(
      //   uploadedPhotos.map(photo => uploadToS3(photo))
      // );
      // await trpc.monitoring.createInspection.mutate({
      //   ...data,
      //   photos: uploadedUrls,
      // });

      toast.success("Inspeção registrada com sucesso!");
      form.reset();
      setUploadedPhotos([]);
    } catch (error) {
      toast.error("Erro ao registrar inspeção");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Registrar Inspeção de Bueiro
            </CardTitle>
            <CardDescription>
              Preencha o formulário e adicione fotos da inspeção
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Monitoring Point Selection */}
                <FormField
                  control={form.control}
                  name="monitoringPointId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ponto de Monitoramento</FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number(value))}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um bueiro" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Bueiro Avenida Getúlio Vargas</SelectItem>
                          <SelectItem value="2">Drenagem Rua Sergipe</SelectItem>
                          <SelectItem value="3">Rio das Velhas - Seção 1</SelectItem>
                          <SelectItem value="4">Bueiro Avenida Brasil</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Inspection Date */}
                <FormField
                  control={form.control}
                  name="inspectionDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data da Inspeção</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="operational">Operacional</SelectItem>
                          <SelectItem value="maintenance">Em Manutenção</SelectItem>
                          <SelectItem value="blocked">Bloqueado</SelectItem>
                          <SelectItem value="flooded">Inundado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Findings */}
                <FormField
                  control={form.control}
                  name="findings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Achados da Inspeção</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva os achados da inspeção (obstruções, danos, nível de água, etc.)"
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Mínimo de 10 caracteres
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Photo Upload */}
                <div className="space-y-4">
                  <FormLabel>Fotos da Inspeção</FormLabel>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
                    <label className="cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-sm font-medium">Clique para adicionar fotos</span>
                        <span className="text-xs text-gray-500">ou arraste arquivos aqui</span>
                        <span className="text-xs text-gray-400">JPG, PNG ou WebP até 10MB</span>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Uploaded Photos Preview */}
                  {uploadedPhotos.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">{uploadedPhotos.length} foto(s) selecionada(s)</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {uploadedPhotos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(photo)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                            >
                              ✕
                            </button>
                            <p className="text-xs text-gray-600 mt-1 truncate">{photo.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {isSubmitting ? "Enviando..." : "Registrar Inspeção"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
