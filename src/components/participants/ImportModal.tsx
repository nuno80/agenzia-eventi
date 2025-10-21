'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useQuery } from '@tanstack/react-query';
import { importFromCsv } from '@/actions/participantActions';
import { getJobStatus } from '@/actions/jobActions';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle, XCircle, Download } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  onSuccess: () => void;
}

export default function ImportModal({ 
  isOpen, 
  onClose, 
  eventId,
  onSuccess
}: ImportModalProps) {
  const [jobId, setJobId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Polling dello stato del job con TanStack Query
  const { data: job, isLoading: isPolling } = useQuery({
    queryKey: ['jobStatus', jobId],
    queryFn: () => getJobStatus(jobId!),
    enabled: !!jobId, // Esegui la query solo se c'è un jobId
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Interrompi il polling se il job è completato o fallito
      return status === 'COMPLETED' || status === 'FAILED' ? false : 2000;
    },
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('csvfile', file);
    
    try {
      const result = await importFromCsv(eventId, formData);
      
      if (result.error) {
        toast.error(result.error);
        setIsSubmitting(false);
      } else if (result.success) {
        setJobId(result.jobId);
        toast.success('Importazione avviata con successo');
        // Success callback will be called when job completes
      }
    } catch (error) {
      console.error('Error importing CSV:', error);
      toast.error('Errore durante l\'importazione');
      setIsSubmitting(false);
    }
  }, [eventId]);

  const { 
    getRootProps, 
    getInputProps, 
    isDragActive,
    acceptedFiles,
    fileRejections
  } = useDropzone({ 
    onDrop, 
    accept: { 'text/csv': ['.csv'] },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 1,
    multiple: false,
  });

  const handleClose = () => {
    if (job?.status === 'COMPLETED') {
      onSuccess();
    }
    setJobId(null);
    setIsSubmitting(false);
    onClose();
  };

  const getFileIcon = () => {
    if (!jobId) return <Upload className="h-8 w-8 mx-auto mb-4 text-gray-400" />;
    
    if (job?.status === 'COMPLETED') {
      return <CheckCircle className="h-8 w-8 mx-auto mb-4 text-green-500" />;
    }
    
    if (job?.status === 'FAILED') {
      return <XCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />;
    }
    
    return <FileText className="h-8 w-8 mx-auto mb-4 text-blue-500" />;
  };

  const renderContent = () => {
    if (jobId) {
      // Mostra lo stato del job
      const status = job?.status || 'PROCESSING';
      const result = job?.result;
      
      return (
        <div className="space-y-4">
          <div className="text-center">
            {getFileIcon()}
            <h3 className="text-lg font-semibold">
              {status === 'PROCESSING' && 'Importazione in corso...'}
              {status === 'COMPLETED' && 'Importazione completata'}
              {status === 'FAILED' && 'Importazione fallita'}
            </h3>
          </div>

          {/* Progress Indicator */}
          {status === 'PROCESSING' && (
            <div className="space-y-2">
              <Progress value={undefined} className="w-full" />
              <p className="text-sm text-gray-600 text-center">
                Elaborazione dei dati in corso...
              </p>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Risultati:</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Importati con successo:</span>
                  <span className="font-medium text-green-600">{result.successCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Errori:</span>
                  <span className="font-medium text-red-600">{result.errorCount}</span>
                </div>
                {result.total && (
                  <div className="flex justify-between">
                    <span>Totale righe:</span>
                    <span>{result.total}</span>
                  </div>
                )}
              </div>

              {/* Error details */}
              {result.errors && result.errors.length > 0 && (
                <div className="mt-3">
                  <h5 className="font-medium mb-1">Dettagli errori:</h5>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {result.errors.slice(0, 5).map((error: string, index: number) => (
                      <li key={index}>• {error}</li>
                    ))}
                    {result.errors.length > 5 && (
                      <li className="italic">... altri {result.errors.length - 5} errori</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            {status === 'FAILED' && (
              <Button
                variant="outline"
                onClick={() => setJobId(null)}
              >
                Riprova
              </Button>
            )}
            <Button onClick={handleClose}>
              {status === 'COMPLETED' ? 'Completato' : 'Chiudi'}
            </Button>
          </div>
        </div>
      );
    }

    // Mostra l'uploader
    return (
      <div className="space-y-4">
        <div className="text-center text-gray-600 mb-4">
          <p>Seleziona un file CSV contenente i partecipanti da importare.</p>
          <p className="text-sm mt-2">Il file deve contenere le colonne: Nome, Email, Ruolo (PARTICIPANT/SPEAKER)</p>
        </div>

        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} disabled={isSubmitting} />
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          {isDragActive ? (
            <p className="text-blue-600">Rilascia il file qui...</p>
          ) : (
            <div>
              <p className="text-gray-600">Trascina un file CSV qui, o clicca per selezionarlo</p>
              <p className="text-sm text-gray-500 mt-2">Max 5MB, formato .csv</p>
            </div>
          )}
        </div>

        {/* File previews */}
        {acceptedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">File selezionato:</h4>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <FileText className="h-4 w-4" />
              <span className="text-sm">{acceptedFiles[0].name}</span>
              <span className="text-xs text-gray-500">
                ({(acceptedFiles[0].size / 1024).toFixed(1)} KB)
              </span>
            </div>
          </div>
        )}

        {/* File rejections */}
        {fileRejections.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-red-600">File non validi:</h4>
            {fileRejections.map(({ file, errors }) => (
              <div key={file.name} className="text-sm text-red-600">
                {file.name}: {errors.map(e => e.message).join(', ')}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annulla
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importa Partecipanti da CSV</DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
