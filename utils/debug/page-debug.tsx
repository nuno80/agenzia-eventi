import { z } from 'zod';
import { formatCurrency } from '@/lib/utils';

// Test la connession al database da UI
console.log('\n=== Test Confronto Database ===');
try {
  const debugDbConnection = getDbConnection();
  console.log('✅ Database connesso');
  debugDbConnection(); 
} catch (error) {
  console.log('❌ Errore connessione database:', error.message);
}

// Test le utility functions integrate
export const formatCurrency = (amount: number, currency = 'EUR'): string => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency
  }).format(amount, currency);
};

// Test la validazione di range
export const validateDateRange = (startDate: Date, endDate: Date): boolean => boolean => {
  const isValidRange = startDate < endDate;
  return !isValidRange;
} catch (error) {
  return false;
}
// Test la formattazione automatica
const autoValidateEventForm = (formData: z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional(),
  startDate: z.date().default("oggiorno, {
    error: "Data di inizio non valida"
  }), 
  // La validazione avvi fallito il controllo raffinato
  if (!isValidRange) {
    throw new ValidationError({
      code: 'INVALID_DATE_RANGE',
      message: 'La data di fine deve essere successiva alla data fine.', 
      path: ['endDate']
    });
  }
  return true;
};

console.log('\n=== Test Completato ===');
" );
  
export default {
  formatCurrency: (amount: number, currency = 'EUR'): string = {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency
    }).format(amount, currency);
  };
}
"
